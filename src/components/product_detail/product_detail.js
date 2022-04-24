import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import Error from '../error/error';
import CommentCard from '../comment_card/comment_card'
import Loader from '../loader/loader'
import { Input } from 'reactstrap'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faHeart } from '@fortawesome/free-solid-svg-icons'
import {url} from '../../url'
import './product_detail.css'

function CommentsSection({productName, comments}){

    const [comment, setComment] = useState({ _id:'', rating: 5, comment:''})
    const [user, setUser] = useState('')
    const [dp, setDp] = useState()
    const [userComments, setUserComments] = useState()
    const [otherComments, setOtherComments] = useState()
    const [token, setToken] = useState(localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).token : "")

    useEffect(()=>{
        try{
            if(token){
                let username = JSON.parse(localStorage.getItem("profile")).result.username
                setUser(username)
                axios
                .get(url+'/user/userDP',{
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res)=>{
                    setDp(res.data)
                })
                let userComments = comments.filter(comment=>{
                    return comment.user===username
                })
                let otherComments = comments.filter(comment=>{
                    return comment.user!==username
                })
                setUserComments(userComments)
                setOtherComments(otherComments)
            }
            else{
                setUserComments(true)
                setOtherComments(comments)
            }
        }
        catch(error){
            console.log(error)
        }
    },[])

    function changeComment(e){
        setComment({...comment, [e.target.name]: e.target.value})
    }

    function postComment(){
        
        if(user.length<1) return
        if(comment.rating<0 || comment.rating>5) return
        if(comment.length<2 || comment.length > 200) return
        if(token){
            if(comment._id!=''){
                try{
                    axios
                    .put(url+'/comment/'+comment._id,{
                        'productName': productName,
                        'rating': comment.rating,
                        'comment': comment.comment,
                    },{
                        headers: { "authorization": `Bearer ${token}` }
                    })
                    .then(()=>{
                        window.location.reload()
                    })
                } catch(error){
                    console.log(error)
                }
            } else{
                try{
                    axios
                    .post(url+'/comment/new_comment',{
                        'productName': productName,
                        'rating': comment.rating,
                        'comment': comment.comment,
                    },{
                        headers: { "authorization": `Bearer ${token}` }
                    })
                    .then((res)=>{
                        window.location.reload()
                    })
                } catch(error){
                    console.log(error)
                }
            }
        }
    }

    if(userComments&&otherComments){
        return (
            <div className="col-12 mt-5">
                <h3>Comments</h3>
                {token ? (<div className="add_comment_sec">
                    <div className="row1">
                        <div className="img" style={{backgroundImage: 'url('+dp+')'}}></div>
                        <div className='form'>
                            <div className='mb-2'>
                                <label htmlFor="">Rating</label>
                                <select name="rating" onChange={changeComment}>
                                    <option value={5}>5</option>
                                    <option value={4}>4</option>
                                    <option value={3}>3</option>
                                    <option value={2}>2</option>
                                    <option value={1}>1</option>
                                </select>
                            </div>
                            <textarea type="text" placeholder='Add a comment...' name="comment" onChange={changeComment} value={comment.comment} />
                        </div>
                    </div>
                    <div className="btn_cont" onClick={postComment}><div className="btn_">Comment</div></div>
                </div>):(<></>)}
                { comments.length === 0 ? (
                    <>
                        {token ? (
                            <div className="no_comments">Be the first one to comment!!</div>
                        ):(
                            <div className="no_comments"><Link to="/login">Login</Link> To Comment</div>
                        )}
                    </>
                ):(
                    <div className='comment_section'>
                        {userComments.length>0 ? (
                            userComments.map((comment)=>
                                <CommentCard commentReview={true} comment={comment} setComment={setComment} scroll={false} />
                            )
                        ):(<></>)}
                        {otherComments ? (
                            otherComments.map((comment)=>
                                <CommentCard commentReview={false} comment={comment} />
                            )
                        ):(<></>)}
                    </div>
                )}
            </div>
        )
    } else{
        return <></>
    }
}

function FavouriteButton({productId, favourites}){

    const [active, setActive] = useState(false)
    const [token, setToken] = useState(localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).token : "")

    useEffect(()=>{
        if(favourites){
            for(let i=0;i<favourites.length;i++){
                if(favourites[i]._id===productId){
                    setActive(true)
                }
            }
        }
    },[])

    function manageProductFavourites(productId){
        try{
            if(token){
                if(document.getElementById(productId).classList.contains('active')){
                    axios
                    .post(url+'/user/removeProductFromFavourites', {
                        productId: productId
                    },{
                        headers: {'authorization': `Bearer ${token}`}
                    })
                    .then(()=>{
                        document.getElementById(productId).classList.remove('active')
                    })
                }
                else{
                    axios
                    .post(url+'/user/addProductToFavourites', {
                        productId: productId
                    },{
                        headers: {'authorization': `Bearer ${token}`}
                    })
                    .then(()=>{
                        document.getElementById(productId).classList.add('active')
                        
                    })    
                }
            }
            
        }
        catch(error) {
            console.log(error)
        }
    }

    return(
        <div className={"like"+(active ? " active" : "")} id={productId} onClick={()=>manageProductFavourites(productId)}>
            <FontAwesomeIcon icon={faHeart} />
        </div>
    )
}


export default function ProductDetail() {

    const prod = useParams()
    const [product, setProduct] = useState()
    const [favourites, setfavourites] = useState()
    const [cartMessage, setCartMessage] = useState("Added To Cart")
    const [preOrderDates, setPreOrderDates] = useState()
    const [cartItem, setCartItem] = useState({
        customisation: '',
        quantity: 1,
        preOrder:''
    })
    const [pageError, setPageError] = useState()
    const [token, setToken] = useState(localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).token : "")

    useEffect(() => {
        document.title = `WallFlour Bakehouse | ${prod.prodName}`
        window.scrollTo(0, 0)
        
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_3').classList.add('active')
        try{
            axios
            .get(url+`/product/${prod.prodName}`)
            .then((res)=>{
                if(res.status===200)
                    setProduct(res.data)
            })
            .catch(()=>{
                setPageError(true)
            })
            if(token){
                axios
                .get(url+'/user/userFavourites',{
                    headers: {'authorization': `Bearer ${token}`}
                })
                .then((res)=>{
                    setfavourites(res.data)
                })
            } else{
                setfavourites(true)
            }
            let dates=[]
            let today = moment().format("DD/MM/YYYY")
            for(let i=0; i<=7; i++){
                dates.push(moment(today, "DD/MM/YYYY").add(i, 'days').format("DD/MM/YYYY"))
            }
            setPreOrderDates(dates)
            setCartItem({...cartItem, preOrder: today})
        }
        catch(error){
            console.log(error)
        }
    }, [])

    function handleChange(e){
        setCartItem({...cartItem, [e.target.name]: e.target.value})
    }

    function addToCart(){
        try{
            if(cartItem.preOrder==='' || !cartItem.quantity || cartItem.quantity===0) return
            if(token){
                axios
                .post(url+'/cart/addItemToCart', {
                    productId: product._id,
                    quantity: cartItem.quantity,
                    customisation: cartItem.customisation,
                    preOrder: cartItem.preOrder
                },{
                    headers: {'authorization': `Bearer ${token}`}
                })
                .then(()=>{
                    document.querySelector(".cart_msg").classList.remove('error')
                    document.querySelector(".cart_msg").classList.add('active')
                })
            }
            else{
                setCartMessage("Log in to Add to Cart")
                document.querySelector(".cart_msg").classList.remove('active')
                document.querySelector(".cart_msg").classList.add('error')
            }
        } 
        catch(error){
            setCartMessage("Can't Add to Cart")
            document.querySelector(".cart_msg").classList.remove('active')
            document.querySelector(".cart_msg").classList.add('error')
        }
    }

    if(pageError){
        return(<Error login={false} />)
    }
    else if(product&&favourites){
        return (
            <div className="prod_det container-fluid">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/menu">Menu</Link></li>
                        <li className="breadcrumb-item active">{product.productCategory}</li>
                        <li className="breadcrumb-item active" aria-current="page">{product.productName}</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-12 col-lg-5 mb-4">
                        <div className="img_cont">
                            <div className="img" style={{backgroundImage: `url(${product.image})`}}></div>
                            <FavouriteButton productId={product._id} favourites={favourites} />
                        </div>
                    </div>
                    <div className="col-12 col-lg-7">
                        <div className="content">
                            <div className="heading">
                                {product.productName}
                                { product.typeOfDish ==="veg" ? (
                                    <span className='type veg'><span className="circ"></span></span>
                                ):(
                                    <span className='type nonveg'><span className="circ"></span></span>
                                )}
                            </div>
                            <div className="rating"><FontAwesomeIcon icon={faStar}/> {product.rating}/5</div>
                            <div className="desc">{product.description}</div>
                            {product.allergy!=="" ? (<div className="batch_size"><b>Allergy:</b> {product.allergy}</div>):(<></>)}
                            <div className="batch_size"><b>Batch Size:</b> {product.batchSize}</div>
                            <div className="price_cont">
                                <div>
                                    <b>Price:</b>
                                    <span className="price ps-2">₹{product.price-(product.price*product.discount*0.01)}</span>
                                    {product.discount>0 ? (
                                        <>  
                                            <span className="discount_price">₹{product.price}</span>
                                            <span className="discount">Save {product.discount}%</span>
                                        </>
                                    ):(<></>)}
                                </div>
                                <div className="qnt">
                                    <b>Quantity:</b>
                                    <select name="quantity" onChange={handleChange}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>    
                                {product.discount!==0 ? (
                                    <>  
                                        <div className="total"><b>Total:</b> ₹ {(product.price-(product.price*product.discount*0.01))*cartItem.quantity}</div>
                                    </>
                                    ):(
                                    <>
                                        <div className="total"><b>Total:</b> ₹ {product.price*cartItem.quantity}</div>
                                    </>
                                )}
                            </div>
                            <div className="preorder">
                                <b>Select Delivery Date:</b>
                                <select name="preOrder" onChange={handleChange}>
                                    {preOrderDates.map((date, i)=>
                                        <option value={date} id={i} key={i}>{date}</option>
                                    )}
                                </select>
                            </div>
                            { product.customisation ? (
                                <div className="message mb-4">
                                    <Input type="textarea" rows="3" name="customisation" autoComplete="off" placeholder="Add Customisation" value={cartItem.customisation} onChange={handleChange} />
                                </div>
                            ):(<></>)}
                            {!product.deleted ? 
                            (<div className="btn_cont">
                                <div className="btn_" onClick={addToCart}>
                                    Add To Cart
                                </div>
                                <div className="cart_msg">{cartMessage}</div>
                            </div>):(<div className="btn_cont">Product has Been Removed</div>)}
                        </div>
                    </div>
                    {!product.deleted ? (
                        <CommentsSection productName={product.productName} comments={product.comments} />
                    ):(<></>)}
                </div>
            </div>
        )
    }
    else{
        return(
            <Loader />
        )
    }
}
