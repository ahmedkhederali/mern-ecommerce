import React, { useContext } from 'react'
import {GlobalState} from "../../../GlobalState"
function Filter() {
    const state=useContext(GlobalState)
    const [product,setProduct]=state.productApi.product
    const [categories, setCategories] = state.categories.category;
    // used For Filter
    const[category,setCategory]=state.productApi.category
    const [sort,setSort]=state.productApi.sort
    const [search,setSearch]=state.productApi.search
    const [page,setPage]=state.productApi.page
    const [result,setResult]=state.productApi.result

    const handleCategory=e=>{
        setCategory(e.target.value)
        setSearch('')
        
    }
    const handleSearch=e=>{
        setSearch(e.target.value.toLowerCase())
        
    }
    const handleSort=e=>{
        setSort(e.target.value)  
       
    }
    
  return (
    <div className='filter_menu '>
        <div className='row sort'>
            <span>Filter:</span>
            <select name="category" value={category } onChange={handleCategory}>
            <option value="">All Products</option>
            {categories.map((cat) => (
              <option value={"category="+cat.name} key={cat._id} >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <input type="text" placeholder='Enter Your Search!'  onChange={handleSearch} value={search}/>


        <div className='row'>
        <span>Sort By: </span>
        <select name="sort" value={sort} onChange={handleSort}>
        <option value=""> Newest  </option>
        <option value="sort=oldest"> Oldest  </option>
        <option value="sort=-sold">Best Sold</option>
        <option value="sort=-price">Price : High-low</option>
        <option value="sort=price">Price : low-High</option>
        
      </select>
    </div>
    </div>
  )
}

export default Filter