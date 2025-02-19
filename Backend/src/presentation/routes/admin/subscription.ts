import { Router } from "express";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import CreateSubscriptionController from "../../../infrastructure/controllers/admin/subscription/createSubscriptionController";
import EditSubscriptionController from "../../../infrastructure/controllers/admin/subscription/editSubscriptionController";
import GetSubscriptionDataController from "../../../infrastructure/controllers/admin/subscription/getSubscriptionDataController";

const subscriptionRouter = Router();

const createSubscriptionController = new CreateSubscriptionController();
const editSubscriptionController = new EditSubscriptionController();
const getSubscriptionDataController = new GetSubscriptionDataController();

subscriptionRouter.get('/', adminAuthMiddleware, getSubscriptionDataController.handle);
subscriptionRouter.post('/create', adminAuthMiddleware, createSubscriptionController.handle);
subscriptionRouter.put('/edit/:_id', adminAuthMiddleware, editSubscriptionController.handle);

export default subscriptionRouter;
