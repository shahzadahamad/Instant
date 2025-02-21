import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import GetSubscriptionListedDataController from "../../../infrastructure/controllers/user/subscription/getSubscriptionListedDataController";
import CreateCheckoutSessionStripe from "../../../infrastructure/controllers/user/subscription/CreateCheckoutSessionStripe";

const subscriptionRouter = Router();

const getSubscriptionListedDataController = new GetSubscriptionListedDataController();
const createCheckoutSessionStripe = new CreateCheckoutSessionStripe();

subscriptionRouter.get('/', authMiddleware, getSubscriptionListedDataController.handle);
subscriptionRouter.post('/create-checkout-session', authMiddleware, createCheckoutSessionStripe.handle);

export default subscriptionRouter;
