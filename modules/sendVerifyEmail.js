const nodeMailer = require("nodemailer");

const { FRONTEND_URL, serviceEmail, servicePassword, serviceWebsite } =
  process.env;

module.exports = async (userEmail, code) => {
  try {
    const htmlTemplate = require("./email-html");

    const html = htmlTemplate(
      `${FRONTEND_URL}/auth/verify/${code}`,
      serviceWebsite
    );

    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: serviceEmail,
        pass: servicePassword,
      },
    });

    await transporter.sendMail({
      from: serviceEmail,
      to: userEmail,
      subject: "Verify your account.",
      html,
    });
  } catch (error) {
    console.error(error);
  }
};
