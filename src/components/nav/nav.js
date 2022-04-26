import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {url} from '../../url'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser, faListUl, faAt, faHouseChimney, faMessage, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import './nav.css'

function Loginopt({user, token}){

    function logout(){
        localStorage.clear()
        window.location.replace("/")
    }

    if(token!==""){
        return(
            <div className="opt">
                <Link to="/cart" className='cart_btn'><FontAwesomeIcon icon={faCartShopping} /></Link>
                <div className='user_sec'>
                    <Link to="/user/dashboard" className='user_symbol'>
                        <div className="dp_img" style={{backgroundImage: 'url('+user+')'}}></div>
                    </Link>
                    <div className="dropdown">
                        <Link to="/user/dashboard" className="option">Your Account</Link>
                        <Link to="/user/orders" className="option">Your Orders</Link>
                        <div className="option" onClick={logout}>Logout</div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className="opt logout">
                <Link to="/login"><div className="nav_btn1">Log in</div></Link>
                <Link to="/signup"><div className="nav_btn2">Sign up</div></Link>
            </div>
        )
    }
}

export default function Nav(props) {

    const [user, setUser] = useState() 
    const [unreadMessage, setUnreadMessage] = useState() 
    const [token, setToken] = useState(localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).token : "")

    useEffect(() => {
        try{
            axios
            .get(url+'/user/userDP',{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=>{
                setUser(res.data.dp)
            })
            axios
            .get(url+'/message/checkUserMessage',{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=>{
                setUnreadMessage(res.data)
            })
        }catch(error){
            console.log(error)
        }
    }, [])

    function messagesOpened(){
        setUnreadMessage(false)
    }

    function activeMobLink(id){
        let nodeList = document.querySelectorAll(".mob_list")
        nodeList.forEach((item)=>
            item.classList.remove('active'))
        document.getElementById(id).classList.add('active')
    }

    return (
        <div className={props.chatScreen ? "disable":""}>
            <div className="nav">
                <Link to="/"><div className="logo"></div></Link>
                <div className="nav_search">
                    <input type="text" placeholder="Search for a dish" name="search" />
                    <div className="search_btn">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />    
                    </div>
                </div>
                <div className="navitems">
                    <Link to="/"><div className="navele">Home <FontAwesomeIcon icon={faHouseChimney} /></div></Link>
                    <Link to="/menu"><div className="navele">Menu <FontAwesomeIcon icon={faListUl} /></div></Link>
                    {token!=="" ? (
                        <Link to="/user/chat" target="_blank">
                            <div className="navele" onClick={messagesOpened}>
                                <>Chat</>
                                <div className="chat_img">
                                    <FontAwesomeIcon icon={faMessage} />
                                    {unreadMessage ? (<div className="unread_message_alert"></div>):(<></>)}
                                </div>
                            </div>
                        </Link>
                    ):(
                        <Link to="/contact"><div className="navele">Contact Us <FontAwesomeIcon icon={faAt} /></div></Link>
                    )}
                </div>
                <div className="nav_sec">
                    <Loginopt user={user} token={token} />
                </div>
            </div>
            <div className="mob_nav">
                <ul>
                    <li className='mob_list' id="mob_1" onClick={()=>activeMobLink("mob_1")}>
                        <Link to="/">
                            <span className="icon">
                                <FontAwesomeIcon icon={faHouseChimney} />
                            </span>
                            <span className="text">Home</span>
                        </Link>
                    </li>
                    <li className='mob_list' id="mob_2" onClick={()=>activeMobLink("mob_2")}>
                        <Link to="/cart">
                            <span className="icon">
                                <FontAwesomeIcon icon={faCartShopping} />
                            </span>
                            <span className="text">Cart</span>
                        </Link>
                    </li>
                    <li className='mob_list' id="mob_3" onClick={()=>activeMobLink("mob_3")}>
                        <Link to="/menu">
                            <span className="icon">
                                <FontAwesomeIcon icon={faListUl} />
                            </span>
                            <span className="text">Menu</span>
                        </Link>
                    </li>
                    <li className={'mob_list'+(token ? " dp":" ") } id="mob_4" onClick={()=>activeMobLink("mob_4")}>
                        {token!=="" ? (
                            <Link to="/user/dashboard">
                                <span className="icon">
                                    <div className="dp_img" style={{backgroundImage: 'url('+user+')'}}></div>
                                </span>
                                <span className="text">Account</span>
                            </Link>
                        ):(
                            <Link to="/login">
                                <span className="icon">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                <span className="text">{props.loginOrSignupText}</span>
                            </Link>
                        )}
                    </li>
                    <li className='mob_list' id="mob_5">
                        {token ? (
                            <Link to="/user/chat" target="_blank" onClick={messagesOpened}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faMessage} />
                                    {unreadMessage ? (<div className="unread_message_alert"></div>):(<></>)}
                                </span>
                                <span className="text">Chat</span>
                            </Link>
                        ):(
                            <Link to="/contact">
                                <span className="icon">
                                    <FontAwesomeIcon icon={faAt} />
                                </span>
                                <span className="text">Contact</span>
                            </Link>
                        )}
                    </li>
                    <div className="indicator"></div>
                </ul>
            </div>
        </div>
    )
}
