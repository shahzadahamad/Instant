import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import SearchController from "../../../infrastructure/controllers/user/search/searchController";

const searchRoute = Router();

const searchController = new SearchController();

searchRoute.get("/:search", authMiddleware, searchController.handle);

export default searchRoute;
