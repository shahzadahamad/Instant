import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import { upload } from "../../../infrastructure/configs/multer";
import CreateStoryController from "../../../infrastructure/controllers/user/story/createStoryController";

const userStoryRouter = Router();

const createStoryController = new CreateStoryController();

userStoryRouter.post("/create", authMiddleware, upload.single("file"), createStoryController.handle);

export default userStoryRouter;
