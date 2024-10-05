const htmlTemplate = require("./email-html");
const { EMAIL, EMAIL_PASSWORD, FRONTEND_URL } = process.env;

const nodemailer = require("nodemailer");

module.exports = async (userEmail, code) => {
  try {
    const html = htmlTemplate(code, FRONTEND_URL);

    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `No Reply <${EMAIL}>`,
      to: userEmail,
      subject: "Verify your account at clickpulse.xyz",
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
};
