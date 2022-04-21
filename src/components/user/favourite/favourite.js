import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Card from '../../card/card'
import Error from '../../error/error';
import PreferenceCard from '../../card/preference_card'
import Loader from '../../loader/loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import {url} from '../../../url'
import { Link } from 'react-router-dom'
import './favourite.css'


export default function Favourite() {

    const [favourites, setFavourites] = useState()
    const [preference, setPreference] = useState()
    const [userPreferences, setUserPreferences] = useState()
    const [favHelpText, setFavHelpText] = useState("Click To Add to Favourites")
    const [pageError, setPageError] = useState()

    useEffect(()=>{
        document.title = `WallFlour Bakehouse | Favourites`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_4').classList.add('active')
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .get(url+'/user/userFavourites',{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=>{
                if(res.status===200)
                    setFavourites(res.data)
            })
            .catch(()=>{
                setPageError(true)
            })
            axios
            .get(url+'/preference/')
            .then((res)=>{
                if(res.status===200)
                    setPreference(res.data)
            })
            .catch(()=>{
                setPageError(true)
            })
            axios
            .get(url+'/preference/user',{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=>{
                if(res.status===200)
                    setUserPreferences(res.data)
            })
            .catch(()=>{
                setPageError(true)
            })
        } 
        catch(error){
            setPageError(true)
        }
    },[])

    function highlightFav(){
        const favBtn = document.getElementById("fav").classList
        if(favBtn.contains("active")){
            setFavHelpText("Removed from Favourites")
        } else {
            setFavHelpText("Added to Favourites!")
        }
        favBtn.toggle('active')
    }

    function submitPreference(){
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .post(url+'/preference/addPreferenceToUser', {
                'preference': userPreferences,
            },{
                headers: { "authorization": `Bearer ${token}` }
            })
            .then((res)=>{
                window.location.reload()
            })
        }catch(error){
            console.log(error)
        }
    }
    
    if(pageError){
        return(<Error login={true} />)
    }
    else if(favourites&&preference&&userPreferences){
        return (
            <div className="fav_cont container mb-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/user/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Favourite Food</li>
                    </ol>
                </nav>
                <div className="heading">Favourite Food</div>
                <div className="row mb-5">
                    { favourites.length>0 ? (
                        <Card categoryProducts={favourites} favourites={favourites} />
                    ):(
                        <div className='no_favourites'>
                            <span>Add Dishes to favourites by clicking this button! </span>
                            <div className="like" id="fav" onClick={highlightFav}>
                                <FontAwesomeIcon icon={faHeart} />
                            </div>
                            <div className="text">{favHelpText}</div>
                        </div>
                    )}
                </div>
                <div className="heading">Favourite Categories</div>
                <div className="row">
                    <PreferenceCard preferences={preference} userPreferences={userPreferences} setUserPreferences={setUserPreferences} calc={true} />    
                </div>
                <div className="row">
                    <div className="btn_cont mt-5" onClick={submitPreference}>
                        <div className="btn_">Save</div>
                    </div>
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
