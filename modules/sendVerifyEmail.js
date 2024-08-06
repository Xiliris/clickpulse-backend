const nodeMailer = require("nodemailer");

const {
  FRONTEND_URL,
  serviceEmail,
  serviceEmailUsername,
  serviceEmailPassword,
  serviceWebsite,
} = process.env;

module.exports = async (userEmail, code) => {
  try {
    const htmlTemplate = require("./email-html");

    const html = htmlTemplate(code, serviceWebsite);

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: serviceEmailUsername,
        pass: serviceEmailPassword,
      },
    });

    await transporter.sendMail({
      auth: {
        user: serviceEmailUsername,
        pass: serviceEmailPassword,
      },
      from: serviceEmail,
      to: userEmail,
      subject: "Verify your account.",
      html,
    });
  } catch (error) {
    console.error(error);
  }
};
