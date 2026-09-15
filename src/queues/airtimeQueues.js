import redis from "../lib/redis.js";
import { Queue } from "bullmq";

export const airtimeQueues = new Queue("airtime",{
    connection:redis,
});

