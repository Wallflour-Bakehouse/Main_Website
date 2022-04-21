import React, {useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faWhatsapp, faFacebookF } from '@fortawesome/free-brands-svg-icons'
import './footer.css'

export default function Footer(props) {

    useEffect(() => {
        if(props.admin==="true"){
            document.querySelector('.footer').classList.add('true')
        }
    })

    return (
        <div className={"footer"+(props.chatScreen ? " disable" : " ")}>
            <div className="container-fluid" style={{maxWidth: "1800px"}}>
                <div className="row row1">
                    <div className="col-12 col-md-4 col-lg-4 section section1">
                        <div className="img"></div>
                    </div>
                    <div className="col-12 col-md-8 col-lg-4 mt-5 mt-md-0 section section2">
                        <div className="box">
                            <a target="_blank" className="address" href="https://goo.gl/maps/8hp7DEGMuDjvznqn9">
                                <FontAwesomeIcon icon={faLocationArrow} />
                                <span>Satya Greens Apartment, Kodigehalli, Thindlu, Bangalore 560097</span>
                            </a>
                            <a href="mailto:wallflourbakehouse@gmail.com" target="_blank" className="email"><FontAwesomeIcon icon={faEnvelope}/><span>wallflourbakehouse@gmail.com</span></a>
                            <a className="phone" href="tel:+919740096628"><FontAwesomeIcon icon={faPhone} /><span>+91 9740096628</span></a>
                            <div className="social-icons_footer">
                                <a className="wht" target="_blank" href="https://wa.me/919740096628"><FontAwesomeIcon icon={faWhatsapp} /></a>
                                <a className="insta" target="_blank" href="https://www.instagram.com/wallflour_bakehouse/"><FontAwesomeIcon icon={faInstagram} /></a>
                                <a className="fb" target="_blank" href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-4 mt-5 mt-lg-0 section section3">
                        <div className="heading">Location:</div>
                        <div className="loc_box">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11638.124119403417!2d77.56911595149313!3d13.069216010657001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae180ee7fdb4bd%3A0xaae0ebcb145fe8ba!2sSatya%20Green%20Apartment%2C%20Sir%20MV%20Layout%2C%20Tindlu%2C%20Sonappa%20Layout%2C%20Bengaluru%2C%20Karnataka%20560097!5e0!3m2!1sen!2sin!4v1650289862819!5m2!1sen!2sin" width="600" height="450" style={{border:"0"}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
                <div className="row row2">
                    <div className="col-12">
                        <div className="company_line"><div>Wallflour Bakehouse © 2022 Copyright</div><div>All Rights Reserved</div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
