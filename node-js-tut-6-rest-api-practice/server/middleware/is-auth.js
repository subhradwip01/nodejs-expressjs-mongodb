const jwt=require("jsonwebtoken");

module.exports=(req,res,next)=>{
    const authToken=req.get("Authorization");
    if(!authToken){
        const error=new Error("Not authorized");
        error.statusCode=401;
        throw error;
    }
    const token=authToken.split(" ")[1];
    let decoded
    try{
       decoded=jwt.verify(token,"secure")
    }
    catch(err){
        err.statusCode=500;
        throw err;
    }

    if(!decoded){
        const error=new Error("Not authenticatet");
        error.statusCode=401;
    }
    console.log(decoded.userId);
    req.userId=decoded.userId;
    console.log(req.userId);
    next();

}