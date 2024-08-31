export interface EmailOptionsOtp {
  to: string;
  otp: string;
  fullname: string;
}

export interface EmailOptionsResetPassword {
  to: string;
  fullname: string;
  userId: string;
  token: string;
}
