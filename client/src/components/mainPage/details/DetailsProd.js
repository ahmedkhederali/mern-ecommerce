import React, { useState, useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link, useParams } from "react-router-dom";
import ProductItem from "../utils/productItem/ProductItem";
function DetailsProd() {
  const state = useContext(GlobalState);
  const params = useParams(); // to get id from URl Like req.body
  const [products] = state.productApi.product;
  const [details, setDetails] = useState([]);
  const addCart=state.UserApi.addCart;

  useEffect(() => {
    if (params.id) {
      products.forEach((prod) => {
        if (params.id === prod._id) setDetails(prod);
      });
    }
  }, [params.id, products]);
  if (details.length === 0) return <h1>Empty Values......</h1>;
  return (
    <>
      <div className="detail">
        <img src={details.images.url} alt="product-image" />
        <div className="box-detail">
          <div className="row">
            <h2>{details.title}</h2>
            <h6>ID: {details.product_id}</h6>
          </div>
          <span>$ {details.price}</span>
          <p> {details.description}</p>
          <p> {details.content}</p>
          <p>Sold: {details.sold}</p>
          <Link className="cart" to="/cart" onClick={()=>addCart(details)}>
            Buy Now
          </Link>
        </div>
      </div>
      <div>
        <h2>Related Products</h2>
        <div className="products">
        {products.map((product) => {
            return product.category === details.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null;
            //console.log(details.category)
          })}
        </div>
      </div>
    </>
  );
}

export default DetailsProd;
