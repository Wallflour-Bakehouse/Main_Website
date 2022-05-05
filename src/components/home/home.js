import React, { useState, useEffect } from 'react'
import Carousel from '../carousel/carousel'
import Card from '../card/card'
import Error from '../error/error';
import CircleLoader from '../loader/circle_loader'
import axios from 'axios'
import {url} from '../../url'
import './home.css'

export default function Home() {

    const [token, setToken] = useState(localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).token : "")
    const [favourites, setfavourites] = useState()
    const [homeData, setHomeDate] = useState([])
    const [pageError, setPageError] = useState()


    useEffect(()=>{
        document.title = `Wallflour Bakehouse | Home`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_1').classList.add('active')
        try{
            if(token){
                axios
                .get(url+'/user/userFavourites',{
                    headers: {'authorization': `Bearer ${token}`}
                })
                .then((res)=>{
                    setfavourites(res.data)
                })
                .catch(()=>{
                    setPageError(true)
                })
            }
            else{
                setfavourites(true)
            }
            axios
            .get(url+'/product/getHomeProducts')
            .then((res)=>{
                setHomeDate(res.data)
            })
            .catch(()=>{
                setPageError(true)
            })
        }
        catch(error){
            setPageError(true)
        }
    },[])

    if(pageError){
        return(<Error login={false} />)
    }
    else{
        return (
            <div className="homepage">
                <Carousel/>
                <div className="section section2 container-fluid">
                    <div className="row flex-md-row-reverse">
                        <div className="image col-12 col-lg-6"></div>    
                        <div className="content col-12 col-lg-6">
                            <div className="heading">About Us</div>
                            <div className="desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat eius velit voluptatum reprehenderit error voluptate vero sequi quaerat sint, optio vel modi architecto veritatis ipsa sit quo. Dolorem, ratione esse!
                            Mollitia consequuntur atque vel facere aliquam, et, debitis impedit ipsa nulla tempora laboriosam? Nulla dolorum eveniet omnis odit suscipit maiores, quo repellendus molestiae in, assumenda ut consequuntur! Unde, impedit aspernatur.</div>
                        </div>
                    </div>
                </div>
                <div className="section section3">
                    <div className="heading">New Products</div>  
                    <div className="card_section container mt-3">
                        <div className="row">
                            {homeData.newProducts&&favourites ? (
                                <Card categoryProducts={homeData.newProducts} favourites={favourites}  reload={true} />    
                            ):(
                                <CircleLoader />
                            )}
                        </div>
                    </div>  
                </div>
                <div className="section section4">
                    <div className="heading">Top Selling</div>  
                    <div className="card_section container mt-3">
                        <div className="row">
                        {homeData.topSelling&&favourites ? (
                                <Card categoryProducts={homeData.topSelling} favourites={favourites}  reload={true} />    
                            ):(
                                <CircleLoader />
                            )}
                        </div>
                    </div>  
                </div>
                <div className="section section5">
                    <div className="heading">Top Rated</div>  
                    <div className="card_section container mt-3">
                        <div className="row">
                        {homeData.topRated&&favourites ? (
                                <Card categoryProducts={homeData.topRated} favourites={favourites}  reload={true} />    
                            ):(
                                <CircleLoader />
                            )}
                        </div>
                    </div>  
                </div>
                {/* {homeData.recommendation&&favourites ? (
                    <div className="section section5">
                        <div className="heading">Recommended For You</div>  
                        <div className="card_section container mt-3">
                            <div className="row">
                                
                            </div>
                        </div>  
                    </div>
                ):(<></>)}
                {homeData.prevOrdered&&favourites ? (
                    <div className="section section6">
                        <div className="heading">Previously Ordered</div>  
                        <div className="card_section container mt-3">
                            <div className="row">
                                
                            </div>
                        </div>  
                    </div>
                ):(<></>)}*/}
            </div>  
        )
    }
}
