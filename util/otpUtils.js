const nodemailer = require("nodemailer");
const path = require('path');
const {
  emailForgotPasswordOTP,
  emailMessage,
  emailUpdateOTP,
  resendRegistrationOTPEmail,
  sendCreditsAddedEmail,
  sendNewSubscriptionEmail,
  SubscriptionCanceledEmail,
  KeyEventNotificationEmail,
  KeyEventFailedNotificationEmail,
  resetPasswordEmail,
  sendWelcomeEmail,
  sendAdminNewProducerNotification
} = require("../constants/email_message");
require("dotenv").config();
const postmark = require('postmark');

// const generateOTP = () => {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// };

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (to, subject, htmlContent) => {
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",

    port: 587, // Explicitly set the port
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
   
  });

   const mailOptions = {
    from: `"Lawn Lemur" <tqmhosain@gmail.com>`,
    to,
    subject,
    html: htmlContent,
   
  };

  try {
    await mailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error if you want calling code to handle it
  }
 
};




const sendRegistrationOTPEmail = async (userName, email, otp) => {

  try {
      await sendEmail(
    email,
    "Your OTP Code for MusicApp",
    emailMessage(userName, email, otp)
  );
  } catch (error) {
    console.log("error");
    
  }


};

const sendUpdateEmailOTP = async (userName, email, otp) => {
  await sendEmail(
    email,
    "Your OTP Code for MusicApp",
    emailUpdateOTP(userName, email, otp)
  );
};

const sendForgotPasswordOTP = async (userName, email, otp) => {
  await sendEmail(
    email,
    "Your OTP Code for BeatProtect",
    emailForgotPasswordOTP(userName, email, otp)
  );
};

const resendRegistrationOTP = async (userName, email, otp) => {
  await sendEmail(
    email,
    "Your OTP Code for MusicApp",
    resendRegistrationOTPEmail(userName, email, otp)
  );
};

// -----------------------------------------------------------------------------------------------------------------------------

const sendnewuserwelcome = async (userName, email, token) => {
  await sendEmail(
    email,
    "Welcome to BeatProtect! Your Account is Ready",
    sendWelcomeEmail(userName, email, token)
  );
};

const sendAdminnewuserNotice = async (userName, email) => {
  await sendEmail(
    "support@beatprotect.io",
    "New User Register in BeatProtect",
    sendAdminNewProducerNotification(userName, email)
  );
};



const sendExtraCreditEmail = async (userName, email, creditBalance) => {
  await sendEmail(
    email,
    "Extra Credits Unlocked! More Beats, More Protection",
    sendCreditsAddedEmail(userName, email, creditBalance)
  );
};
const sendSubscriptionEmail = async (userName, email, creditBalance , nextBillingDate) => {
  await sendEmail(
    email,
    "Your Protection is ON! BeatProtect Membership Confirmed",
    sendNewSubscriptionEmail(userName, email, creditBalance, nextBillingDate)
  );
};
const sendSubscriptioncancelEmail = async (userName, email) => {
  await sendEmail(
    email,
    "Your Membership Has Been Canceled - We'll Miss You!",
    SubscriptionCanceledEmail(userName, email)
  );
};
const sendBeatSucceslEmail = async (userName, email) => {
  await sendEmail(
    email,
    "New Beat Successfully Registered",
    KeyEventNotificationEmail(userName, email)
  );
};
const sendBeatFailEmail = async (userName, email) => {
  await sendEmail(
    email,
    "New Music Beat Registrasion Failed!!",
    KeyEventFailedNotificationEmail(userName, email)
  );
};

const sendOTPEmail = async (email, resetToken) => {
  await sendEmail(
    email,
    "Password Reset Token",
    resetPasswordEmail(email, resetToken)
  );
};

module.exports = {
  generateOTP,
  sendEmail,
  sendRegistrationOTPEmail,
  sendUpdateEmailOTP,
  sendForgotPasswordOTP,
  resendRegistrationOTP,
  sendExtraCreditEmail,
  sendSubscriptionEmail,
  sendSubscriptioncancelEmail,
  sendBeatSucceslEmail,
  sendBeatFailEmail,
  sendOTPEmail,
  sendnewuserwelcome,
  sendAdminnewuserNotice
};
