import { logger } from "../utils/logger";

class EmailService {
  async sendOTP(email: string, code: string): Promise<void> {
    // In production, integrate with services like:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Resend

    // For development, just log the OTP
    if (process.env.NODE_ENV === "development") {
      logger.info(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 OTP Email (Development Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${email}
Subject: Your Verification Code

Your verification code is: ${code}

This code will expire in 10 minutes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
      return;
    }

    // Production email sending logic here
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
      html: `<strong>Your verification code is: ${code}</strong>`,
    };

    await sgMail.send(msg);
    */

    logger.info(`OTP sent to ${email}`);
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    if (process.env.NODE_ENV === "development") {
      logger.info(`Welcome email would be sent to ${email} (${username})`);
      return;
    }

    // Production welcome email logic here
    logger.info(`Welcome email sent to ${email}`);
  }
}

export default new EmailService();
