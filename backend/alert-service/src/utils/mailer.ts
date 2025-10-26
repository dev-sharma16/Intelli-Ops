import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendAlertEmail = async (
  to: string,
  subject: string,
  text: string
) => {
  try {
    await transporter.sendMail({
      from: `"IntelliOps Alerts" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (err: any) {
    console.error('Email sending failed:', err);
  }
};
