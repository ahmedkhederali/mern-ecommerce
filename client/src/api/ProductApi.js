import React ,{useEffect,useState}from 'react'
import axios from 'axios'

function ProductApi() {
    const [product,setProduct]=useState([]);
    const [callback,setCallback]=useState(false)

    // How To make Filter
    const [category,setCategory]=useState('')
    const [sort,setSort]=useState('')
    const [search,setSearch]=useState('')
    const [page,setPage]=useState(1)
    const [result,setResult]=useState(0)
  

    const getAllProducts=async()=>{
        const res=await axios.get(`/api/product?limit=${page*9}&${category}&${sort}&title[regex]=${search}`)
        setProduct(res.data.products)
        setResult(res.data.products)//filter result
      
    }

    useEffect(()=>{
        getAllProducts()
    },[callback,category,sort,search,page])

  return {
    product:[product,setProduct],
    callback:[callback,setCallback],

    // Allow OF the below is used For Filter
    category:[category,setCategory],
    sort: [sort,setSort],
    search: [search,setSearch],
    page: [page,setPage],
    result: [result,setResult]
  }
}

export default ProductApi