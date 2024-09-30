import { Router } from "express";
import { upload } from "../../../infrastructure/configs/multer";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import CreateMusicController from "../../../infrastructure/controllers/admin/music/createMusicController";

const musicRouter = Router();

const createMusicController = new CreateMusicController();

musicRouter.post(
  "/create-music",
  upload.fields([{ name: "image" }, { name: "audio" }]),
  createMusicController.handle
);

export default musicRouter;
