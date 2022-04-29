import React, { useState, useEffect } from 'react'
import Error from '../../error/error';
import axios from 'axios'
import Loader from '../../loader/loader'
import moment from 'moment';
import {url} from '../../../url'
import { Link } from 'react-router-dom'
import './order.css'

function OrderCard(props){

  return props.orders?.map(order=>
    <div className="col-12 col-md-6 col-lg-4 mt-4" key={order._id}>
      <div className={"order_card m-1"+(order.orderCancel ? " delete":"")}>
          {order.orderCancel ? <div className="mb-2" style={{fontWeight: "500", fontSize: "16px", color: "red"}}>Request Sent For Order Cancelation</div>:<></>}
          <div className="row_ order_number"><b>Order Number:</b> {order._id}</div>
          <div className="row_ total"><b>Total:</b> ₹{order.grandTotal}</div>
          <div className="row_ dishes">
              <b>Dishes:</b>
              {order.orderItems.map(prod=>
              <div key={prod.productName}>
                  {prod.quantity} x {prod.productName}: ₹{prod.total}
              </div>
              )}
          </div>
          <div className="row_ order_date"><b>Order Date:</b> {moment(order.createdAt).format("DD/MM/YYYY (hh:mm A)")}</div>
          {order.status!=="Delivered" ? (<div className="row_ order_date"><b>Expected Delivery Date:</b> {order.deliveryDate}</div>):(<div><div className="row_ order_date"><b>Delivered On:</b> {moment(order.updatedAt).format("DD/MM/YYYY")}</div></div>)}
          <Link to={'/user/orders/'+order._id} className="row_ ord_btn_cont">
              <div className="ord_btn">View Details</div>
          </Link>
      </div>
  </div>
  )
}

export default function UserOrders() {

  const [activeOrders, setActiveOrders]=useState()
  const [completedOrders, setCompletedOrders]=useState()
  const [pageError, setPageError] = useState()

  useEffect(() => {
    document.title = `WallFlour Bakehouse | Orders`
    window.scrollTo(0, 0)
    document.querySelectorAll('.mob_list').forEach((ele)=>{
        if(!ele.classList.contains('active')) return
        ele.classList.remove('active')
    })
    document.getElementById('mob_4').classList.add('active')
    try{
        const token = JSON.parse(localStorage.getItem("profile")).token
        axios
        .get(url+'/order/',{
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res)=>{
          setActiveOrders(res.data.activeOrders.reverse())
          setCompletedOrders(res.data.completedOrders.reverse())
        })
        .catch(()=>{
          setPageError(true)
        })
    } 
    catch(error){
      setPageError(true)
    }
  }, [])

  if(pageError){
    return(<Error login={true} />)
  }
  else if(activeOrders && completedOrders){
    return (
      <div className='container user_order_cont mb-5'>
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/user/dashboard">Dashboard</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Orders</li>
            </ol>
        </nav>
        <div className="heading">Your Orders</div>
        <div className="row section active_orders mt-4">
          <div className="col-12 heading">Active Orders</div>
            {activeOrders.length>0 ? (<OrderCard active={true} orders={activeOrders} />):(
              <div className='no_orders'>There is no active orders</div>
            )}
        </div>
        <div className="row section active_orders mt-4">
          <div className="col-12 heading">Previous Orders</div>
            {completedOrders.length>0 ? (<OrderCard active={false} orders={completedOrders} />):(
              <div className='no_orders'>You have never bought a anything from us?!?</div>
            )}
        </div>
      </div>
    )
  }else{
    return(<Loader/>)
  }
}
