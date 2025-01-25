const nodeMailer = require("nodemailer");
const { EMAIL_ID, EMAIL_PASS } = require("./config");

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: "Gmail",
      auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: EMAIL_ID,
      to: email,
      subject: subject,
      html: html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error in sending mail!", error);
  }
};

module.exports = sendEmail;
