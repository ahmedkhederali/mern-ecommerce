import React ,{useContext} from 'react'
import Cart from "./cart/Cart"
import Products from './products/Products'
import Login from "./auth/Login"
import Register from "./auth/Register"
import Notfound  from "./utils/NotFound/Notfound"
import { Route, Switch } from 'react-router-dom'
import DetailsProd from './details/DetailsProd'
import { GlobalState } from '../../GlobalState'
import OrderHistory from './history/OrderHistory'
import HistroryDetail from './history/HistroryDetail'
import Cateories from './categories/Cateories'
import CreateProduct from "./createProduct/CreateProduct"
function MainPage() {
  const state = useContext(GlobalState);
  const [isLogged]=state.UserApi.isLogged;
  const [isAdmin]=state.UserApi.isAdmin;
  const [cart]=state.UserApi.cart;
 
  return (
    <div>
    <Switch>
      <Route path="/" exact  component={Products}/>
      <Route path="/details/:id" exact  component={DetailsProd}/>

      <Route path="/login" exact  component={isLogged? Notfound:Login}/>
      <Route path="/register" exact  component={isLogged ? Notfound : Register}/>

      <Route path="/history" exact  component={isLogged ? OrderHistory : Notfound}/>
      <Route path="/histroy/:id" exact  component={isLogged? HistroryDetail:Notfound}/>
     
      <Route path="/category" exact  component={isAdmin ? Cateories : Notfound}/>
      <Route path="/create_product" exact  component={isAdmin ? CreateProduct : Notfound}/>
      <Route path="/edit_product/:id" exact  component={isAdmin ? CreateProduct  : Notfound}/>
      
      <Route path="/cart" exact  component={Cart}/>


      <Route path="*" exact  component={Notfound}/>
    </Switch>
    </div>
  )
}

export default MainPage