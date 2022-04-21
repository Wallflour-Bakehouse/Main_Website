import React, { useState, useEffect } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import 'pure-react-carousel/dist/react-carousel.es.css';
import './carousel.css'

function Advertisements({ads}){
    
    return ads.map(ad=>
        <Slide index={ad.index} key={ad.id}>
            <div className="ad_img" style={{backgroundImage: "url("+ad.img+")"}}></div>
        </Slide>
    )
}

export default function Carousel() {
    const ads = [
        {   
            id: "0",
            name: "Advertisement1",
            img: "https://img.atlasobscura.com/NaJTl4Z-HMnIT7RwZ6j1VzfPYH3hO8J-ip7BrM0aChI/rs:fill:12000:12000/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL2Fzc2V0/cy9iNzRiMTI0NS02/NzIwLTRlOTgtYWNj/NS1mY2FmZGFjNTM5/ZmI4MDAxYjE2N2E4/NmQxYjc4NTFfNDI4/NDE5OTg3MzBfNDI5/NDA0YTYwN19rLmpw/Zw.jpg",
        },
        {
            id: "1",
            name: "Advertisement2",
            img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: "2",
            name: "Advertisement3",
            img: "https://dupont.scene7.com/is/image/Dupont/bakery_hero_new"
        }
    ]

    const [sliderHeight, setSliderHeight] = useState()
    useEffect(() => {
        const windowWidth = window.innerWidth 
        if(windowWidth>1300){
            setSliderHeight(30)
        }
        else if(windowWidth>900){
            setSliderHeight(40)
        }
        else if(windowWidth>600){
            setSliderHeight(50)
        }
        else{
            setSliderHeight(60)
        }
    }, [])
    

    return (
    <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={sliderHeight}
        totalSlides={ads.length}>
        <Slider>
            <Advertisements ads={ads} />
        </Slider>
        <ButtonBack><FontAwesomeIcon icon={faArrowLeft} /></ButtonBack>
        <ButtonNext><FontAwesomeIcon icon={faArrowRight} /></ButtonNext>
    </CarouselProvider>
    );
}