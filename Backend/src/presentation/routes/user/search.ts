import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import SearchController from "../../../infrastructure/controllers/user/search/searchController";
import SearchHistoryController from "../../../infrastructure/controllers/user/search/searchHistoryController";
import SearchHistoryAddController from "../../../infrastructure/controllers/user/search/searchHistoryAddController";

const searchRoute = Router();

const searchController = new SearchController();
const searchHistoryController = new SearchHistoryController();
const searchHistoryAddController = new SearchHistoryAddController();

searchRoute.get("/:search", authMiddleware, searchController.handle);
searchRoute.get("/", authMiddleware, searchHistoryController.handle);
searchRoute.post("/add/:_id", authMiddleware, searchHistoryAddController.handle);

export default searchRoute;
