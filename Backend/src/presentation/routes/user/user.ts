import { Router } from "express";
import GetUserDataController from "../../../infrastructure/controllers/user/user/getUserDataController";
import EditUserDataController from "../../../infrastructure/controllers/user/user/editUserDataController";
import { upload } from "../../../infrastructure/configs/multer";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";

const userRouter = Router();

const getUserDataController = new GetUserDataController();
const editUserDataController = new EditUserDataController();

userRouter.get(
  "/edit-profile/get-data/:_id",
  authMiddleware,
  getUserDataController.handle
);
userRouter.post(
  "/edit-profile/:_id",
  authMiddleware,
  upload.single("profilePicture"),
  editUserDataController.handle
);

export default userRouter;
