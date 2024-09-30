import { Router } from "express";
import { upload } from "../../../infrastructure/configs/multer";
import CreateMusicController from "../../../infrastructure/controllers/admin/music/createMusicController";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import GetMusicDataController from "../../../infrastructure/controllers/admin/music/getMusicDataController";

const musicRouter = Router();

const createMusicController = new CreateMusicController();
const getMusicDataController = new GetMusicDataController()

musicRouter.post(
  "/create-music",
  adminAuthMiddleware,
  upload.fields([{ name: "image" }, { name: "audio" }]),
  createMusicController.handle
);
musicRouter.get('/get-data', getMusicDataController.handle);


export default musicRouter;
