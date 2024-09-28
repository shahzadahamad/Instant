import { Router } from "express";
import AuthenticateAdminController from "../../../infrastructure/controllers/admin/authentication/authenticateAdminController";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import LogoutAdminController from "../../../infrastructure/controllers/admin/authentication/logoutAdminController";
import RefreshTokenAdminController from "../../../infrastructure/controllers/admin/authentication/refreshTokenAdminController";

const adminAuthRouter = Router();

const authenticateAdminController = new AuthenticateAdminController();
const logoutAdminController = new LogoutAdminController();
const refreshTokenAdminController = new RefreshTokenAdminController();

adminAuthRouter.post("/login", authenticateAdminController.handle);
adminAuthRouter.post('/logout', adminAuthMiddleware, logoutAdminController.handle);
adminAuthRouter.get('/refresh-token', refreshTokenAdminController.handle);

export default adminAuthRouter;
