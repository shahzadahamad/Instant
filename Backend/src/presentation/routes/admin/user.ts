import { Router } from "express";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import GetUserDataAdminController from "../../../infrastructure/controllers/admin/user/getUserDataAdminController";

const adminUsersRouter = Router();

const getUserDataAdminController = new GetUserDataAdminController();

adminUsersRouter.get('/get-data', adminAuthMiddleware, getUserDataAdminController.handle);

export default adminUsersRouter;
