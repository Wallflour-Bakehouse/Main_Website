import React from 'react'
import './loader.css'

export default function Loader() {
    return (
        <div className="loader_cont">
            <div className="pan-loader">
                <div className="loader"></div>
                <div className="pan-container">
                    <div className="pan"></div>
                    <div className="handle"></div>
                </div>
                <div className="shadow"></div>
            </div>
            <div className="text">Some Text....</div>
        </div>
    )
}
