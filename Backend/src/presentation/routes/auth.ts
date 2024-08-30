import { Router } from "express";
import UserOtpVerification from "../../infrastructure/controllers/user/userOtpVerificationController";
import CreateUserController from "../../infrastructure/controllers/user/createUserController";
import LoginUserController from "../../infrastructure/controllers/user/authentication/authenticateUserController";

const authRouter = Router();

const userOtpVerification = new UserOtpVerification();
const createUserController = new CreateUserController();
const loginUserController = new LoginUserController();

authRouter.post("/register/otp-verification", userOtpVerification.handle);
authRouter.post("/register/create-user", createUserController.handle);
authRouter.post("/login", loginUserController.handle);

export default authRouter;
