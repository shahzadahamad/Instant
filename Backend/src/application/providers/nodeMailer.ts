import nodemailer, { Transporter } from "nodemailer";
import { EmailOptions } from "../../types/authentication/authenticationTypes";
import dotenv from "dotenv";
dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

export const sendEmail = async (emailOptions: EmailOptions) => {
  
  try {
    const { to, otp, fullname } = emailOptions;

    const info = await transporter.sendMail({
      from: process.env.MAILER_EMAIL,
      to,
      subject: "Instant Application Verification!",
      text: `Hi ${fullname}, welcome to Instant! Your OTP is ${otp}.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to Instant, ${fullname}!</h2>
          <p>We’re thrilled to have you join our community!</p>
          <p>Connect with friends, share your moments, and explore what's trending.</p>
          <p>To get started, please verify your account using the OTP below:</p>
          <h3 style="color: #ff6600;">Your OTP: ${otp}</h3>
          <p>Enter this OTP in the app to complete your registration.</p>
          <p>If you have any questions or need support, we’re here to help.</p>
          <p>Enjoy your time on Instant!</p>
          <br>
          <p>Best regards,</p>
          <p>The Instant Team</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send mail");
  }
};
