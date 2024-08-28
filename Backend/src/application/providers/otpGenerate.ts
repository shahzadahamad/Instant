import { randomBytes } from 'crypto';

export function generateOtp(length: number = 6): string {
  const bytes = randomBytes(length);
  const otp = parseInt(bytes.toString('hex'), 16) % (10 ** length);
  return otp.toString().padStart(length, '0');
}