import { Router } from "express";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import GetAdminDataController from "../../../infrastructure/controllers/admin/admin/getAdminDataController";
import { upload } from "../../../infrastructure/configs/multer";
import EditAdminController from "../../../infrastructure/controllers/admin/admin/editAdminController";
import EditAdminPasswordController from "../../../infrastructure/controllers/admin/admin/editAdminPasswordController";
import GetDashboardDataController from "../../../infrastructure/controllers/admin/admin/getDashboardDataController";

const adminRouter = Router();

const getAdminDataController = new GetAdminDataController();
const editAdminController = new EditAdminController();
const editAdminPassword = new EditAdminPasswordController();
const getDashboardDataController = new GetDashboardDataController();

adminRouter.get("/data", adminAuthMiddleware, getAdminDataController.handle);
adminRouter.post("/edit", adminAuthMiddleware, upload.single("profilePicture"), editAdminController.handle);
adminRouter.post("/edit/password", adminAuthMiddleware, editAdminPassword.handle);
adminRouter.get('/dashboard', adminAuthMiddleware, getDashboardDataController.handle);

export default adminRouter;

