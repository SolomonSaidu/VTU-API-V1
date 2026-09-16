import express from "express";

const route = express.Router();

route.get("/airtime/schedule", (req, res) => {
  res.send("Schedules runnig...");
});

route.post("/airtime/schedule", (req, res) => {
  res.send("Schedules runnig...");
});

export default route;
