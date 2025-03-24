import { Router } from "express";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import GetPostDataAdminController from "../../../infrastructure/controllers/admin/post/getPostDataAdminController";

const adminPostRouter = Router();

const getPostDataAdminController = new GetPostDataAdminController();

adminPostRouter.get('/', adminAuthMiddleware, getPostDataAdminController.handle);

export default adminPostRouter;
