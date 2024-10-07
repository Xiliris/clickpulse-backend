const htmlTemplate = require("./change-password-html");
const { EMAIL, EMAIL_PASSWORD, FRONTEND_URL } = process.env;

const nodemailer = require("nodemailer");

module.exports = async (userEmail, code) => {
  try {
    const html = htmlTemplate(code, FRONTEND_URL);

    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `No Reply <${EMAIL}>`,
      to: userEmail,
      subject: "Chage password at clickpulse.xyz",
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
};
