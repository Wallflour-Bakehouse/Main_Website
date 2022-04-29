import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import './orderConfirm.css'

export default function OrderConfirm() {

    return (
        <div className="order_confirm_cont">
            <div className="pyro">
                <div className="before"></div>
                <div className="after"></div>
            </div>
            <div className="order_confirm pb-4">
                <div className="image">
                    <FontAwesomeIcon icon={faCheck} />
                </div>
                <div className="big_heading mb-3">Awsome!</div>
                <div className="heading  mb-2">Order Placed Successfully!</div>
                <Link to="user/orders" className="text mb-3">Click Here To View Orders</Link>
                <div className="sub_text mb-2">Payment link will be available after order is accepted.</div>
            </div>
        </div>
    )
}
