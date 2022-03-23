import React, { useState, useContext, Fragment } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import Loading from "../utils/loading/Loading";
import axios from "axios";
import Filter from "./Filter";
import LoadMore from "./LoadMore";
function Products() {
  const state = useContext(GlobalState);
  const [isAdmin]=state.UserApi.isAdmin;
  const [products,setProducts]=state.productApi.product
  const [token]=state.token
  const [isCheck,setIsCheck]=useState(false)
  const [callback,setCallback]=state.productApi.callback
  const [loading,setLoading]=useState(false)

  const checkAll=()=>{
    products.forEach(prod=>{
      prod.checked=!isCheck // to checked or none checked 
    })
    setProducts([...products])
    setIsCheck(!isCheck)
  }

  const deletProduct=async(id,public_id)=>{
    try {
      setLoading(true)
      // Destroy image First 
      const destroyImg = await axios.post("/api/destroy", {public_id},{
       headers: {
         Authorization: token,
       },
     });
     const DestroyContent=  await axios.delete(`api/product/${id}`,{
         headers:{Authorization:token}
       })
       setLoading(false)
       setCallback(!callback)
    } catch (error) {
      alert(error.response.data.msg)
    }
   }

  //To Delete All Product
  const deleteAll=async()=>{
   products.forEach(prod=>{
    if(prod.checked) deletProduct(prod._id,prod.images.public_id)
   })
 
  }
  if(loading) return <div className="product"> <Loading/></div>
  return (
      
    <Fragment>
    <Filter/>
    {
      isAdmin && <div className="delete_All">
        <span>Select All</span>
        <input type="checkbox" checked={isCheck} onChange={checkAll}/>
        <button onClick={deleteAll}>Delete All</button>
      </div>
    }
      <div className="products">
       
        {products?.map((prod, ind) => (
          <ProductItem product={prod} key={prod._id} isAdmin={isAdmin}  />
        ))}
      </div>

      <LoadMore/>
      {
        products.length === 0 && <Loading/>
    }
    </Fragment>
  );
}

export default Products;
