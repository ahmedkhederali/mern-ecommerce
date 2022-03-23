import React ,{useEffect,useState}from 'react'
import axios from 'axios'
import Swal from "sweetalert2";
function UserApi(token) {
    const [isLogged,setIsLogged]=useState(false)
    const [isAdmin,setIsAdmin]=useState(false)
    const [cart,setCart]=useState([])
    const [history,setHistory]=useState([])
    const [callback,setCallback]=useState(false)
    useEffect(()=>{
        if(token){
            const getUser=async()=>{
                try {
                    const user=await axios.get('/user/infor',{
                        headers: {Authorization:token}
                    })
                    setIsLogged(true) // when loggin delete login/register 
                    user.data.role===1?setIsAdmin(true):setIsAdmin(false)
                    setCart(user.data.cart) // when loggin retrive the cart whic choose before 
                } catch (error) {
                    alert(error.response.data.msg)
                }
            }
            getUser()
        }
    },[token])

    //to get History  Array 
    useEffect(()=>{
        if(token){
            const getHistory=async()=>{

                if(isAdmin){
                    // to show payments if Admin if A normal user  
                    const res=await axios.get('/api/payment',{headers:{Authorization:token}})
                   // console.log(res)
                    setHistory(res.data.payments)

                }else{
                    const res=await axios.get('/user/history',{headers:{Authorization:token}})
                    setHistory(res.data)
                }
             
            }
            getHistory()
        }

    },[token,callback,isAdmin])// we put callback as a boolean to re-render when payment and make change sound in out app && put  isAdmin to changes history page when admin open


    const addCart=async (product)=>{
        if(!isLogged) return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Login Or Register",
          });
        const check =cart.every(item=>{
            console.log(item._id !== product._id)
            return item._id !== product._id; // return true or false    true mean ==> the item already in cart    false ==> item didn't in cart and it will be added
        })
        if(check){
            setCart([...cart,{...product, quantity:1}])
            await axios.patch('/user/addcart',{cart:[...cart,{...product, quantity:1}]},{headers : {Authorization:token}})
        }else{
            Swal.fire({
                icon: "success",
                title: "This Product has been Added To Cart",
                showConfirmButton: false,
                timer: 1500,
              });
        }

    }
  return (
   {
       isLogged:[isLogged,setIsLogged],
       isAdmin:[isAdmin,setIsAdmin],
       history:[history,setHistory],
       callback: [callback,setCallback],
       cart:[cart,setCart],
       addCart:addCart,
       
   }
  )
}

export default UserApi