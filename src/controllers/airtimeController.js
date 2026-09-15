import { airtimeQueues } from "../queues/airtimeQueues.js";

export const Airtime = async (req, res, next) => {
  const transactionId = req.transaction.id;

  try {
    // ADD TRANSACTION ID TO QUEUES
    await airtimeQueues.add("buy-airtime", {
      transactionId,
    });

    res.status(202).json({
      status: "PENDING",
      message: "Airtime purchase is being processed",
      transactionId,
    });
  } catch (error) {
    next(error);
  }
};
