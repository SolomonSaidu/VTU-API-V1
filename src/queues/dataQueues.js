import redis from "../lib/redis.js";
import { Queue } from "bullmq";

export const dataQueues = new Queue("data", {
    connection:redis,
});