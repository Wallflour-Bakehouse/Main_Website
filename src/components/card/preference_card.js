import React, { useState, useEffect } from 'react'
import CircleLoader from '../loader/circle_loader'
import './preference_card.css'


export default function PreferenceCard({preferences, userPreferences, setUserPreferences, calc}) {

    const [calculation, setCalculation] = useState()

    useEffect(() => {
        if(calc){
            for(let i=0;i<userPreferences.length;i++){
                for(let j=0;j<preferences.length;j++){
                    if(preferences[j].preferenceName===userPreferences[i]){
                        preferences[j].active=true
                    }
                }
            }
        }
        setCalculation(true)
    }, [])
    
    function active(preferences){
        const pref = document.getElementById(preferences._id).classList

        if(pref.contains('active')){
            setUserPreferences(userPreferences.filter((preference)=>{
                return preference!==preferences.preferenceName
            }))
        }
        else{
            setUserPreferences(userPreferences => [...userPreferences, preferences.preferenceName])
        }
        pref.toggle('active')
    }


    if(preferences&&calculation){
        return preferences.map((preference) =>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mt-4 d-flex justify-content-center">
                <div className={"pref_card" + (preference.active ? " active" : "")} style={{backgroundImage: `url(${preference.image})`}} id={preference._id} key={preference._id} onClick={()=>active(preference)}>
                    <div className="overlay">
                        {preference.preferenceName}
                    </div>
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
