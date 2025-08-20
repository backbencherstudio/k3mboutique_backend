const {
  checkAuthStatus,
  registerUser,
  authenticateUser,
  editUserProfile,
  forgotPasswordOTPsend,
  resetPasssword,
  logout,
  OneUser,
  google,
  verifyEmail,
  hitToVarify,
  varifyEmailWithOTP,
  userbalance,
  myReferral,
  updateEmail,

} = require("./users.controllers");
const { verifyUser } = require("../../middleware/verifyUser");
const upload = require("../../middleware/multer.config.single");

const route = require("express").Router();

// -------------------------------------------------------------------------------


route.post("/register", registerUser);
route.post("/login", authenticateUser);
route.get("/check", verifyUser, checkAuthStatus);


route.post("/request-forgot-password-otp", forgotPasswordOTPsend);
route.patch("/reset-forgot-password", resetPasssword);

route.put("/update-profile/:userId", verifyUser, upload.uploadProfileImage, editUserProfile);
route.patch("/emailUpdate", verifyUser, updateEmail)















route.post("/varify-emeil-with-otp", varifyEmailWithOTP);


// route.post("/match-password-otp", matchForgotPasswordOTP);

route.post("/logout", verifyUser, logout);



route.get("/my-balance", verifyUser, userbalance);
route.get('/my-referral', verifyUser, myReferral);

route.post("/google/login", google);
// ----------------------------------------------------------------------------------------------
// --



route.get("/first-step-varify-mail", verifyUser, hitToVarify);
route.get("/verify-email/:token", verifyEmail);





route.get("/oneUserDetails/:userId", verifyUser, OneUser);


module.exports = route;
