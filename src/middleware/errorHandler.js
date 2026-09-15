export const errorHandler = (error, req, res, next) =>{
    console.log(error);
    
    res.status(error.statusCode || 500).json({
        status:"Failed",
        message:error.message || "Something happend.."
    })
}