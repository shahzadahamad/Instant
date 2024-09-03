import { Router } from "express";
import UserOtpVerificationController from "../../infrastructure/controllers/user/authentication/userOtpVerificationController";
import GetUserDataController from "../../infrastructure/controllers/user/user/getUserDataController";

const userRoute = Router();

const getUserDataController = new GetUserDataController();

userRoute.get("/get-data/:_id", getUserDataController.handle);

export default userRoute;
