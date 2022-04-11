import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {url} from '../../url'
import PreferenceCard from '../card/preference_card'
import Loader from '../loader/loader'
import { Link, Redirect } from 'react-router-dom'
import './preference.css'

export default function Preference() {

    const [preferences, setPreferences] = useState()
    const [userPreferences , setUserPreferences] = useState([])
    const [submitStatus, setSubmitStatus] = useState(false)
    const [pageError, setPageError] = useState()

    useEffect(() => {
        document.title = `Wallflour Bakehouse | Set Preference`
        window.scrollTo(0, 0)
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .get(url+'/preference/')
            .then((res)=>{
                if(res.status===200)
                    setPreferences(res.data)
            }).catch(()=>{
                setPageError(true)
            })
        } 
        catch(error){
            setPageError(true)
        }    
    }, [])

    
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
                setSubmitStatus(true)
            })
            .catch(()=>{
                setPageError(true)
            })
        }catch(error){
            setPageError(true)
        }
    }

    if(pageError){
        return(<Redirect to="/signup" />)
    }
    else if(preferences){
        return (
            <div className="preference_cont container mb-5">
                <div className="heading">
                    Choose Your Favourites
                </div>
                <div className="row mb-5">
                    <PreferenceCard preferences={preferences} userPreferences={userPreferences} setUserPreferences={setUserPreferences} calc={true}/>
                </div>
                <div className="row">
                    <div className="btn_cont">
                        { submitStatus ? (
                            <Link to="/menu" className="btn_">Continue</Link>
                            ) :(
                            <>
                                <div className="btn_" onClick={submitPreference}>Save</div>
                                <Link to="/menu" className="skip_btn">Skip</Link>
                            </>
                        )}
                    </div>                    
                </div>
            </div>   
        )
    }
    else{
        return( 
            <Loader/> 
        )
    }
}
