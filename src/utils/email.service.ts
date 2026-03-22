/**
 * Email Service using Resend API
 * Sends OTP via email for email verification.
 *
 * Resend Docs: https://resend.com/docs
 */

import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

export class EmailService {
  /**
   * Send OTP to an email address via Resend.
   *
   * @param email - The recipient email address
   * @param otp   - The OTP code to send
   * @returns     - The Resend email ID
   */
  async sendOtp(email: string, otp: string): Promise<string> {
    if (!env.RESEND_API_KEY) {
      console.warn('[EMAIL] RESEND_API_KEY not set — skipping email send');
      return 'NO_API_KEY';
    }

    console.log(`[EMAIL] Sending OTP to ${email} via Resend`);

    try {
      const { data, error } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: email,
        subject: 'Your SwipeBuddy Verification Code',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
            <h2 style="color: #1f2937; text-align: center; margin-bottom: 8px;">SwipeBuddy</h2>
            <p style="color: #6b7280; text-align: center; margin-bottom: 24px;">Email Verification</p>
            <div style="background: #ffffff; border-radius: 8px; padding: 24px; text-align: center; border: 1px solid #e5e7eb;">
              <p style="color: #374151; margin-bottom: 16px;">Your verification code is:</p>
              <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5; padding: 16px; background: #eef2ff; border-radius: 8px; display: inline-block;">
                ${otp}
              </div>
              <p style="color: #9ca3af; font-size: 13px; margin-top: 16px;">This code expires in 5 minutes. Do not share it with anyone.</p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error(`[EMAIL] Resend API error: ${JSON.stringify(error)}`);
        throw new Error(`Email delivery failed: ${error.message}`);
      }

      console.log(`[EMAIL] OTP sent successfully. Email ID: ${data?.id}`);
      return data?.id || 'sent';
    } catch (error: any) {
      // Don't let email failure crash the OTP flow in dev/test
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.warn(`[EMAIL] Failed to send OTP (non-fatal in dev): ${error.message}`);
        return 'EMAIL_SEND_FAILED_DEV';
      }
      throw error;
    }
  }
}
