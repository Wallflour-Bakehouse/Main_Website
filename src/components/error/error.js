import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import './error.css'

export default function Error(props) {

    const [text, setText] = useState()
    const [imageSelector, setImageSelector] = useState(-1)
    const [image, setImage] = useState([
        {
            name: 'MAX',
            image: 'https://www.boredpanda.com/blog/wp-content/org_uploads/2014/06/cute-dog.jpg',
        },
        {
            name: 'KOBE',
            image: 'https://content.fortune.com/wp-content/uploads/2016/05/playdate_dog.png',
        },
        {
            name: 'OSCAR',
            image: 'https://i.pinimg.com/564x/ff/f9/89/fff989c7d15722c500950b7a65a089d4.jpg',
        },
        {
            name: 'CHARLIE',
            image: 'https://www.rover.com/blog/wp-content/uploads/2019/09/GermanShepherdDog-min-1.jpg',
        },
        {
            name: 'COOPER',
            image: 'https://img.freepik.com/free-photo/newfoundland-dog-plays-with-man-woman-park_179755-7115.jpg',
        },
        {
            name: 'DUKE',
            image: 'https://a-love-of-rottweilers.com/wp-content/uploads/2021/07/Breed-Std-@canilalfgar-816x1024.jpg',
        },
        {
            name: 'CHAMP',
            image: 'http://2.bp.blogspot.com/-QjhexW_39uA/T_5hEcynLjI/AAAAAAAAEC4/RJHvy6S8dKA/s1600/american_pitbull_terrier.jpg',
        },
        {
            name: 'VEDA',
            image: 'https://www.yourpurebredpuppy.com/dogbreeds/photos2-L/labrador-retriever-04.jpg',
        },
        {
            name: 'OLLIE',
            image: 'https://www.ctvsh.com/sites/default/files/styles/large/public/golden-retriever-dog-breed-info.jpg?itok=KV7Ojj-C',
        },
        {
            name: 'BOOMER',
            image: 'https://wallpaperaccess.com/full/32048.jpg',
        }
    ])

    useEffect(() => {
        const position = Math.floor((Math.random() * 10))
        setImageSelector(position)
        if(props.login){
            setText("Please Login To Continue")
        }
        else{
            setText("Something Went Wrong")
        }
    }, [])
    

    if(imageSelector>=0){
        return (
            <div className="error_cont container mb-5">
                <div className="row">
                    <div className="col-12">
                        <div className="content mb-4">
                            <div className="heading">{text}</div>
                            {props.login ? (
                                <div className="text">Click here to <Link to="/login">Login</Link> or <Link to="/signup">Sign up</Link></div>
                            ):(
                                <div className="text">Go to our <Link to="/home">Homepage</Link> or <Link to="/menu">Menu</Link></div>
                            )}
                        </div>
                        <div className="image_cont">
                            <div className="img" style={{backgroundImage:`url(${image[imageSelector].image})`}}>
                                <div className="text">Say Hi to {image[imageSelector].name} 👋 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(<></>)
    }
}
