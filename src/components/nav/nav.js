import React, {useEffect, useState} from 'react'
import './nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser, faListUl, faAt, faHouseChimney, faMessage, faCartShopping } from '@fortawesome/free-solid-svg-icons'

import { Link } from 'react-router-dom'


function Loginopt({user}){

    function logout(){
        localStorage.clear()
        window.location.replace("/")
    }

    if(user){
        return(
            <div className="opt">
                <Link to="/cart" className='cart_btn'><FontAwesomeIcon icon={faCartShopping} /></Link>
                <div className='user_sec'>
                    <Link to="/user/dashboard" className='user_symbol'>
                        <div className="dp_img" style={{backgroundImage: 'url('+user.result.dp+')'}}></div>
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

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile'))) 

    useEffect(() => {
        if(localStorage.getItem('profile')){
            setUser(JSON.parse(localStorage.getItem('profile')))
        }
    }, [])

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
                    {user ? (
                        <Link to="/user/chat" target="_blank"><div className="navele">Chat <FontAwesomeIcon icon={faMessage} /></div></Link>
                    ):(
                        <Link to="/contact"><div className="navele">Contact Us <FontAwesomeIcon icon={faAt} /></div></Link>
                    )}
                </div>
                <div className="nav_sec">
                    <Loginopt user={user} />
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
                    <li className={'mob_list'+(user ? " dp":" ") } id="mob_4" onClick={()=>activeMobLink("mob_4")}>
                        {user ? (
                            <Link to="/user/dashboard">
                                <span className="icon">
                                    <div className="dp_img" style={{backgroundImage: 'url('+user.result.dp+')'}}></div>
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
                        {user ? (
                            <Link to="/user/chat" target="_blank">
                                <span className="icon">
                                    <FontAwesomeIcon icon={faMessage} />
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
