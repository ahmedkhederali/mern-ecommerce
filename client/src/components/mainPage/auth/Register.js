import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response=await axios.post('/user/register',{name,email,password})
      console.log(response)
      localStorage.setItem("firstLogin",true)
      window.location.href="/"
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Congratulation You Are Registered",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.msg,
      });
    }
  };
  return (
    <div className="login-page">
      <form onSubmit={registerSubmit}>
      <h2>Register</h2>
      <input
          type="text"
          name="name"
          required
          placeholder="Enter Your UserName"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="row">
          <button type="submit">Register</button>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
