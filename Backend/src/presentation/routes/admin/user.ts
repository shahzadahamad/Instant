import { Router } from "express";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import GetUserDataAdminController from "../../../infrastructure/controllers/admin/user/getUserDataAdminController";
import BlockOrUnblockUserAdminController from "../../../infrastructure/controllers/admin/user/blockOrUnblockUserAdminController";

const adminUsersRouter = Router();

const getUserDataAdminController = new GetUserDataAdminController();
const blockOrUnblockUserAdminController = new BlockOrUnblockUserAdminController();

adminUsersRouter.get('/get-data', adminAuthMiddleware, getUserDataAdminController.handle);
adminUsersRouter.patch('/block-or-unblock/:id/:status', adminAuthMiddleware, blockOrUnblockUserAdminController.handle);

export default adminUsersRouter;
