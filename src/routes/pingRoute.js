import express from "express";
import { ping } from "../controllers/pingController.js";

const route = express.Router();

route.post("/schedule/ping", ping);

export default route;
