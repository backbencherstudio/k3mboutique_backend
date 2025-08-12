
const dotenv = require("dotenv");
dotenv.config();

const Dashboard = process.env.RETURN_URL

const emailMessage = (userName, email, OTP) => {
    return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    
    <h2 style="color: #007bff;">Welcome to BeatProtect</h2>
    <p style="color: #333; font-size: 18px;">Hi ${userName},</p>
    <p style="color: #333; font-size: 16px;">Thank you for signing up with TravelAgency. To complete your registration, please use the OTP code below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <div style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; font-size: 24px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${OTP}</div>
    </div>
    <p style="color: #333; font-size: 16px;">This OTP is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
    <p style="color: #333; font-size: 16px;">Cheers,</p>
    <p style="color: #333; font-size: 16px;">The TravelAgency Team</p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you did not sign up for TravelAgency, please disregard this email.</p>
  </div>
`;
};

const emailUpdateOTP = (userName, email, newOTP) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      
      <h2 style="color: #007bff;">Update OTP for BeatProtect App</h2>
      <p style="color: #333; font-size: 18px;">Hi ${userName},</p>
      <p style="color: #333; font-size: 16px;">We have received a request to update the OTP for your account on BeatProtect App. Please use the new OTP code below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <div style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; font-size: 24px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${newOTP}</div>
      </div>
      <p style="color: #333; font-size: 16px;">This OTP is valid for 10 minutes. If you did not request this update, please ignore this email.</p>
      <p style="color: #333; font-size: 16px;">Cheers,</p>
      <p style="color: #333; font-size: 16px;">The BeatProtect Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you are not expecting this OTP update, please disregard this email.</p>
    </div>
  `;
};

const emailForgotPasswordOTP = (userName, email, OTP) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      
      <h2 style="color: #007bff;">Forgot Password Request</h2>
      <p style="color: #333; font-size: 18px;">Hi ${userName},</p>
      <p style="color: #333; font-size: 16px;">You have requested to reset your password on BeatProtect App. Please use the OTP code below to proceed:</p>
      <div style="text-align: center; margin: 20px 0;">
        <div style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; font-size: 24px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${OTP}</div>
      </div>
      <p style="color: #333; font-size: 16px;">This OTP is valid for 10 minutes. If you did not request this password reset, please ignore this email.</p>
      <p style="color: #333; font-size: 16px;">Cheers,</p>
      <p style="color: #333; font-size: 16px;">The BeatProtect Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you did not initiate this password reset, please disregard this email.</p>
    </div>
  `;
};

const resendRegistrationOTPEmail = (userName, email, OTP) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
     
      <h2 style="color: #007bff;">Resend Registration OTP</h2>
      <p style="color: #333; font-size: 18px;">Hi ${userName},</p>
      <p style="color: #333; font-size: 16px;">We noticed you requested a new OTP code for completing your registration on BeatProtect App. Please use the OTP code below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <div style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; font-size: 24px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${OTP}</div>
      </div>
      <p style="color: #333; font-size: 16px;">This OTP is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
      <p style="color: #333; font-size: 16px;">Cheers,</p>
      <p style="color: #333; font-size: 16px;">The BeatProtect App Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you did not sign up forBeatProtect App, please disregard this email.</p>
    </div>
  `;
};


const sendWelcomeEmail = (userName, email, token) => {
    const confirmationUrl = `${process.env.CLIENT_URL}/api/users/verify-email/${token}`
    const siteUrl = "dummy"
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to BetProtect</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <tr>
                <td style="padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <!-- Header with Logo -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="text-align: center; padding: 20px;">
                                <img src="https://backend.beatprotect.io/public/Logo%2010%20BP%20Black%20(1).png" alt="BeatProtect Logo" style="max-width: 200px; height: auto;">
                            </td>
                        </tr>
                    </table>

                    <!-- Main Content -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0;">Welcome to BetProtect!</h1>
                                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                    Hi ${userName}, thank you for registering with BetProtect. We're excited to have you on board!
                                </p>
                                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                    Please verify your email address by clicking the button below:
                                </p>
                                
                                <!-- Verification Button -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                                    <tr>
                                        <td style="border-radius: 4px; background-color: #7C3AED;">
                                            <a href="${confirmationUrl}" 
                                               style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;">
                                                Verify Email Address
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                                    Or copy and paste this link in your browser:
                                    <br>
                                    <a href="${confirmationUrl}" style="color: #7C3AED; text-decoration: none;">
                                        ${confirmationUrl}
                                    </a>
                                </p>

                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                                    If you didn't create an account with BetProtect, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>
                    </table>

                    <!-- Footer -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="color: #999999; font-size: 12px; margin: 0;">
                                    © 2024 BetProtect. All rights reserved.
                                </p>
                                <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                                    This email was sent to ${email}. If you did not sign up, please ignore this email.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};

const sendAdminNewProducerNotification = (userName, email) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      
      <h2 style="color: #dc3545;">New Producer Registration</h2>
      <p style="color: #333; font-size: 18px;">Hello Admin,</p>
      <p style="color: #333; font-size: 16px;">A new producer has just registered on the BetProtect portal.</p>
      <p style="color: #333; font-size: 16px;"><strong>Name:</strong> ${userName}</p>
      <p style="color: #333; font-size: 16px;"><strong>Email:</strong> ${email}</p>
      <p style="color: #333; font-size: 16px;">Please review their profile and take necessary actions if required.</p>
      <p style="color: #333; font-size: 16px;">Best regards,</p>
      <p style="color: #333; font-size: 16px;">BetProtect System</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This is an automated notification. No action is required unless necessary.</p>
    </div>
  `;
};



const sendCreditsAddedEmail = (userName, email, creditAmount, siteURL) => {

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BeatProtect Credit Purchase Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <tr>
                  <td style="padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                      <!-- Header with Logo -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                              <td style="text-align: center; padding: 20px;">
                                  <img src="https://backend.beatprotect.io/public/Logo%2010%20BP%20Black%20(1).png" alt="BeatProtect Logo" style="max-width: 200px; height: auto;">
                              </td>
                          </tr>
                      </table>
  
                      <!-- Main Content -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                              <td style="padding: 20px; text-align: center;">
                                  <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0;">Thank You for Your Purchase!</h1>
                                  <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                      Your credit purchase has been successfully completed. You're now ready to protect more of your beats!
                                  </p>
  
                                  <!-- Purchase Details Box -->
                                  <div style="background-color: #f8f8f8; border-radius: 4px; padding: 20px; margin: 20px 0; text-align: left;">
                                      <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin: 0;">
                                          <strong>Purchase Details:</strong><br>
                                          Credits Added: <strong>${creditAmount}</strong><br>
                                      </p>
                                  </div>
  
                                  <!-- Information Box -->
                                  <div style="background-color: #F0F9FF; border-radius: 4px; padding: 20px; margin: 20px 0; text-align: left;">
                                      <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin: 0;">
                                          <strong>How to Use Your Credits:</strong><br>
                                          1. Go to your dashboard<br>
                                          2. Click on "Register New Beat"<br>
                                          3. Upload your beat and complete the registration<br>
                                          4. One credit will be deducted per beat registration
                                      </p>
                                  </div>
  
                                  <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 20px 0;">
                                      Ready to protect more of your beats? Start registering them now:
                                  </p>
                                  
                                  <!-- Register Button -->
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                                      <tr>
                                          <td style="border-radius: 4px; background-color: #7C3AED;">
                                              <a href="${Dashboard}" 
                                                 style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;">
                                                  Register Your Beats
                                              </a>
                                          </td>
                                      </tr>
                                  </table>
  
                                  <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                                      Need help or have questions about your credits? Our support team is available 24/7 to assist you.
                                  </p>
                              </td>
                          </tr>
                      </table>
  
                      <!-- Footer -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                              <td style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                  <p style="color: #999999; font-size: 12px; margin: 0;">
                                      © 2024 BeatProtect. All rights reserved.
                                  </p>
                                  <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                                      You received this email because you purchased additional credits on BeatProtect.
                                  </p>
                                  <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                                      This email was sent to ${email}. If you did not request this action, please disregard this email.
                                  </p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;
};




const sendNewSubscriptionEmail = (userName, email, creditBalance, nextBillingDate) => {
    const siteURL = "dummy";
    const amount = 9.99;
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation - BeatProtect</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <tr>
                <td style="padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="text-align: center; padding: 20px;">
                                <img src="https://backend.beatprotect.io/public/Logo%2010%20BP%20Black%20(1).png" alt="BeatProtect Logo" style="max-width: 200px; height: auto;">
                            </td>
                        </tr>
                    </table>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0;">Payment Confirmed!</h1>
                                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                    Hi ${userName}, your subscription has been successfully activated!
                                </p>

                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0; background-color: #f8f8f8; border-radius: 4px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 15px 0;">Subscription Details</h2>
                                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 5px 0;">
                                                Plan: Monthly Beat Protection
                                            </p>
                                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 5px 0;">
                                                Amount: $${amount}
                                            </p>
                                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 5px 0;">
                                                Next Billing Date: ${nextBillingDate}
                                            </p>
                                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 5px 0;">
                                                Current Credit Balance: <strong>${creditBalance}</strong>
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                                    <tr>
                                        <td style="border-radius: 4px; background-color: #7C3AED;">
                                            <a href="${Dashboard}" 
                                               style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;">
                                                Access Dashboard
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                                    You can now start registering your beats and protecting your work. If you have any questions, 
                                    please contact our support team.
                                </p>
                            </td>
                        </tr>
                    </table>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="color: #999999; font-size: 12px; margin: 0;">
                                    © 2024 BeatProtect. All rights reserved.
                                </p>
                                <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                                    This is an automated message, please do not reply to this email.
                                    For support, contact us at support@beatprotect.com
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};




const SubscriptionCanceledEmail = (userName, email) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BeatProtect Membership Cancellation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <tr>
                <td style="padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <!-- Header with Logo -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="text-align: center; padding: 20px;">
                                <img src="https://backend.beatprotect.io/public/Logo%2010%20BP%20Black%20(1).png" alt="BeatProtect Logo" style="max-width: 200px; height: auto;">
                            </td>
                        </tr>
                    </table>

                    <!-- Main Content -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0;">Membership Cancellation</h1>
                                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                    We're sorry to see you go, ${userName}. Your BeatProtect membership has been cancelled as requested.
                                </p>

                                <!-- Important Information Box -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                                    <tr>
                                        <td style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; text-align: left;">
                                            <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin: 0;">
                                                <strong>Important:</strong> All your previously registered beats remain protected in our system. They will continue to be monitored and protected.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Warning Box -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                                    <tr>
                                        <td style="background-color: #FEF2F2; padding: 20px; border-radius: 4px; text-align: left;">
                                            <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin: 0;">
                                                <strong>Please Note:</strong> Without an active membership, any new beats you release without registration will not be protected. This could put your work at risk.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                    Changed your mind? You can reactivate your membership anytime:
                                </p>

                                <!-- Reactivate Button -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                                    <tr>
                                        <td style="border-radius: 4px; background-color: #7C3AED;">
                                            <a href="${Dashboard}" 
                                               style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;">
                                                Reactivate Membership
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                                    If you have any questions or concerns, our support team is here to help.
                                </p>
                            </td>
                        </tr>
                    </table>

                    <!-- Footer -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="color: #999999; font-size: 12px; margin: 0;">
                                    © 2024 BeatProtect. All rights reserved.
                                </p>
                                <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                                    This email was sent to ${email}. If you have any questions, please contact our support team.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
};



const KeyEventNotificationEmail = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BeatProtect - Beat Successfully Registered</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <tr>
                <td style="padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <!-- Header with Logo -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="text-align: center; padding: 20px;">
                                <img src="https://backend.beatprotect.io/public/Logo%2010%20BP%20Black%20(1).png" alt="BeatProtect Logo" style="max-width: 150px; height: auto;">
                            </td>
                        </tr>
                    </table>

                    <!-- Main Content -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0;">Beat Successfully Registered</h1>
                                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                    Congratulations! Your beat has been successfully registered in our system and is now protected.
                                </p>

                                <!-- Important Information Box -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                                    <tr>
                                        <td style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; text-align: left;">
                                            <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin: 0;">
                                                <strong>Important:</strong> Your certificate of registration will be available for download within the next 24 hours. You'll be able to access it from your dashboard.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Protection Box -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                                    <tr>
                                        <td style="background-color: #e8f5e9; padding: 20px; border-radius: 4px; text-align: left;">
                                            <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin: 0;">
                                                <strong>Your beat is now protected.</strong> Our system will monitor for unauthorized use across platforms and alert you if we detect any potential infringement.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                    Visit your dashboard to track your protected beats and check the status of your certificate:
                                </p>

                                <!-- Dashboard Button -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                                    <tr>
                                        <td style="border-radius: 4px; background-color: #6C30F5;">
                                            <a href="${Dashboard}" 
                                               style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;">
                                                Go to Dashboard
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                                    Thank you for trusting BeatProtect to protect your creative work.
                                </p>
                            </td>
                        </tr>
                    </table>

                    <!-- Footer -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="color: #999999; font-size: 12px; margin: 0;">
                                    © 2024 BeatProtect. All rights reserved.
                                </p>
                                <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                                    You received this email because you have a BeatProtect account.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
  }



const KeyEventFailedNotificationEmail = (userName, email) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    
      <h2 style="color: #dc3545;">Notification: Event Registration Failed</h2>
      <p style="color: #333; font-size: 18px;">Hi ${userName},</p>
      <p style="color: #333; font-size: 16px;">You will now receive <strong>email notifications</strong> for key events, including <span style="color: #dc3545; font-weight: bold;">failed</span> registrations of new beats. Stay informed and never miss an important update!</p>
      <p style="color: #333; font-size: 16px;">Thank you for using our service.</p>
      <p style="color: #333; font-size: 16px;">Best regards,</p>
      <p style="color: #333; font-size: 16px;">The BeatProtect Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you have any questions or need assistance, please contact our support team.</p>
    </div>
  `;
};

const resetPasswordEmail = (email, resetToken) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
     
      <h2 style="color: #007bff;">Password Reset Request</h2>
      <p style="color: #333; font-size: 18px;">Hello,</p>
      <p style="color: #333; font-size: 16px;">You requested a password reset. Please use the following token to reset your password:</p>
      <p style="color: #333; font-size: 16px; font-weight: bold; color: #007bff;">Token: ${resetToken}</p>
      <p style="color: #333; font-size: 16px;">Note: The token will expire in 1 hour.</p>
      <p style="color: #333; font-size: 16px;">If you did not request a password reset, please ignore this email.</p>
      <p style="color: #333; font-size: 16px;">Thank you for using our service.</p>
      <p style="color: #333; font-size: 16px;">Best regards,</p>
      <p style="color: #333; font-size: 16px;">The Support Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you have any questions or need assistance, please contact our support team.</p>
    </div>
  `;
};


module.exports = {
    emailMessage, emailUpdateOTP, emailForgotPasswordOTP, resendRegistrationOTPEmail, sendWelcomeEmail, sendAdminNewProducerNotification, sendCreditsAddedEmail, sendNewSubscriptionEmail
    , SubscriptionCanceledEmail, KeyEventNotificationEmail, KeyEventFailedNotificationEmail, resetPasswordEmail
};