import React, { useContext, useState ,useEffect} from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import Loading from "../utils/loading/Loading";
import {useHistory,useParams}  from "react-router-dom"

const intialState = {
  product_id: "",
  title: "",
  price: 0,
  description: "Hello Description",
  content: "Hello Content",
  category: "",
  _id:''
};

function CreateProduct() {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(intialState);
  const [category, setCategory] = state.categories.category;
  const [images, setImages] = useState(false); // used in show or hidden image
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.UserApi.isAdmin;
  const [token] = state.token;
  const [callback,setCallback]=state.productApi.callback

  // Mood Edit
  const [Edit,setEdit]=useState(false)

  // Get All Product 
  const [products,setProducts]=state.productApi.product
  
  //History To Go to home page After Add New Product
  const histroy=useHistory()
  const param=useParams()


  useEffect(()=>{
    if(param.id){
      setEdit(true)
     const res= products.forEach(prod=>{
        if(prod._id === param.id){
          setProduct(prod)
          setImages(prod.images)
        }
      })
    }else{
      setProduct(intialState)
      setImages(false)
      setEdit(false)
    }

  },[param.id,products])
  //Handle Upload Images
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You are Not Admin");
      const file = e.target.files[0]; // How To Get file
      // Handle All Cases Of Images
      if (!file) return alert("File Not Exist");
      if (file.size > 1024 * 1024) return alert("File Size Too large!");
      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("File Format is Incorrect");

      // Formate Data
      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);

      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoading(false);
      setImages(res.data);
    } catch (error) {
      alert(error.response.data.msg);
    }
  
  };

  //Handel Destroy Image
  const handleDestroy=async()=>{
    try {
      if (!isAdmin) return alert("You are Not Admin");
      setLoading(true) // to make loading animation 
      // console.log(images)
      const res = await axios.post("/api/destroy", {public_id:images.public_id},{
        headers: {
          Authorization: token,
        },
      });
      setLoading(false) 
      setImages(false) // look at line 86
    } catch (error) {
      alert(error.response.data.msg)
    }
  }
  
  //Handel ONChange 
const handelOnChange=(e)=>{
  const {name,value}=e.target;
  setProduct({...product,[name]:value})
}
//Handle Submit
const  onSubmit=async(e)=>{
  e.preventDefault()
  try {
    if(!isAdmin) return alert("You Are Not Admin")
    if(!images) return alert("no image Selected")
    if(Edit){
      
      await axios.put(`/api/product/${param.id}`,{...product,images},{
        headers :{Authorization:token}
      })
      
    }else{
      await axios.post('/api/product',{...product,images},{
        headers :{Authorization:token}
      })
    }
    setCallback(!callback)
     histroy.push('/')
     
  } catch (error) {
    alert(error.response.data.msg)
  }
}
const styleUpload = {
  display: images ? "block" : "none",
};

  return (
    <div className="create_product">
      <div className="upload">
      {
        // to upload image
      }
        <input type="file" name="file" id="file_up" onChange={handleUpload} />


        {loading ? (
          <div id="file_img">
            <Loading/>
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>
      <form onSubmit={onSubmit}>
        <div className="row">
          <label htmlFor="product_id">Product ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            value={product.product_id}
            onChange={handelOnChange}
            disabled={Edit}
          />
        </div>

        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={product.title}
            onChange={handelOnChange}
          />
        </div>

        <div className="row">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={product.price}
            onChange={handelOnChange}
          />
        </div>

        <div className="row">
          <label htmlFor="description">Description</label>
          <textarea
            rows="5"
            name="description"
            id="description"
            required
            value={product.description}
            onChange={handelOnChange}
          />
        </div>

        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea
            rows="5"
            name="content"
            id="content"
            required
            value={product.content}
            onChange={handelOnChange}
          />
        </div>

        <div className="row">
          <label htmlFor="content" id="category">Category</label>
          <select name="category" value={product.category} onChange={handelOnChange}>
            <option value="">Please Select A Category</option>
            {category.map((cat) => (
              <option value={cat.name} key={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{Edit ? "Update" :"Create"}</button>
      </form>
    </div>
  );
}

export default CreateProduct;
