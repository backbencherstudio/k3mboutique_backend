require("dotenv").config();
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const User = require("./users.models");
const Players = require("../players/players.model");
const Otp = require("./otp.model");
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");
const crypto = require("crypto");
const session = require("express-session");

const {
  generateOTP,
  sendUpdateEmailOTP,
  sendForgotPasswordOTP,
  sendRegistrationOTPEmail,
  sendOTPEmail,
  sendnewuserwelcome,
  sendAdminnewuserNotice,
} = require("../../util/otpUtils");

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 3600000,
    domain: process.env.COOKIE_DOMAIN,
  },
  proxy: true,
};

const generateToken = (id, email, role) => {
  return sign({ userId: id, email, role }, process.env.WEBTOKEN_SECRET_KEY, {
    expiresIn: "1d",
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(8);
  return await bcrypt.hash(password, salt);
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const registerUser = async (req, res) => {
  try {
    let { name, email, password, role, phone } = req.body;

    if (!(name && email && password)) {
      res.status(400).json({
        message: "Please fill all required fields",
      });
      return;
    }

    name = name.replace(/\s+/g, " ").trim();

    if (!isEmail(email)) {
      res.status(400).json({ message: "Please enter a valid email address" });
      return;
    }

    if (email === name) {
      res
        .status(400)
        .json({ message: "Email cannot be the same as your name" });
      return;
    }

    // Password validations
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be longer than 6 characters" });
      return;
    }

    if (password === name || password === email) {
      res.status(400).json({
        message: "Password cannot be the same as your name or email",
      });
      return;
    }

    const hashedPassword = await hashPassword(password);
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "Email is already registered. Please log in." });
    }

    if (!user) {
      if (role === "parent") {
        const parentaccess = await Players.findOne({
          parent_email: email,
        });

        // console.log(parentaccess);
        // console.log(email);
        if (!parentaccess) {
          return res
            .status(403)
            .json({ message: "You do not have permission to register." });
        }

        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          role,
          country: null,
          phone,
        });

        await newUser.save();
        const players = await Players.find({
          parent_email: email,
        });

       
        console.log(players);
        for (const player of players) {
          player.parent_id = newUser.id;
          player.active = true;
          await player.save();
        }

        return res.status(200).json({
          message: "Successfully Account Regitered",
        });
      }

      let country = "Unknown";
      try {
        const response = await fetch("http://get.geojs.io/v1/ip/geo.json");
        if (response.ok) {
          const data = await response.json();
          country = data.country || "Unknown";
        }
      } catch (error) {
        console.error("Error fetching IP-based location:", error.message);
      }

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        country,
        phone,
      });

      await newUser.save();

      // const otp = generateOTP();
      // const expiresAt = new Date(Date.now() + 1000 * 60 * 5);
      // await Otp.create({ userId: newUser._id, email, otp, type: "email_verification", expiresAt })

      // if (newUser.name) {
      //   await sendForgotPasswordOTP(newUser.name, newUser.email, otp);
      // }

      return res.status(200).json({
        message: "Successfully Account Regitered",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // if (user.isVerified === false) {
    //   return res
    //     .status(403)
    //     .json({ message: "Please verify your email before logging in." });
    // }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = sign(
      { userEmail: user.email, userId: user._id, role: user.role },
      process.env.WEBTOKEN_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    };

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.newpassword;
    delete userResponse.confirmPassword;

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ message: "Login successful", user: userResponse, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const checkAuthStatus = async (req, res) => {
  const JWT_SECRET = process.env.WEBTOKEN_SECRET_KEY;

  try {
    //const { token } = req.cookies;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication invalid" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(400).json({ authenticated: false });
      return;
    }

    verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid token", authenticated: false });
      }

      const userId = decoded?.userId;

      const userInfo = await User.findById(userId);

      const userResponse = userInfo?.toObject();
      delete userResponse?.password;
      delete userResponse?.newpassword;
      delete userResponse?.confirmPassword;
      if (!userInfo) {
        return res
          .status(404)
          .json({ message: "User not found", authenticated: false });
      }

      return res.status(200).json({ authenticated: true, user: userResponse });
    });
  } catch (error) {
    console.error("Error in checkAuthStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPasswordOTPsend = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: `User not found`,
      });
    }
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

    await Otp.create({
      userId: user._id,
      email,
      otp,
      type: "forgot_password",
      expiresAt,
    });

    if (user) {
      await sendForgotPasswordOTP(user.name, user.email, otp);
    }

    return res.status(200).json({
      message: "OTP sent successfully for password change",
    });
  } catch (error) {
    console.error("Error in forgotPasswordOTPsend:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasssword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const record = await Otp.findOne({ email, otp, type: "forgot_password" });
    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await hashPassword(password);

    await User.findOneAndUpdate({ email: email }, { password: hashedPassword });
    await Otp.deleteOne({ _id: record._id });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const hitToVarify = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = generateToken(user._id, user.email, user.role);
  sendnewuserwelcome(user.name, user.email, token);

  return res.status(201).json({ token, user: user, success: true });
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = verify(token, process.env.WEBTOKEN_SECRET_KEY);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    await user.save();
    setTokenCookie(res, token);

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const google = async (req, res, next) => {
  const { name, email, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // if (user.blacklist && new Date() > new Date(user.subscriptionEndDAte)) {
      //   return res.status(400).json({ message: "You are in blacklist!!" });
      // }
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      const token = sign(
        { userEmail: user.email, userId: user._id, role: user.role },
        process.env.WEBTOKEN_SECRET_KEY,
        { expiresIn: "1d" }
      );

      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      };
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.newpassword;
      delete userResponse.confirmPassword;
      return res
        .status(200)
        .cookie("token", token, options)
        .json({ message: "Login successful", user: userResponse, token });
    } else {
      if (!name || !email || !role) {
        return res
          .status(400)
          .json({ message: "Name, email, and role are required" });
      }
      const generatePass = Math.random().toString(36).slice(-8);
      const hashpasswoard = bcrypt.hashSync(generatePass, 10);

      let country = "Unknown";
      try {
        const response = await fetch("http://get.geojs.io/v1/ip/geo.json");
        if (response.ok) {
          const data = await response.json();
          country = data.country || "Unknown";
        }
      } catch (error) {
        console.error("Error fetching IP-based location:", error.message);
      }
      const user = new User({
        name: name,
        email: email,
        role: role,
        password: hashpasswoard,
        country,
        isVerified: true,
      });
      await user.save();
      // sendnewuserwelcome(name, email);
      // sendAdminnewuserNotice(name, email)
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.newpassword;
      delete userResponse.confirmPassword;

      const token = sign(
        { userEmail: user.email, userId: user._id },
        process.env.WEBTOKEN_SECRET_KEY,
        { expiresIn: "1d" }
      );
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      };
      return res
        .status(200)
        .cookie("token", token, options)
        .json({ message: "Login successful", user: userResponse, token });
    }
  } catch (err) {
    return console.log(err);
  }
};

const editUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const { password, ...updateData } = req.body;
    console.log(req.body);

    // Handle avatar if uploaded
    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar[0];
      if (user.avatar) {
        deleteImage(user.avatar);
      }
      updateData.avatar = avatarFile.filename;
    }

    // Handle lawnphoto if uploaded
    // if (req.files && req.files.lawnphoto) {
    //   const lawnphotoFile = req.files.lawnphoto[0];
    //   if (user.lawnphoto) {
    //     deleteImage(user.lawnphoto);
    //   }
    //   updateData.lawnphoto = lawnphotoFile.filename;
    // }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const matchForgotPasswordOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: `OTP is required`,
      });
    }
    if (otp !== req.session.forgotPasswordData.otp || otp === undefined) {
      res.status(400).json({
        message: `OTP does not match`,
      });
    }

    // Check if OTP is expired (15 minutes)
    const otpAge = Date.now() - req.session.forgotPasswordData.timestamp;
    if (otpAge > 15 * 60 * 1000) {
      delete req.session.forgotPasswordData;
      return res.status(400).json({
        message: `OTP has expired. Please request a new one`,
      });
    }

    if (otp !== req.session.forgotPasswordData.otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    req.session.forgotPasswordData.isVerified = true;
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    return res.status(200).json({
      success: true,
      message: "OTP matched successfully",
    });
  } catch (error) {
    console.error("Error in matchForgotPasswordOTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const varifyEmailWithOTP = async (req, res) => {
  try {
    const { email, otp, type } = req.body;

    const record = await Otp.findOne({ email, otp, type });
    console.log(record);
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Otp.deleteOne({ _id: record._id });

    user.isVerified = true;
    await user.save();

    const token = sign(
      { userEmail: user.email, userId: user._id, role: user.role },
      process.env.WEBTOKEN_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.newpassword;
    delete userResponse.confirmPassword;

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .json({ message: "Register successful", user: userResponse, token });
  } catch (error) {
    console.error("Error in matchForgotPasswordOTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const userAlltotalCredit = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const result = await Transection.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$userId",
          totalCredit: { $sum: "$credit" },
          extraCreditCount: {
            $sum: { $cond: [{ $eq: ["$method", "extracredit"] }, 1, 0] },
          },
        },
      },
    ]);

    if (result.length > 0) {
      const { totalCredit, extraCreditCount } = result[0];
      return res.status(200).json({ totalCredit, extraCreditCount });
    } else {
      return res.status(200).json({ totalCredit: 0, extraCreditCount: 0 });
    }
  } catch (error) {
    console.error(
      "Error calculating total credit and extra credit count:",
      error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

const allRegisterBeatandTransections = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const beats = await Beat.find({ userId }).sort({ createdAt: -1 });
    const transactions = await Transection.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      beats,
      transactions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const OneUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select(
      "-password -newpassword -confirmPassword"
    );

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const userbalance = async (req, res) => {
  const userId = req.userId;
  try {
    const wallet = await Wallet.find({
      userId: userId,
    });
    return res.status(200).json({ wallet: wallet });
  } catch (error) {
    console.error("Error fetching user balance:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const myReferral = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      code: user.referralCode,
      count: user.referralCount,
      earned: user.earnedServices,
    });
  } catch (error) {
    console.error("Error fetching referral data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

function deleteImage(imagePath) {
  const uploadsFolder = path.resolve(__dirname, "..", "..", "uploads/images");
  const filePath = path.join(uploadsFolder, imagePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist:", err);
      return;
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
        return;
      }
      console.log("File deleted successfully");
    });
  });
}

function generateResetToken() {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  return otp.toString(); // Return it as a string
}

module.exports = {
  checkAuthStatus,
  logout,
  resetPasssword,
  varifyEmailWithOTP,
  forgotPasswordOTPsend,
  matchForgotPasswordOTP,
  editUserProfile,
  authenticateUser,
  registerUser,
  hitToVarify,
  verifyEmail,
  userAlltotalCredit,
  allRegisterBeatandTransections,
  OneUser,
  google,
  userbalance,
  myReferral,
};
