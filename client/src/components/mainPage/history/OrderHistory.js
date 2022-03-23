import React ,{useContext}from 'react'
import {GlobalState} from "../../../GlobalState"
import { Link } from 'react-router-dom';
function OrderHistory() {
  const state = useContext(GlobalState);
  const [history]=state.UserApi.history
//console.log(history)

  return (
    <div className='history-page'>
      <h2>History..</h2>
      <h4>You Have {history.length} Order</h4>
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Date OF Purchased</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
             history.map(item=>(
                <tr key={item._id}>
                  <td>{item.paymentID}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td><Link to={`histroy/${item._id}`}>View</Link></td>
                </tr>
             ))
            }
          </tbody>
        </table>
    </div>
  )
}
export default OrderHistory