import React, { useState, useContext, Fragment } from "react";
import { GlobalState } from "../../GlobalState";
import carts from "./icons/carts.svg";
import menu from "./icons/menu.svg";
import close from "./icons/close.svg";
import { Link } from "react-router-dom";
import axios from "axios";
function Header() {
  const state = useContext(GlobalState);
  const [isLogged,setIsLogged]=state.UserApi.isLogged;
  const [isAdmin,setIsAdmin]=state.UserApi.isAdmin;
  const [cart,setCart]=state.UserApi.cart;
  const [menus,setMenu]=useState(false)
  

  const logOutUser=async()=>{
    await axios.get('/user/logout')
    localStorage.removeItem('firstLogin')
    /* 
    instead of this three delete setIsLogged,setIsAdmin , setCart from above 
      use window.location.href="/" 

      reason beause  window.location.href="/"  is reload page 
    */

    setIsAdmin(false) // to retriver login/register
    setIsLogged(false)// to retriver login/register
    setCart([])// to delete cart After logout without this line when logout your cart still show
}

  const adminRouter=()=>{
    return (
      <Fragment>
        <li><Link to="/create_product">Create Products</Link></li>
        <li><Link to="/category">Category</Link></li>
      </Fragment>
    )
  }


  const loggedRouter=()=>{
    return (
      <Fragment>
        <li><Link to="/history">History</Link></li>
        <li><Link to="/" onClick={logOutUser}>Logout</Link></li>
      </Fragment>
    )
  }

  const styleMenu={
    left:menus? 0: "-100%"
  }

  const toggle=()=>{
    setMenu(!menus)
  }
  return (
    <header>
      <div className="meun" onClick={()=>setMenu(!menus)}>
        <img src={menu} alt="menu_Image" width="30" />
      </div>
      <div className="logo">
        <h1>
          <Link to="/">{isAdmin? 'ADMIN': 'Amazona'}</Link>
        </h1>
      </div>

      <ul style={styleMenu}>
        <li><Link to="/">{isAdmin ? 'Products': 'Shop'}</Link></li>
        {isAdmin && adminRouter()}
        {
          isLogged ? loggedRouter() : <li><Link to="/login">Login⚛️Register</Link></li>
        }
        <li onClick={()=>setMenu(!menus)}>
          <img src={close} alt="close" width="30" className="meun" />
        </li>
      </ul>
      {isAdmin ? '' : <div className="cart-icon">
      <span >{ isLogged ? cart.length : 0}</span>
      <Link to="/cart">
        <img src={carts} alt="cart" width="30" />
      </Link>
    </div>}
    </header>
  );
}


export default Header;
