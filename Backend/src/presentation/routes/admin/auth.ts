import { Router } from "express";
import AuthenticateAdminController from "../../../infrastructure/controllers/admin/authentication/authenticateAdminController";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import AdminLogoutController from "../../../infrastructure/controllers/admin/authentication/adminLogoutController";

const adminAuthRouter = Router();

const authenticateAdminController = new AuthenticateAdminController();
const adminLogoutController = new AdminLogoutController();

adminAuthRouter.post("/login", authenticateAdminController.handle);
adminAuthRouter.post('/logout', adminAuthMiddleware, adminLogoutController.handle);


export default adminAuthRouter;
