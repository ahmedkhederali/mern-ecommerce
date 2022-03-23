import React ,{useEffect,useState}from 'react'
import axios from 'axios'
import Swal from "sweetalert2";

function Categories (token){
    // To GEt Categories
    const [category,setCategory]=useState([])
    const [callback,setCallback]=useState(false)
    useEffect(()=>{
        
            const getCategory=async()=>{
                try {
                    const category=await axios.get('/api/category',{
                        headers: {Authorization:token}
                    })
                    setCategory(category.data)
                  
                } catch (error) {
                    return null
                  
                }
            }
            getCategory()
        
    },[callback])
    return ({
        category:[category,setCategory],
        callback: [callback,setCallback],
    })
}
export default Categories