import { Router } from "express";
import CreateUserController from "../../infrastructure/controllers/user/authentication/createUserController";
import LoginUserController from "../../infrastructure/controllers/user/authentication/authenticateUserController";
import UserOtpVerificationController from "../../infrastructure/controllers/user/authentication/userOtpVerificationController";
import LoginWithGoogleAuth from "../../infrastructure/controllers/user/authentication/loginWithGoogleAuthController";
import ForgotPasswordController from "../../infrastructure/controllers/user/authentication/forgotPasswordController";
import ResetPasswordController from "../../infrastructure/controllers/user/authentication/resetPasswordController";

const authRouter = Router();

const userOtpVerificationController = new UserOtpVerificationController();
const createUserController = new CreateUserController();
const loginUserController = new LoginUserController();
const loginWithGoogleAuth = new LoginWithGoogleAuth();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

authRouter.post("/register/otp-verification", userOtpVerificationController.handle);
authRouter.post("/register/create-user", createUserController.handle);
authRouter.post("/login", loginUserController.handle);
authRouter.post("/login/google-authentication", loginWithGoogleAuth.handle);
authRouter.post("/forgot-password" , forgotPasswordController.handle);
authRouter.post('/reset-password/:_id/:token', resetPasswordController.handle);

export default authRouter;
