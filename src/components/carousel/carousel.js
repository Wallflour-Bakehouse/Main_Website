import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import 'pure-react-carousel/dist/react-carousel.es.css';
import './carousel.css'

function Advertisements({ads}){
    
    return ads.map(ad=>
        <Slide index={ad.index} key={ad.id}>
            <img src={ad.img} alt={ad.name} />
        </Slide>
    )
}

export default function Carousel() {
    var ads = [
        {   
            id: "0",
            name: "Advertisement1",
            // img: "https://image.shutterstock.com/image-vector/delicious-hamburger-fries-banner-ads-600w-1203026587.jpg"
            img: "",
        },
        {
            id: "1",
            name: "Advertisement2",
            // img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            img: "",
        },
        {
            id: "2",
            name: "Advertisement3",
            img: "something3"
        }
    ]

    return (
    <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={30}
        totalSlides={3}>
        <Slider>
            <Advertisements ads={ads} />
        </Slider>
        <ButtonBack><FontAwesomeIcon icon={faArrowLeft} /></ButtonBack>
        <ButtonNext><FontAwesomeIcon icon={faArrowRight} /></ButtonNext>
    </CarouselProvider>
    );
}