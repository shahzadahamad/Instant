import { Router } from "express";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import CreateSubscriptionController from "../../../infrastructure/controllers/admin/subscription/createSubscriptionController";
import EditSubscriptionController from "../../../infrastructure/controllers/admin/subscription/editSubscriptionController";
import GetSubscriptionDataController from "../../../infrastructure/controllers/admin/subscription/getSubscriptionDataController";
import ToggleListController from "../../../infrastructure/controllers/admin/subscription/toggleListController";

const adminSubscriptionRouter = Router();

const createSubscriptionController = new CreateSubscriptionController();
const editSubscriptionController = new EditSubscriptionController();
const getSubscriptionDataController = new GetSubscriptionDataController();
const toggleListController = new ToggleListController(); 

adminSubscriptionRouter.get('/', adminAuthMiddleware, getSubscriptionDataController.handle);
adminSubscriptionRouter.post('/create', adminAuthMiddleware, createSubscriptionController.handle);
adminSubscriptionRouter.put('/edit/:_id', adminAuthMiddleware, editSubscriptionController.handle);
adminSubscriptionRouter.patch("/toggle-list/:id/:status", adminAuthMiddleware, toggleListController.handle);

export default adminSubscriptionRouter;
