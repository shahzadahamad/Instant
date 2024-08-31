import { Router } from "express";
import CreateUserController from "../../infrastructure/controllers/user/authentication/createUserController";
import LoginUserController from "../../infrastructure/controllers/user/authentication/authenticateUserController";
import UserOtpVerificationController from "../../infrastructure/controllers/user/authentication/userOtpVerificationController";
import LoginWithGoogleAuth from "../../infrastructure/controllers/user/authentication/loginWithGoogleAuthController";
import ForgotPasswordController from "../../infrastructure/controllers/user/authentication/forgotPasswordController";

const authRouter = Router();

const userOtpVerificationController = new UserOtpVerificationController();
const createUserController = new CreateUserController();
const loginUserController = new LoginUserController();
const loginWithGoogleAuth = new LoginWithGoogleAuth();
const forgotPosswordController = new ForgotPasswordController();

authRouter.post("/register/otp-verification", userOtpVerificationController.handle);
authRouter.post("/register/create-user", createUserController.handle);
authRouter.post("/login", loginUserController.handle);
authRouter.post("/login/google-authentication", loginWithGoogleAuth.handle);
authRouter.post("/forgot-password" , forgotPosswordController.handle);

export default authRouter;
