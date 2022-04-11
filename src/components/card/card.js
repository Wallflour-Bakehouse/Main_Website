import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {url} from '../../url'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons'
import './card.css'


export default function Card({ categoryProducts, favourites, reload }) {

    const [calculation, setCalculation] = useState(false)
    const [token, setToken] = useState(localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).token : "")

    useEffect(()=>{
        if(favourites){
            for(let i=0;i<favourites.length;i++){
                for(let j=0;j<categoryProducts.length;j++){
                    if(favourites[i]._id===categoryProducts[j]._id){
                        categoryProducts[j].active=true
                    }
                }
            }
        }
        setCalculation(true)
    },[])

    function manageProductFavourites(productId){
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            if(document.getElementById(productId).classList.contains('active')){
                axios
                .post(url+'/user/removeProductFromFavourites', {
                    productId: productId
                },{
                    headers: {'authorization': `Bearer ${token}`}
                })
                .then(()=>{
                    document.getElementById(productId).classList.remove('active')
                    if(reload){
                        window.location.reload()
                    }
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
                    if(reload){
                        window.location.reload()
                    }
                })    
            }
        } catch(error) {
            console.log(error)
        }
    }

    if(categoryProducts&&calculation){
        return categoryProducts.map((prod)=>
            <div className="col-12 col-md-4 col-lg-3" key={prod._id}>
                <div className='food_main_card '>
                    <Link to={`/menu/${prod.productName}`}>
                        <div className="food_card">
                            <div className="img_cont">
                                <div className="img" style={{backgroundImage: `url(${prod.image})`}}></div>
                            </div>
                            <div className="food_name">{prod.productName}</div>
                            <div className="food_categories">
                                { prod.comments.length===0 ? (
                                    <div className="food_reviews"><FontAwesomeIcon icon={faStar} />{prod.rating}/5 (No reviews)</div>
                                ):(
                                    <div className="food_reviews"><FontAwesomeIcon icon={faStar} />{prod.rating}/5 ({prod.comments.length} { prod.comments.length===1 ? <>review</>:<>reviews</> })</div>
                                )}
                                { prod.typeOfDish ==="Veg" ? (
                                    <div className='type veg'>Veg</div>
                                ):(
                                    <div className='type nonveg'>Non Veg</div>
                                )}
                            </div>
                            <div className="price_cont">
                                <div className="price">₹{prod.price-(prod.price*prod.discount*0.01)}</div>
                                {prod.discount!==0 ? (
                                    <>  
                                        <div className="discount_price">₹{prod.price}</div>
                                        <div className="discount">Save {prod.discount}%</div>
                                    </>
                                ):(<></>)}
                            </div>
                        </div> 
                    </Link>
                    {token ? (
                        <div className={"like "+(prod.active ? "active" : "")} id={prod._id} onClick={()=>manageProductFavourites(prod._id)}>
                            <FontAwesomeIcon icon={faHeart} />
                        </div>
                    ):(<></>)}
                </div>    
            </div>
        )
    }
    else{
        return(
            <></>
        )
    }
}
