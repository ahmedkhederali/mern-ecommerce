const jwt = require("jsonwebtoken")
const auth=(req,res,next)=>{
    try {
        const token=req.header("Authorization")
        if(!token) return res.status(401).json({msg:"INVALID authentication"})
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
            if(err) return res.status(400).json({msg:"INVALID authentication"})
            req.user=user // to used in get user in UserCtrl.js in function getUser
            next()
        })
    } catch (error) {
        return res.status(400).json({msg:error.message})
    }
}
module.exports=auth