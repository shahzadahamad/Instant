import { Router } from "express";
import CreateUserController from "../../infrastructure/controllers/user/createUserController";
import LoginUserController from "../../infrastructure/controllers/user/authentication/authenticateUserController";
import UserOtpVerificationController from "../../infrastructure/controllers/user/userOtpVerificationController";
import LoginWithGoogleAuth from "../../infrastructure/controllers/user/authentication/loginWithGoogleAuthController";

const authRouter = Router();

const userOtpVerificationController = new UserOtpVerificationController();
const createUserController = new CreateUserController();
const loginUserController = new LoginUserController();
const loginWithGoogleAuth = new LoginWithGoogleAuth();

authRouter.post("/register/otp-verification", userOtpVerificationController.handle);
authRouter.post("/register/create-user", createUserController.handle);
authRouter.post("/login", loginUserController.handle);
authRouter.post("/login/google-authentication", loginWithGoogleAuth.handle);

export default authRouter;
