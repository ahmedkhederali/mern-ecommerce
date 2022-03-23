const Category=require('../models/categoryModel')
const Product =require('../models/productModel')
const categoryCtrl={
    getcategories:async(req,res)=>{
        try {
            const categories=await Category.find()
            res.json(categories)
        } catch (error) {
            return res.status(500).json({meg:error.message})
        }
    },
    createCategory:async(req,res)=>{
        try {
            //if User Have Role ===1 ==>ADMIN 
            // only ADMIN can Access on Category such as Create Or Delete Or Updated  ==>CRUD
            const {name}=req.body;
            //get Category if there is product with the same 
            const category=await Category.findOne({name})
            // checking if there same product return error json message with 400 
            if(category) return res.status(400).json({msg:"This Category Alredy Exit."})
            //if there is no error 
            const newCaterogy=new Category({name})

            //To Save In DB U Can USed Create But this is anthor way 
            await newCaterogy.save()
            res.status(201).json({msg:"Created"})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    deletCatergory:async(req,res)=>{
        try {
            const {id}=req.params
           const product=await Product.findOne({Category:req.params.id})
            if(product) return res.status(400).json({msg:"Found"})
            const category=await Category.findByIdAndDelete(id)
            res.status(200).json({msg:"Deleted A Category"})
            
        } catch (error) {
            return res.status(400).json({msg:error.message})
        }
    },
    updatedCategory:async(req,res)=>{
        try {
            const {name}=req.body
            const category=await Category.findByIdAndUpdate(req.params.id,{name})
            res.status(200).json({msg:"Udated A Category"})
            
        } catch (error) {
            return res.status(400).json({msg:error.message})
        }
    }
}
module.exports=categoryCtrl