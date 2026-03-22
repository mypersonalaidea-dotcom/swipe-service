/**
 * SMS Service using 2Factor.in API
 * Sends OTP via SMS using the manual OTP generation endpoint.
 * 
 * API Docs: https://2factor.in
 * Endpoint:  https://2factor.in/API/V1/{api_key}/SMS/{phone_number}/{otp_value}/{template_name}
 */

import { env } from '../config/env';

const TWO_FACTOR_API_KEY = env.TWO_FACTOR_API_KEY;
const TWO_FACTOR_BASE_URL = 'https://2factor.in/API/V1';

interface TwoFactorResponse {
  Status: string;
  Details: string;
}

export class SmsService {
  /**
   * Send OTP to a phone number via 2Factor.in SMS API.
   * Uses the "manual OTP" endpoint so we control the OTP value ourselves
   * while still leveraging 2Factor for SMS delivery.
   *
   * @param phone - Phone number (with country code, e.g. "919876543210")
   * @param otp   - The OTP code to send
   * @returns     - The session ID from 2Factor (Details field)
   */
  async sendOtp(phone: string, otp: string): Promise<string> {
    if (!TWO_FACTOR_API_KEY) {
      console.warn('[SMS] TWO_FACTOR_API_KEY not set — skipping SMS send');
      return 'NO_API_KEY';
    }

    // Strip any "+" prefix — 2Factor expects digits only (e.g. 919876543210)
    const sanitizedPhone = phone.replace(/^\+/, '');

    const url = `${TWO_FACTOR_BASE_URL}/${TWO_FACTOR_API_KEY}/SMS/${sanitizedPhone}/${otp}`;

    console.log(`[SMS] Sending OTP to ${sanitizedPhone} via 2Factor.in`);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[SMS] 2Factor API HTTP error ${response.status}: ${errorText}`);
        throw new Error(`SMS delivery failed: HTTP ${response.status}`);
      }

      const data: TwoFactorResponse = await response.json();

      if (data.Status === 'Success') {
        console.log(`[SMS] OTP sent successfully. Session ID: ${data.Details}`);
        return data.Details; // session ID
      } else {
        console.error(`[SMS] 2Factor API returned error: ${data.Details}`);
        throw new Error(`SMS delivery failed: ${data.Details}`);
      }
    } catch (error: any) {
      // Don't let SMS failure crash the OTP flow in dev/test
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.warn(`[SMS] Failed to send OTP (non-fatal in dev): ${error.message}`);
        return 'SMS_SEND_FAILED_DEV';
      }
      throw error;
    }
  }
}
