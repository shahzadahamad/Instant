import { Router } from "express";
import WebHookController from "../../../infrastructure/controllers/user/subscription/webHookController";

const webhookRoute = Router();

const webHookController = new WebHookController();

webhookRoute.post('/', webHookController.handle);

export default webhookRoute;
