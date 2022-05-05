import React, { useState, useEffect } from 'react'
import Error from '../../error/error';
import axios from 'axios'
import moment from 'moment'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Loader from '../../loader/loader'
import {url} from '../../../url'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faTrashCan, faRetweet } from '@fortawesome/free-solid-svg-icons'
import '../../cart/cart.css'
import './order_detail.css'

export default function UserOrderDetail(props) {

    const ord = useParams()
    const [modal, setModal] = useState({open: false, header: "", body: ""})
    const [order, setOrder] = useState()
    const [pageError, setPageError] = useState()
    const token = JSON.parse(localStorage.getItem("profile")).token

    useEffect(() => {
        document.title = `Wallflour Bakehouse | Order`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_4').classList.add('active')
        try{
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

    function closeModal(){
        setModal({open: !modal.open})
    }

    function triggerModal(header, body, deleopt){
        setModal({
            open: !modal.open,
            header: header,
            body: body,
            delete: deleopt,
        })
    }

    function orderCancelation(){
        axios
        .delete(url+`/order/orderCancelation/${order._id}`,{
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(()=>{
            props.triggerModal("Order Cancellation", "Cancellation Request Sent!")
        })
        .catch(()=>{
            props.triggerModal("Error", "Could not request cancelation")
        })
    }

    function orderRestore(){
        axios
        .delete(url+`/order/orderRestore/${order._id}`,{
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(()=>{
            props.triggerModal("Order Restored", "Order is successfully restored!")
        })
        .catch(()=>{
            props.triggerModal("Error", "Could not request cancelation")
        })
    }

    function DialogBox() {
        return (
            <Modal isOpen={modal.open} toggle={closeModal}>
                <ModalHeader toggle={closeModal}>{modal.header}</ModalHeader>
                <ModalBody>{modal.body}</ModalBody>
                <ModalFooter>
                <button type="button" className={"btn"+(modal.delete ? " btn-danger":" btn-success")} onClick={modal.delete ? orderCancelation : orderRestore }>{modal.delete ? "Delete":"Restore"} Order</button>
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                </ModalFooter>
            </Modal>
        )
    }

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
                {order.orderCancel ? <div className="mb-4" style={{fontWeight: "500", fontSize: "22px", color: "red"}}>Request Sent For Order Cancelation</div>:<></>}
                <DialogBox />
                {order.status!=="Delivered" ? (<div className="delete" onClick={()=>triggerModal("Order Cancelation", "Are you sure you want to delete this order? Cancelled orders have penalty.",true)}><FontAwesomeIcon icon={faTrashCan}/></div>):(<></>)}
                {order.orderCancel ? <div className="delete restore" onClick={()=>triggerModal("Restore Order?", "Restoring the oroduct will remove the delete request.", false)}><FontAwesomeIcon icon={faRetweet} /></div>:<></>}
                <div className="head">Your Order: {order._id}</div>
                <div className="status">
                    <div className="ord_status"><b>Status:</b> {order.status}</div>
                    <div className="ord_status"><b>Payment:</b> {order.status!=="Order Not Accepted" ? (<>{order.paymentStatus ==="Recieved" ? ("Payment Recieved"):(<Link>Click Here To Make payment</Link>)}</>):("Waiting for Accepting Order")}</div>
                </div>
                <div className="status">
                    <div className="ord_status"><b>Order Date:</b> {moment(order.createdAt).format("DD/MM/YYYY")}</div>
                    <div className="ord_status"><b>{order.status!=="Delivered" ? ("Expected"):("")} Delivery Date:</b> {order.deliveryDate}</div>
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
                            <Link to={`/menu/${item.productName}`}><img src={item.productImage} alt="Reload"/></Link>
                            <div style={{textAlign: "center"}}>
                                <Link to={`/menu/${item.productName}`} className="detail">{item.productName} </Link>
                            </div>
                        </div>
                        <div className="col-2 col-lg-2 price_cont">
                                <div className="price">₹{item.productPrice-(item.productPrice*item.discount*0.01)}
                                {item.discount!==0 ? (
                                    <div className="discount_price">₹{item.productPrice}</div>
                                ):(<></>)}
                                </div>
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
                            <div className="name">Name: {order.billingAddress.name}</div>
                            <div className="name">Phone: +{order.billingAddress.countryCode} - {order.billingAddress.phoneNumber}</div>
                            <div><b>Address:</b></div>
                            <p>{order.billingAddress.address}, {order.billingAddress.landmark}, {order.billingAddress.city} - {order.billingAddress.pincode}, {order.billingAddress.state}</p>
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
