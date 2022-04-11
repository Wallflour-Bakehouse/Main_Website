import React, { useState, useEffect } from 'react'
import Error from '../error/error';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './coupons.css'

export default function Coupons() {
    const [pageError, setPageError] = useState()

    useEffect(() => {
        document.title = `Wallflour Bakehouse | Coupons`
        window.scrollTo(0, 0)
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
        } 
        catch(error){
            setPageError(true)
        }
    }, [])
    if(pageError){
        return(<Error login={true} />)
    }
    else{
        return (
            <div className="coupons_cont container mb-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/user/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Your Coupons</li>
                    </ol>
                </nav>
                <div className="heading">Your Coupons</div>
                <div className="search_cont mb-5">
                    <input type="search" placeholder="Search For Your Coupon" name="search" />
                    <div className="search_btn">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />    
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="coupon">
                            <div className="inner_sec">
                                <div className="details coupon_code">Code: HBSKDFBKJB</div>
                                <div className="coupon_desc">Small Explaination about coupon</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
