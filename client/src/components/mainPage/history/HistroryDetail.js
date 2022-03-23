import React, { useState, useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link, useParams } from "react-router-dom";
function HistroryDetail() {
    const state=useContext(GlobalState)
    const params = useParams();
    const [history]=state.UserApi.history;
    const [orderDetails,setOrderDetails]=useState([])
    useEffect(() => {
        if (params.id) {
            history.forEach((prod) => {
            if (params.id === prod._id) setOrderDetails(prod);
          });
        }
      }, [params.id, history]);
   //   console.log(orderDetails)
      if (orderDetails.length === 0) return <h1>Empty Values......</h1>;
  return (
    <div className="history-page">
    <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Postal code</th>
              <th>Countery Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <th>{orderDetails.address.recipient_name}</th>
                <th>{orderDetails.address.line1+ "-" +orderDetails.address.city}</th>
                <th>{orderDetails.address.postal_code}</th>
                <th>{orderDetails.address.country_code}</th>
            </tr>
          </tbody>
        </table>

        <table style={{margin:"30px 0"}}>
          <thead>
            <tr>
              <th></th>
              <th>Prdoucts</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {
                orderDetails.cart.map(item=>(
                    <tr key={item._id}>
                        <td><img src={item.images.url} alt=""/></td>
                        <td>{item.title}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price * item.quantity}</td>

                    </tr>
                ))
            }
          </tbody>
        </table>
    </div>
  )
}

export default HistroryDetail