import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import "./cart.css";
import Swal from "sweetalert2";
import PaypalButton from "./PaypalButton"
function Cart() {
  const state = useContext(GlobalState);
  const [token,setToken]=state.token
  const [cart,setCart] = state.UserApi.cart;
  const  [callback,setCallback]=state.UserApi.callback;
  const [total , setTotal]=useState(0)
  useEffect(()=>{
    //to get total of product of cart 
    const getTotal=()=>{
      const total=cart.reduce((prev,item)=>{
         return prev+(item.price*item.quantity)
        // console.log(item.price,item.quantity)
      },0)
      setTotal(total)

    }
    getTotal()
  },[cart])

  const addToCart=async(cart)=>{
    await axios.patch("/user/addcart",{cart},{
      headers: {Authorization :token}
    })
  }
  // increase quantity 
  const increase=(id)=>{
    cart.forEach(item=>{
      if(item._id===id){
        item.quantity+=1
      }
    })
    setCart([...cart])
    addToCart(cart)// to save changes in dtatbase 
  }
 // decrease quantity 
 const decrease=(id)=>{
  cart.forEach(item=>{
    if(item._id===id){
      item.quantity===1 ?  item.quantity=1 : item.quantity -=1
    }
  })
  setCart([...cart])
  addToCart(cart)// to save changes in dtatbase 
}

//Remove Item 

const removeItem=(id)=>{
  if(window.confirm("DO You Want To Delete This Product?")){
    cart.forEach((item,index)=>{
      if(item._id===id){
        //splice(idex,1) mean delet one product with this index  1==> mean one element will delete
        cart.splice(index,1)
      }
    })
    setCart([...cart])
    addToCart(cart)// to save changes in dtatbase 
  }
 
}

//paypal

const tranSucess=async(payment)=>{
  //console.log(payment)// to print details information about user such as use ID , Paypal ID
  const {address,paymentID}=payment;
  //console.log(address,paymentID)
  await axios.post('/api/payment',{cart,address,paymentID},{
    headers:{Authorization:token}
  })
  setCart([])// to put cart empty After Pay
  addToCart([])// to save changed and make cart empty
  setCallback(!callback)
  //console.log(cart)
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "You Have Successfuly placed An Order",
    showConfirmButton: false,
    timer: 1500,
  });

}
  //check length of cart
  if (cart.length === 0) return <h2 className="cart_empty">Cart Empty</h2>;

  return (
    <div>
      {
        cart?.map((cart) => (
        <div key={cart._id} className="detail cart">
          <img src={cart.images.url} alt="product-image"  className="img_container"/>
          <div className="box-detail">
            <h2>{cart.title}</h2>
            <h3>$ {cart.price*cart.quantity}</h3>
            <p> {cart.description}</p>
            <p> {cart.content}</p>

            <div className="amount">
              <button onClick={()=>decrease(cart._id)}>-</button>
              <span>{cart.quantity}</span>
              <button onClick={()=>increase(cart._id)}>+</button>
            </div>
            <div className="delete" onClick={()=>removeItem(cart._id)}>X</div>
          </div>
        </div>
      ))
    }
      <div className="total">
        <h3>Total : ${total}</h3>
        <PaypalButton total={total} tranSucess={tranSucess}/>
      </div>
    </div>
  );
}

export default Cart;
