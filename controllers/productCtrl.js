const Products = require("../models/productModel")
//Filtring ,Sorting and Pagination ترقيم الصفحات
class APIFeature{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }
    filtering(){
        const queryObject={...this.queryString} //equel req.query ? 
        //console.log(queryObject) // After delete excludedFildes ==> { name: 'ahed', _id: '622bf0a3aef5b5371c92991b', page: '2' }
        const excludedFildes=['page','sort','limit']
        excludedFildes.forEach(el=>delete(queryObject[el])) // to delete Page , sort or limit from query object
        //console.log(queryObject) // before Delete ExecludeFile ==>{ name: 'ahed', _id: '622bf0a3aef5b5371c92991b' }
        let querystr=JSON.stringify(queryObject) // to translate from { name: 'ahed', _id: '622bf0a3aef5b5371c92991b' } to {"name":"ahed","_id":"622bf0a3aef5b5371c92991b"}
        /*
            gte==> greater than or equal
            gt==>greater than
            lte==>less than or equel
            lt==> less than
        */
       // stackoverFlow to match
        querystr= querystr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)  
       // console.log(querystr) //{"title":{"$regex":"3"}}
        this.query.find(JSON.parse(querystr))
        return this // witout this will return "msg": "Cannot read properties of undefined (reading 'query')"
      
    }
    sorting(){
       if(this.queryString.sort){
        const sortBy=this.queryString.sort.split(',').join(' ')
        this.query=this.query.sort(sortBy)
       }else{
           this.query=this.query.sort('-createdAt')
       }
       
        return this
    }
    pagination(){
        const page=this.queryString.page*1 || 1;
        const limit=this.queryString.limit*1 || 9;
        const skip=(page-1)*limit;
        this.query=this.query.skip(skip).limit(limit)
        return this
    }
}
const categoryCtrl={
    getProducts:async(req,res)=>{
      try {
          // instance with class APIFeature
        // retuurn data will store in query so when want to use data use .query
          const features=new APIFeature(Products.find(),req.query).filtering().sorting().pagination()
          const products=await features.query;
          res.status(200).json(
              {
                  status:"Success",
                  count:products.length,
                  products
                
                })
      } catch (error) {
          return res.status(500).json({msg:error.message})
      }
    },
    createProduct:async(req,res)=>{
        try {
            const {product_id,title,price,description,content,images,category}=req.body;
            if(!images) return res.status(400).json({msg:"No Image Uploaded !!"})
            const product=await Products.findOne({product_id});
            if(product) return res.status(400).json({msg:"This Product Already Exists"})
            const newProduct=new Products({
                product_id,
                title:title.toLowerCase(),price,description,content,images,category
            })
            //To Save In DB U Can USed Create But this is anthor way 
            await newProduct.save()
            res.json({msg:"Product Is Created..."})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    updateProduct:async(req,res)=>{
        try {
            const {title,price,description,content,images,category}=req.body;
            
            if(!images) return res.status(400).json({msg:"No Image Uploaded !!"})
            await Products.findByIdAndUpdate({_id:req.params.id},
                {
                    title:title.toLowerCase(),
                    price,
                    description,
                    content,
                    images,
                    category
                })
                res.status(200).json({msg:"Updated Product..."})

        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    deleteProducts:async(req,res)=>{
        try {
            const {id}=req.params
            const product = await Products.findByIdAndDelete(id)
            if(!product) return res.status(500).json({msg:"There Is No User With This ID"})
            res.status(200).json({msg:"Product Deleted.."})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
}
module.exports=categoryCtrl