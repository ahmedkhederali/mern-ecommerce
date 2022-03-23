import axios from "axios";
import React,{useState,useContext} from "react";
import BtnRender from "./BtnRender";
import {GlobalState} from "../../../../GlobalState"
import Loading from "../loading/Loading";

function ProductItem({ product ,isAdmin}) {
  const state=useContext(GlobalState)
  const [token]=state.token
  const [callback,setCallback]=state.productApi.callback
  const [products,setProducts]=state.productApi.product
  const [loading,setLoading]=useState(false)

  const handleChanged=(e)=>{
    
    products.forEach(prod=>{
       if(prod._id === product._id) prod.checked=!prod.checked
      
    })
    setProducts([...products])
    

  }
  const deletProduct=async()=>{
   try {
    setLoading(true)
     // Destroy image First 
     const destroyImg = await axios.post("/api/destroy", {public_id:product.images.public_id},{
      headers: {
        Authorization: token,
      },
    });
    const DestroyContent=  await axios.delete(`api/product/${product._id}`,{
        headers:{Authorization:token}
      })
      setLoading(false)
      setCallback(!callback)
   } catch (error) {
     alert(error.response.data.msg)
   }
  }
if(loading) return <div className="product-card"> <Loading/></div>
return (
    <div className="product-card">
    {
      isAdmin && <input type="checkbox" checked={product.checked} onChange={handleChanged}/>
    }
      <img src={product.images.url} alt="" />

      <div className="product-box">
        <h2 title={product.title}>{product.title}</h2>
        <span>${product.price}</span>
        <p>{product.description}</p>
      </div>
      <BtnRender product={product}  deletProduct={deletProduct}/>
    </div>
  );
}

export default ProductItem;
