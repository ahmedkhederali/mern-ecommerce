import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import ProductApi from "./api/ProductApi";
import UserApi from "./api/UserApi";
import Categories from "./api/Categories";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);
  const refreshToken = async () => {
    const refresh = await axios.get("/user/refresh_token");
    //console.log(refresh.data.accesstoken)
    setToken(refresh.data.accesstoken);
  };
  const state = {
    token: [token, setToken],
    productApi: ProductApi(),
    UserApi:UserApi(token),
    categories:Categories()
  };
  
  useEffect(() => {
    // refrehToken didn't send Except there is an localstorage
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) refreshToken();
  }, []);
  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
