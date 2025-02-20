import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import GetSubscriptionListedDataController from "../../../infrastructure/controllers/user/subscription/getSubscriptionListedDataController";

const subscriptionRouter = Router();

const getSubscriptionListedDataController = new GetSubscriptionListedDataController();

subscriptionRouter.get('/', authMiddleware, getSubscriptionListedDataController.handle);

export default subscriptionRouter;
