import React, { useEffect, useState } from 'react'
import Error from '../error/error';
import Card from '../card/card'
import axios from 'axios'
import Loader from '../loader/loader'
import {url} from '../../url'

import './menu.css'

export default function Menu() {

    const [products, setProducts] = useState()
    const [favourites, setfavourites] = useState()
    const [token, setToken] = useState(localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).token : "")
    const [pageError, setPageError] = useState()

    useEffect(() => {
        document.title = `Wallflour Bakehouse | Menu`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_3').classList.add('active')
        try{
            axios
            .get(url+'/product/')
            .then((res)=>{
                if(res.status===200)
                    setProducts(res.data.reverse())
            })
            .catch(()=>{
                setPageError(true)
            })
            if(token){
                axios
                .get(url+'/user/userFavourites',{
                    headers: {'authorization': `Bearer ${token}`}
                })
                .then((res)=>{
                    setfavourites(res.data)
                })
            }else{
                setfavourites(true)
            }
        } 
        catch(error){
            setPageError(true)
        }
    }, [])
    
    if(pageError){
        return(<Error login={false} />)
    }
    else if(products&&favourites){
        return (
            <div className="menu_cont container">
                <div className="heading mb-3">Menu</div>
                {products.map((prod)=>(
                    !prod.deleted ? (
                        prod.categoryProducts.length > 0 ? (
                            <div className="row section mb-5" key={prod._id}>
                                <div className="col-12">
                                    <div className="heading">{prod.categoryName}</div>
                                </div>
                                <Card categoryProducts={prod.categoryProducts} favourites={favourites} />    
                            </div>
                        ):(<></>)
                    ):(<></>)
                ))}
            </div>
        )
    }
    else{
        return(
            <Loader />
        )
    }
}
