const router=require('express').Router();
const cloudinary=require('cloudinary')
const auth=require('../middleware/auth')
const authAdmin=require('../middleware/authAdmin')
const fs=require('fs')
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRT
})
//To Upload Image ADMIN who will can upload image 
router.post("/upload",auth,authAdmin,(req,res)=>{
    try {
        //console.log(req.files)
        // to handle if user didn't select any file
        if(!req.files || Object.keys(req.files).length===0)
        return res.status(400).send({msg:'No File Were Uploaded'})
        const file=req.files.file;
        //checking size of upload image if it more than 1mb = 1024*1024
        if(file.size>1024*1024) {
            RemoveTemFile(file.tempFilePath)
            return res.status(400).json({msg:"Size Too Large"})
        }
            
        //checking type of upload image 
        if(file.mimetype!=='image/jpeg' && file.mimetype!=='image/png') {
            RemoveTemFile(file.tempFilePath)
            return res.status(400).json({msg:"File Formate is Incorrect"})
        }
        // to upload image which selected into cloudinary 
        cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"test"},async (err,result)=>{
            if(err) return res.json({meg:err})
            RemoveTemFile(file.tempFilePath)
            // result containt many values but we want public_id and secure_url 
            res.json({public_id:result.public_id,url:result.secure_url})
        })
    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
})
//To Delete Image ADMIN who will can upload image 
router.post("/destroy",auth,authAdmin,(req,res)=>{
    try {
        const {public_id}=req.body;
        if(!public_id) return res.status(400).json({msg:'No Image Selected'})
        cloudinary.v2.uploader.destroy(public_id,async(err,result)=>{
            if(err) throw err;
            res.json({msg:"Image Deleted"})
        })
    } catch (error) {
        return res.status(400).json({msg:error.message})
    }
})
// to remove files in tmp file created on each upload any file so this finction to delet this files and make Tep empty
const RemoveTemFile=(path)=>{
    //unlink To delete file By Pathing Path of file 
    fs.unlink(path,err=>{
        if(err) throw err
    })
}
module.exports=router;