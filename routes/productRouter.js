const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const authAdmin=require('../middleware/authAdmin')
const {getProducts,createProduct,updateProduct,deleteProducts}=require('../controllers/productCtrl')
router.route('/product')
    .get(getProducts)
    .post(createProduct)
router.route('/product/:id')
    .delete(deleteProducts)
    .put(updateProduct)
module.exports=router;
