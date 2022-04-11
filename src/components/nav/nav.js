import React, {useEffect, useState} from 'react'
import './nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faMagnifyingGlass, faListUl, faAt, faHouseChimney } from '@fortawesome/free-solid-svg-icons'

import { Link, useLocation } from 'react-router-dom'


function Loginopt({user}){

    const [dp, setDp] = useState()
    useEffect(()=>{
        try{
            setDp(JSON.parse(localStorage.getItem('profile')).result.dp)
        } catch(error){
            
        }
    },[])

    function logout(){
        localStorage.clear()
        window.location.replace("/home")
    }

    if(user){
        return(
            <div className="opt">
                <Link to="/cart" className='cart_btn'><FontAwesomeIcon icon={faUtensils} /></Link>
                <div className='user_sec'>
                    <Link to="/user/dashboard" className='user_symbol'>
                        <div className="dp_img" style={{backgroundImage: 'url('+dp+')'}}></div>
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

export default function Nav() {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile'))) 
    const location = useLocation();

    useEffect(() => {
        if(localStorage.getItem('profile')){
            setUser(JSON.parse(localStorage.getItem('profile')))
        }
    }, [location])

    function toggleSideBar(){
        const menuBtn = document.querySelector('.menu-btn');
        if(menuBtn.classList.contains('open')) {
            menuBtn.classList.remove('open');
        }
        else {        
            menuBtn.classList.add('open');
        }
        document.querySelector('.sidebar').classList.toggle('slide');
        document.querySelector('.backdrop').classList.toggle('back');
    }

    function sideBarClose(){
        document.querySelector('.sidebar').classList.remove('slide');
        document.querySelector('.menu-btn').classList.remove('open');
        document.querySelector('.backdrop').classList.remove('back');
    }
    return (
        <div>
            <div className="nav">
                <Link to="/home"><div className="logo"></div></Link>
                <div className="nav_search">
                    <input type="text" placeholder="Search for a dish" name="search" />
                    <div className="search_btn">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />    
                    </div>
                </div>
                <div className="navitems">
                    <Link to="/home"><div className="navele">Home <FontAwesomeIcon icon={faHouseChimney} /></div></Link>
                    <Link to="/menu"><div className="navele">Menu <FontAwesomeIcon icon={faListUl} /></div></Link>
                    <Link to="/contact"><div className="navele">Contact Us <FontAwesomeIcon icon={faAt} /></div></Link>
                </div>
                <div className="nav_sec">
                    <Loginopt user={user} />
                </div>
                <div className="menu-btn" style={{transition: "all .5s ease-in-out"}} onClick={toggleSideBar}>
                    <div className="menu-btn_burger" style={{transition: "all .5s ease-in-out"}}></div>
                </div>
            </div>
            <div className="backdrop" onClick={sideBarClose}></div>
            <div className="sidebar">
                <div className="list">
                    <Link to="/home"><div className="listele">Home</div></Link>
                    <Link to="/about"><div className="listele">About Us</div></Link>
                    <Link to="/contact"><div className="listele">Contact Us</div></Link>
                    <Link to="/shop"><div className="listele no">Shop</div></Link>
                </div>
            </div>
        </div>
    )
}
