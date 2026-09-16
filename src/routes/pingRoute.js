import express from "express";

const route = express.Router();

route.post("/schedule/ping", (req, res) => {
  res.send("Ping route working...");
});

export default route;
