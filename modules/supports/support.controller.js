require("dotenv").config();
const SupportRequest = require("./support.model");
const postmark = require("postmark");

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

exports.create = async (req, res) => {
  const { name, email, issue } = req.body;

  if (!name || !email || !issue) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {

    const supportRequest = new SupportRequest({ name, email, issue });
    await supportRequest.save();

    // Send email to support team via Postmark
    // await client.sendEmail({
    //   From: process.env.POSTMARK_SENDER_EMAIL,  // Your verified Postmark sender email (e.g., noreply@beatprotect.io)
    //   To: process.env.NODE_MAILER_RECIEVER,    // Support team's email
    //   Subject: "New Support Request",
    //   TextBody: `Name: ${name}\nEmail: ${email}\nIssue: ${issue}`,
    //   ReplyTo: email,  // Set the user's email as the reply-to address
    // });

    res
      .status(200)
      .json({ message: "Message sent! We'll get back to you as soon as possible." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit support request." });
  }
};

exports.getAllSupportRequests = async (req, res) => {
  try {

    const supportRequests = await SupportRequest.find().sort({ createdAt: -1 });


    return res.status(200).json(supportRequests);
  } catch (error) {
    console.error("Error fetching support requests:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch support requests." });
  }
};
