import { Worker } from "bullmq";
import prisma from "../lib/prisma.js";
import redis from "../lib/redis.js";
import AppError from "../utils/appError.js";
import crypto from "crypto"


const dataWorker = new Worker("data", 
    async (job) => {
        console.log(`Processing job ${job?.id} now`);
        console.log(job.data);

        
        
        //
        try {
            const requestId = crypto.randomUUID();
            const transactionId = job.data.transactionId;

        const result = await prisma.$transaction( async (tx) =>{
                const transactionProcessed = await tx.transaction.updateMany({
                    where:{
                        id:transactionId,
                        status:"PENDING"
                    },
                    data:{
                        status:"PROCESSING"
                    }
                });

                if(transactionProcessed.count == 0){
                    return {shouldProcess: false};
                };

                const transaction = await tx.transaction.findUnique({
                    where:{
                        id:transactionId,
                    },
                    select:{
                        userId:true,
                        amount:true,
                    }
                });          

                const wallet = await tx.wallet.updateMany({
                    where:{
                        userId:transaction.userId,
                        balance:{
                            gte:transaction.amount,
                        },
                    },
                    data:{
                        balance:{
                            decrement:transaction.amount,
                        },
                    },
                });

                if(wallet.count == 0){
                    await tx.transaction.updateMany({
                        where:{
                            id:transactionId,
                            status:"PROCESSING"
                        },
                        data:{
                            status:"FAILED",
                            comment:"Insufficient funds."
                        }
                    });
                   
                    return {shouldProcess: false};
                };

                return { shouldProcess: true};
            });

            if(!result.shouldProcess){
                return;
            }


        // GET TRANSACTION BY ID
        const transaction = await prisma.transaction.findUnique({
            where:{
                id:transactionId
            }
        });


        // CALL VTU PROVIDER
        const response = await fetch("https://sandbox.vtunaija.com.ng/api/data/", {
            method:"POST",
            headers:{
                Authorization:`Token ${process.env.VTU_API_KEY}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                network:transaction.network,
                mobile_number:transaction.phone,
                Ported_number:transaction.PortedNumber,
                'request-id':requestId,
                plan:transaction.plan
            })
        })

        // IF PROVIDER FAILED
        if(!response.ok){
            // UPDATE TRANSACTION TO FAILED AND UPDATE BALANCE
            await prisma.$transaction(async (tx)=>{
                await tx.transaction.update({
                where:{
                    id:transactionId
                },
                data:{
                    status:"FAILED",
                    comment:"Provider failure."
                }
                });
                await tx.wallet.update({
                    where:{
                        userId:transaction.userId,
                    },
                    data:{
                        balance:{
                            increment:transaction.amount
                        }
                    }
                });
            });

            return;
        }

        // UPDATE TRANSACTION TO SUCCESS
        await prisma.transaction.update({
                where:{
                    id:transactionId
                },
                data:{
                    status:"SUCCESS"
                }
            })

    const data = await response.json();
    console.log(data);
    
    } catch (error) {
        console.log("Something occured.");
        
        throw error;
    }
    },
    {
        connection:redis
    }
);

dataWorker.on("completed", (job)=>{
    console.log(`job ${job.id} is completed.`);
})

dataWorker.on("failed", (job, error)=>{
    console.log(`job ${job?.id} Faild:`, error.message)
})