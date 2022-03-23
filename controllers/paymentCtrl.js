const Payment= require('../models/paymentModel');
const User = require('../models/userModel')
const Product=require('../models/productModel')
const paymentCtrl={
    getPayments:async(req,res)=>{
        try {
            const payments=await Payment.find()
            res.status(200).json({payments})
            
        } catch (error) {
            return res.status(400).json({msg:error.message})
        }
    },
    createPayment:async(req,res)=>{
        try {
            const user=await User.findById(req.user.id).select('name email')
            if(!user) return  res.status(400).json({msg:"There is No User With This ID"})
            const {cart,address,paymentID}=req.body;
            const { _id,name,email}=user
            //console.log(cart)
            const newPayment = new Payment({
                user_id: _id,
                address,
                paymentID,
                cart,
                name,
                email
            })
            // for updated sold attributes
        
            cart.filter(item=>{
                return sold(item._id,item.quantity ,item.sold)
            })
            
            //to save in DataBase
            await newPayment.save()
            res.json({msg:"Payment Success!"})
            
        } catch (error) {
            return res.status(400).json({msg:error.message})
        }
    }
}
// to update sold item 
const sold=async(id,quantity,oldSold)=>{
    await Product.findOneAndUpdate({_id:id},{
        sold:quantity+oldSold
    })
}
module.exports=paymentCtrl