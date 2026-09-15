import prisma from "../lib/prisma.js"


export const addTransaction = (type) =>{
    return async (req, res, next) =>{
    const {network, mobile_number, Ported_number, amount, airtime_type, plan} = req.body;
    

    const userId = req.user.id

    try {
        const transaction = await prisma.transaction.create({
            data:{
                type,
                status:"PENDING",
                userId,

                amount,
                phone:mobile_number,
                network,
                PortedNumber:Ported_number,
                airtimeType:airtime_type,
                plan
            }
        })

        req.transaction = transaction;

        next()
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({msg:"Cant add to transaction."})
    }
}
}