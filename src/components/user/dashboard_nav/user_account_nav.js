import React, { useState, useEffect } from 'react'
import Error from '../../error/error';
import axios from 'axios'
import CircleLoader from '../../loader/circle_loader';
import {url} from '../../../url'
import { Link, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapLocationDot, faUserLock, faMessage, faCommentDots, faHeart, faTicket, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import './user_account_nav.css'

export default function UserAccountNav() {
    
    const [user, setUser] = useState() 
    const [pageError, setPageError] = useState()

    useEffect(()=>{
        document.title = `WallFlour Bakehouse | Dashboard`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_4').classList.add('active')
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .get(url+'/user/userDP',{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=>{
                setUser(res.data.username)
            })
            .catch(()=>{
                setPageError(true)
            })
        }catch(error){
            setPageError(true)
        }
    }, [])

    function logout(){
        localStorage.clear()
        window.location.replace("/")
    }

    if(pageError){
        return(<Error login={true} />)
    }
    else if(user){
        return (
            <div className="user_dashboard container">
                <div className="heading_sec">
                    <div className="heading">Howdy {user}!</div>
                    <div className="logout_btn" onClick={logout}>Logout</div>
                </div>
                <div className="subheading">User Dashboard</div>
                <div className="row mb-5">
                    <div className="col-6 col-md-4 col-lg-4 d-flex justify-content-center">
                        <Link to="/user/orders" className="acc_box orders">
                            <div className="img"><FontAwesomeIcon icon={faTruckFast} /></div>
                            <div className="heading">Orders</div>
                        </Link>                        
                    </div>
                    <div className="col-6 col-md-4 col-lg-4 d-flex justify-content-center">
                        <Link to="/user/favourites" className="acc_box address">
                            <div className="img"><FontAwesomeIcon icon={faHeart} /></div>
                            <div className="heading">Favourites</div>    
                        </Link>                        
                    </div>
                    {/* <div className="col-6 col-md-4 col-lg-4 d-flex justify-content-center">
                        <Link to="/user/coupons" className="acc_box address">
                            <div className="img"><FontAwesomeIcon icon={faTicket} /></div>
                            <div className="heading">Your Coupons</div>    
                        </Link>                        
                    </div> */}
                    <div className="col-6 col-md-4 col-lg-4 d-flex justify-content-center">
                        <Link to="/user/account" className="acc_box account">
                            <div className="img"><FontAwesomeIcon icon={faUserLock} /></div>
                            <div className="heading">Login & Security</div>    
                        </Link>                        
                    </div>
                    <div className="col-6 col-md-4 col-lg-4 d-flex justify-content-center">
                        <Link to="/user/address" className="acc_box address">
                            <div className="img"><FontAwesomeIcon icon={faMapLocationDot} /></div>
                            <div className="heading">Address</div>    
                        </Link>                        
                    </div>
                    <div className="col-6 col-md-4 col-lg-4 d-flex justify-content-center">
                        <Link to="/user/comments" className="acc_box address">
                            <div className="img"><FontAwesomeIcon icon={faCommentDots} /></div>
                            <div className="heading">Comments</div>    
                        </Link>                        
                    </div>
                    <div className="col-6 col-md-4 col-lg-4 d-flex justify-content-center">
                        <Link to="/user/chat"  target="_blank" className="acc_box chat">
                            <div className="img"><FontAwesomeIcon icon={faMessage} /></div>
                            <div className="heading">Chat</div>    
                        </Link>                       
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(<CircleLoader/>)
    }
}
