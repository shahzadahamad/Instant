import { Router } from "express";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import CreateSubscriptionController from "../../../infrastructure/controllers/admin/subscription/createSubscriptionController";
import EditSubscriptionController from "../../../infrastructure/controllers/admin/subscription/editSubscriptionController";

const subscriptionRouter = Router();

const createSubscriptionController = new CreateSubscriptionController();
const editSubscriptionController = new EditSubscriptionController();

subscriptionRouter.post('/create', adminAuthMiddleware, createSubscriptionController.handle);
subscriptionRouter.put('/edit/:_id', adminAuthMiddleware, editSubscriptionController.handle);

export default subscriptionRouter;
