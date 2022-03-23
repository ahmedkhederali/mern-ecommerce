import React ,{useContext}from 'react'
import {GlobalState} from "../../../GlobalState"
function LoadMore() {
    const state=useContext(GlobalState)
    const [result,setResult]=state.productApi.result
    const [page,setPage]=state.productApi.page
  return (
    <div className='load_more'>
        {
            result.length<page*9?"":
            <button onClick={()=>setPage(page+1)}>More Products</button>
        }
    </div>
  )
}
export default LoadMore