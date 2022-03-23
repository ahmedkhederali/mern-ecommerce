import React ,{Fragment, useContext,useState} from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
function BtnRender({ product,deletProduct }) {
  const state = useContext(GlobalState);
  const [isAdmin] = state.UserApi.isAdmin;
  const addCart=state.UserApi.addCart;
  
  return (
    <div className="row_btn">
      {isAdmin ? (
        <Fragment>
          <Link to="#!" id="btn_buy" onClick={deletProduct}>
            Delete
          </Link>
          <Link to={`/edit_product/${product._id}`} id="btn_view">
            Edit
          </Link>
        </Fragment>
      ) : (
        <>
          <Link to="#!" id="btn_buy" onClick={()=>addCart(product)}>
            Buy
          </Link>
          <Link to={`/details/${product._id}`} id="btn_view">
            View
          </Link>
        </>
      )}
    </div>
  );
}

export default BtnRender;
