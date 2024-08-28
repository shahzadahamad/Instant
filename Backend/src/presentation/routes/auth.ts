import { Router } from "express";
import UserOtpVerification from "../../infrastructure/controllers/user/userOtpVerificationController";
import CreateUserController from "../../infrastructure/controllers/user/createUserController";

const authRouter = Router();

const userOtpVerification = new UserOtpVerification();
const createUserController = new CreateUserController();

authRouter.post("/register/otp-verification", userOtpVerification.handle);
authRouter.post("/register/create-user", createUserController.handle);

export default authRouter;
