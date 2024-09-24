import { Router } from "express";
import AuthenticateAdminController from "../../../infrastructure/controllers/admin/authentication/authenticateAdminController";

const adminAuthRouter = Router();

const authenticateAdminController = new AuthenticateAdminController();

adminAuthRouter.post("/login", authenticateAdminController.handle);

export default adminAuthRouter;
