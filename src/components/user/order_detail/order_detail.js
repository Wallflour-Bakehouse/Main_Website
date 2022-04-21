import React, { useState, useEffect } from 'react'
import Error from '../../error/error';
import axios from 'axios'
import Loader from '../../loader/loader'
import {url} from '../../../url'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import '../../cart/cart.css'
import './order_detail.css'

export default function UserOrderDetail(props) {

    const ord = useParams()
    const [order, setOrder] = useState()
    const [pageError, setPageError] = useState()

    useEffect(() => {
        document.title = `Wallflour Bakehouse | Order`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_4').classList.add('active')
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .get(url+`/order/${ord.orderId}`,{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=>{
                if(res.status===200)
                    setOrder(res.data)
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
    else if(order){
        return (
            <div className='order_detail cart container mb-5'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/user/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/user/orders">Orders</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{order._id}</li>
                    </ol>
                </nav>
                <div className="head">Your Order: {order.id}</div>
                <div className="status">
                    <div className="ord_status"><b>Status:</b> {order.status}</div>
                    <div className="ord_status"><b>Payment:</b> {order.paymentStatus ? (<>{order.paymentStatus ==="Paid" ? ("Amount Recieved"):(<Link>Click Here To Make payment</Link>)}</>):("Waiting for Accepting Order")}</div>
                </div>
                <div className="row heading">
                    <div className="col-4 col-md-4 col-lg-5">Product</div>
                    <div className="col-2 col-md-2 col-lg-2">Price</div>
                    <div className="col-3 col-md-2 col-lg-3">Quantity</div>
                    <div className="col-3 col-md-2 col-lg-2">Total</div>
                </div>
                {order.orderItems.map(item=>
                    <div className="row cart_item pt-3 pb-3" key={item._id}>
                        <div className="col-4 col-md-4 col-lg-5 img_cont">
                            {item.customisation ? (<div className="customisation" onClick={()=>props.triggerModal("Customisation", item.customisation)}><FontAwesomeIcon icon={faMessage} /> </div>):(<></>)}
                            <Link to={`/menu/${item.product.productName}`} ><img src={item.product.image} alt="Reload"/></Link>
                            <div style={{textAlign: "center"}}>
                                <Link to={`/menu/${item.product.productName}`} className="detail">{item.product.productName} </Link>
                                {item.preOrder ? (
                                    <span className="preorder">
                                        <div className="text">Delivery: {item.preOrder}</div>
                                    </span>
                                ):(<></>)}
                            </div>
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 price_cont">
                            <div className="price">₹{item.product.price-(item.product.price*item.product.discount*0.01)}</div>
                            {item.product.discount!==0 ? (
                                <>  
                                    <div className="discount_price">₹{item.product.price}</div>
                                </>
                            ):(<></>)}
                        </div>
                        <div className="col-3 col-md-2 col-lg-3 quantity">{item.quantity}</div>
                        <div className="col-3 col-md-2 col-lg-2 total">₹ {item.total}</div>
                    </div>
                )}
                {order.couponCode!=="" ? (<div className="row">
                    <div className="coupon_cont">
                        <div><b>Coupon Code: </b></div>
                        <div className="coupon_code">{order.discount}</div>
                        <div className="subtotal">Subtotal: ₹ {order.grandTotal}</div>
                    </div>
                </div>):(<></>)}
                <div className="row">
                    <div className="total_cont">
                        <b>Total:</b>
                        <div className="total ms-3">₹ {order.grandTotal}</div>
                    </div>
                </div>
                <div className="row row3 mt-5">
                    <div className="col-12 col-md-6">
                        <div className="add bill_add p-3 p-md-4 mb-4">
                            <div className="heading">Billing Address</div>
                            <div className="name">Name: {order.user.firstname} {order.user.lastname}</div>
                            <div className="name">Phone: +{order.user.countryCode} - {order.user.phoneNumber}</div>
                            <div><b>Address:</b></div>
                            <p>{order.user.billingAddress.address}, {order.user.billingAddress.landmark}, {order.user.billingAddress.city} - {order.user.billingAddress.pincode}, {order.user.billingAddress.state}</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="add ship_add p-3 p-md-4">
                            <div className="heading">Shipping Address</div>
                            <div className="name">Name: {order.shippingAddress.name}</div>
                            <div className="name">Phone: +{order.shippingAddress.countryCode} - {order.shippingAddress.phoneNumber}</div>
                            <div><b>Address:</b></div>
                            <p>{order.shippingAddress.address}, {order.shippingAddress.landmark}, {order.shippingAddress.city} - {order.shippingAddress.pincode}, {order.shippingAddress.state}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(<Loader/>)
    }
}
