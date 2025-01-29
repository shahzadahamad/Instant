import { Router } from "express";
import GetIndividualChatDataController from "../../../infrastructure/controllers/user/chat/getIndividualChatDataController";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import CreateChatController from "../../../infrastructure/controllers/user/chat/createChatController";
import GetChatListController from "../../../infrastructure/controllers/user/chat/getChatListController";
import { upload } from "../../../infrastructure/configs/multer";

const chatRouter = Router();

const getIndividualChatDataController = new GetIndividualChatDataController();
const createChatController = new CreateChatController();
const getChatListController = new GetChatListController();

chatRouter.post('/create', authMiddleware, upload.single("groupProfile"), createChatController.handle);
chatRouter.get("/data/:id", authMiddleware, getIndividualChatDataController.handle);
chatRouter.get('/list/:type', authMiddleware, getChatListController.handle);

export default chatRouter;
