import React, { useState, useEffect } from 'react'
import Loader from "../loader/loader"
import Error from '../error/error';
import axios from 'axios'
import emptyCart from './images/empty_cart2.webp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faCalendarDay, faMessage, faMinus, faShoppingBag, faTrash, faUtensils } from '@fortawesome/free-solid-svg-icons'
import {url} from '../../url'
import { Link } from 'react-router-dom'
import './cart.css'

export default function Cart(props) {

    const [cart, setCart] = useState()
    const [pageError, setPageError] = useState()
    const token = JSON.parse(localStorage.getItem("profile")).token

    useEffect(() => {
        document.title = `Wallflour Bakehouse | Cart`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_2').classList.add('active')
        try{
            axios
            .get(url+'/cart/',{
                headers: {'authorization': `Bearer ${token}`}
            })
            .then((res)=>{
                setCart(res.data)
            })
            .catch((error)=>{
                setPageError(true)
            })
        } 
        catch(error){
            setPageError(true)
        }
    }, [])

    function deleteProductFromCart(productId, quantity){

        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .put(url+'/cart/deleteItemFromCart',{
                productId: productId,
                quantity: quantity
            },{
                headers: {'authorization': `Bearer ${token}`}
            })
            .then(()=>{
                let cartItem=cart.cartItems
                let price=0
                let discount=0
                cartItem.map((item, i)=>{
                    if(productId===item.product._id){
                        discount=item.product.discount
                        price=item.product.price
                        cartItem.splice(i, 1)
                    }
                })
                let grandTotal=cart.grandTotal-((price-(price*discount*0.01))*quantity)
                setCart({...cart, cartItems: cartItem, grandTotal: grandTotal})
            })
        } 
        catch(error){
            console.log(error)
        }
    }

    function updateQuantity(id, qty){
        let cartItem=cart.cartItems
        let grandTotal=0
        cartItem.map(item=>{
            if(id===item.product._id && qty<6 && qty>0){
                item.quantity=qty
                item.total=(item.product.price-(item.product.price*item.product.discount*0.01))*item.quantity
            }
            grandTotal+=item.total
            setCart({...cart, cartItems: cartItem})
        })
        setCart({...cart, grandTotal: grandTotal})
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            if(qty<6 && qty>0){
                axios
                .post(url+'/cart/addItemToCart', {
                    productId: id,
                    quantity: qty
                },{
                    headers: {'authorization': `Bearer ${token}`}
                })
            }
        } 
        catch(error){
            console.log(error)
        }
    }

    if(pageError){
        return(<Error login={true} />)
    }
    else if(cart){
        if(cart.cartItems.length>0){
            return (
                <div className="cart container-fluid mb-5">
                    <div className="head">Your Cart</div>
                    <div className="row heading">
                        <div className="col-4 col-md-4 col-lg-5">Product</div>
                        <div className="col-2 col-md-2 col-lg-2">Price</div>
                        <div className="col-2 col-md-3 col-lg-3">Quantity</div>
                        <div className="col-4 col-md-3 col-lg-2">Total</div>
                    </div>
                    {cart.cartItems.map(item=>
                        <div className="row cart_item pt-3 pb-3" key={item._id}>
                            <div className="col-4 col-lg-5 img_cont">
                                {item.customisation ? (<div className="customisation" onClick={()=>props.triggerModal("Customisation", item.customisation)}><FontAwesomeIcon icon={faMessage} /> </div>):(<></>)}
                                <Link to={`/menu/${item.product.productName}`} ><img src={item.product.image} alt="Reload"/></Link>
                                <div style={{textAlign: "center"}}>
                                    <Link to={`/menu/${item.product.productName}`} className="detail">{item.product.productName}</Link>
                                    {item.preOrder ? (
                                        <span className="preorder">
                                            <div className="text">Delivery: {item.preOrder}</div>
                                        </span>
                                    ):(<></>)}
                                </div>
                            </div>
                            <div className="col-2 col-lg-2 price_cont">
                                <div className="price">₹{item.product.price-(item.product.price*item.product.discount*0.01)}
                                {item.product.discount!==0 ? (
                                    <div className="discount_price">₹{item.product.price}</div>
                                ):(<></>)}
                                </div>
                            </div>
                            <div className="col-2 col-md-3 col-lg-3 quantity">
                                <div className="counter">
                                    <div className="display">{item.quantity}</div>
                                    <div className="controls">
                                        <div className="up" name="increment" onClick={()=>{updateQuantity(item.product._id,item.quantity+1)}}><FontAwesomeIcon icon={faAngleUp} /></div>
                                        <div className="down" name="decrement" onClick={()=>{updateQuantity(item.product._id,item.quantity-1)}}><FontAwesomeIcon icon={faAngleDown} /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 col-md-3 col-lg-2 total">₹ {(item.product.price-(item.product.price*item.product.discount*0.01))*item.quantity}</div>
                            <div className="remove_item" onClick={()=>deleteProductFromCart(item.product._id, item.quantity)}><FontAwesomeIcon icon={faTrash} /></div>
                        </div>
                    )}
                    {/* <div className="row">
                        <div className="coupon_cont">
                            <input type="text" placeholder="Coupon Code" />
                            <div className="coupon_btn">Apply Code</div>
                            <div className="subtotal">Subtotal: ₹ {cart.grandTotal}</div>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="total_cont">
                            <b>Total:</b>
                            <div className="total ms-3">₹ {cart.grandTotal}</div>
                        </div>
                        { cart.cartItems.length>0 ? (
                            <div className="btn_cont mt-5">
                                <Link to="/checkout"><div className="btn_">Checkout</div></Link>
                            </div>
                        ):(<></>)}
                    </div>
                </div>
            )
        }
        else{
            return(
                <div className="empty_cart">
                    <img src={emptyCart} alt="Empty Cart" />
                    <p>Your Cart is Empty.</p>
                    <Link to="/menu">
                        <div className="btn_cont">
                            <div className="btn_">Check our Menu <FontAwesomeIcon icon={faUtensils} /> </div>
                        </div>
                    </Link>
                </div>
            )
        }
    }
    else{
        return(
            <Loader/>
        )
    }
}
