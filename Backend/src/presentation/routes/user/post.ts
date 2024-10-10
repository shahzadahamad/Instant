import { Router } from "express";

import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import CreatePostController from "../../../infrastructure/controllers/user/post/createPostController";
import { upload } from "../../../infrastructure/configs/multer";

const userPostRouter = Router();

const createPostController = new CreatePostController();

userPostRouter.post(
  "/create-post",
  authMiddleware,
  upload.array("files", 10),
  createPostController.handle
);

export default userPostRouter;
