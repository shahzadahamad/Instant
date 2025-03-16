import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import { upload } from "../../../infrastructure/configs/multer";
import CreateStoryController from "../../../infrastructure/controllers/user/story/createStoryController";
import GetStoriesController from "../../../infrastructure/controllers/user/story/getStoriesController";

const userStoryRouter = Router();

const createStoryController = new CreateStoryController();
const getStoriesController = new GetStoriesController();

userStoryRouter.post("/create", authMiddleware, upload.single("file"), createStoryController.handle);
userStoryRouter.get('/', authMiddleware, getStoriesController.handle);

export default userStoryRouter;
