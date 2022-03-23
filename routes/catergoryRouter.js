const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const authAdmin=require('../middleware/authAdmin')
const {getcategories,createCategory,deletCatergory,updatedCategory}= require('../controllers/categoryCtrl')
router.route('/category').get(getcategories).post(auth,authAdmin,createCategory)
router.route("/category/:id").delete(auth,authAdmin,deletCatergory).put(auth,authAdmin,updatedCategory)
module.exports=router
