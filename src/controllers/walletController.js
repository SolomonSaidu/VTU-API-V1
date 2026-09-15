import prisma from "../lib/prisma.js";

export const getBalance = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId,
      },
      select: {
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: "SUCCESS",
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};

export const fundWallet = async (req, res, next) => {
  const userId = req.user.id;
  const { amount } = req.body;

  try {
    await prisma.wallet.update({
      where: {
        userId: userId,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    res.status(201).json({
      status: "SUCCESS",
      message: "Funded account successfully.",
    });
  } catch (error) {
    next(error);
  }
};
