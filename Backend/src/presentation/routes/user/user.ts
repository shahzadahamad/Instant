import { Router } from "express";
import GetUserDataController from "../../../infrastructure/controllers/user/user/getUserDataController";
import EditUserDataController from "../../../infrastructure/controllers/user/user/editUserDataController";
import { upload } from "../../../infrastructure/configs/multer";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import CretePostGetUserDataController from "../../../infrastructure/controllers/user/user/cretePostGetUserDataController";
import CreatePostGetTaggedUserDataController from "../../../infrastructure/controllers/user/user/createPostGetTaggedUserDataController";
import GetCurrentUserController from "../../../infrastructure/controllers/user/user/getCurrentUserController";

const userRouter = Router();

const getUserDataController = new GetUserDataController();
const editUserDataController = new EditUserDataController();
const createPostGetUserDataController = new CretePostGetUserDataController();
const createPostGetTaggedUserDataController =
  new CreatePostGetTaggedUserDataController();
const getCurrentUserController = new GetCurrentUserController();

userRouter.get("/get-user-data", authMiddleware, getUserDataController.handle);
userRouter.get(
  "/create-post/get-data",
  authMiddleware,
  createPostGetUserDataController.handle
);
userRouter.get(
  "/get-tagged-user-data",
  authMiddleware,
  createPostGetTaggedUserDataController.handle
);
userRouter.post(
  "/edit-profile",
  authMiddleware,
  upload.single("profilePicture"),
  editUserDataController.handle
);
userRouter.get(
  "/get-current-user",
  authMiddleware,
  getCurrentUserController.handle
);

export default userRouter;
