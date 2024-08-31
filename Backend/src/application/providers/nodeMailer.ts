import nodemailer, { Transporter } from "nodemailer";
import {
  EmailOptionsOtp,
  EmailOptionsResetPassword,
} from "../interface/emailInterface";
import { emailConfig } from "../../infrastructure/configs/nodeEmailerConfig";
import dotenv from "dotenv";
dotenv.config();

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendEmailOtp(emailOptions: EmailOptionsOtp): Promise<boolean> {
    try {
      const { to, otp, fullname } = emailOptions;

      await this.transporter.sendMail({
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

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send mail");
    }
  }

  async sendEmailResetPassword(
    emailOptions: EmailOptionsResetPassword
  ): Promise<boolean> {
    try {
      const { to, fullname, userId, token } = emailOptions;

      const resetLink = `http://localhost:5173/reset-password/${userId}/${token}`;

      await this.transporter.sendMail({
        from: process.env.MAILER_EMAIL,
        to,
        subject: "Instant - Reset Your Password",
        text: `Hi ${fullname},\n\nIt seems like you requested to reset your password. You can reset it by clicking the link below:\n\n${resetLink}\n\nIf you didn't request a password reset, please ignore this email.\n\nBest regards,\nThe Instant Team`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hello, ${fullname}</h2>
            <p>It seems like you requested to reset your password. You can reset it by clicking the link below:</p>
            <a href="${resetLink}" style="background-color: #ff6600; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <br>
            <p>Best regards,</p>
            <p>The Instant Team</p>
          </div>
        `,
      });

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send mail");
    }
  }
}
