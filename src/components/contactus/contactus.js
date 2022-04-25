import React, { useState, useEffect } from 'react'
import CircleLoader from '../loader/circle_loader'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import { faYoutube, faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import {url} from '../../url'
import './contactus.css'
import { Redirect } from 'react-router-dom'

function Form(){

    const initialState = {
        name: '',
        email: '',
        countryCode: '',
        phoneNumber: '',
        message: '',
    }
    const [user, setUser] = useState()
    const [formData, setFormData] = useState(initialState)
    const [token, setToken] = useState(localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).token : "")
    const [errors, setErrors]= useState(initialState)
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    useEffect(() => {
        document.title = `Wallflour Bakehouse | Contact Us`
        window.scrollTo(0,0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_5').classList.add('active')
        window.scrollTo(0, 0)
        try{
            if(token){
                axios
                .get(url+'/user/userData',{
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res)=>{
                    setUser(res.data)
                    setFormData({
                        name: res.data.firstname+" "+res.data.lastname,
                        email: res.data.email,
                        countryCode: res.data.countryCode,
                        phoneNumber: res.data.phoneNumber,
                        message: ''
                    })
                })
            }else{
                setUser({username: ''})
            }
        } 
        catch(error){
            console.log(error)
        }
    }, [])

    function validateForm(){

        const countryPattern = /^\d{1,3}$/
        const phonePattern = /^\d{10}$/
        const emailPattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        
        const nodeList = document.querySelectorAll('.form_error')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        if(formData.name.length < 3){
            setErrors({...errors, name: 'Field Can Not Be Empty'})
            document.getElementById('error_name').classList.add('active')
            return false
        }
        if(!emailPattern.test(formData.email)){
            setErrors({...errors, email: 'Enter A Valid Email Address' })
            document.getElementById('error_email').classList.add('active')
            return false
        }
        if(!countryPattern.test(formData.countryCode)){
            setErrors({...errors, phoneNumber: 'Wrong Country Code'})
            document.getElementById('error_phoneNumber').classList.add('active')
            return false
        }
        if(!phonePattern.test(formData.phoneNumber)){
            setErrors({...errors, phoneNumber: 'Enter A Valid Phone Number' })
            document.getElementById('error_phoneNumber').classList.add('active')
            return false
        }
        if(formData.message.length < 5){
            setErrors({...errors, message: 'Message is too Short'})
            document.getElementById('error_message').classList.add('active')
            return false
        }
        return true;
    }

    function handleSubmit(stranger) {
        try{
            let valid = validateForm()
            if(!valid) return
            if(stranger){
                axios
                .post(url+'/message/strangerSendMessage', formData)
                .then(()=>{
                    setErrors({...errors, submit: 'Message Sent' })
                    document.getElementById('error_submit').classList.add('sent')
                })
                .catch(()=>{
                    setErrors({...errors, submit: 'Falied To Send Message' })
                    document.getElementById('error_submit').classList.add('error')
                })
            }else{
                axios
                .post(url+'/message/userSendMessage', {
                    message: formData.message
                },{
                    headers: {'authorization': `Bearer ${token}`}
                })
                .then(()=>{
                    setErrors({...errors, submit: 'Message Sent' })
                    document.getElementById('error_submit').classList.add('sent')
                })
                .catch(()=>{
                    setErrors({...errors, submit: 'Falied To Send Message' })
                    document.getElementById('error_submit').classList.add('error')
                })
            }
        }
        catch(error){
            console.log(error)
        }
    }

    if(user){
        if(user.username!==''){
            return(
                <Redirect to="/error" />
            )
        }else{
            return(
                <form className="form_cont" id="contact-form" method="post">
                    <div className="name field">
                        <div className="form">
                            <input style={{color:'black'}} type="text" id="n" name="name" value={formData.name} onChange={handleChange} />
                            <label htmlFor="name" className="label-name">
                                <span className="content-name">Full Name<span style={{color:'red'}}>*</span></span>
                            </label>                           
                        </div>
                        <div id="error_name" className='form_error'>{errors.name}</div>
                    </div>
                    <div className="email field">
                        <div className="form">
                            <input style={{color:'black'}} type="text" id="e" name="email" value={formData.email} onChange={handleChange} />
                            <label htmlFor="name" className="label-name">
                                <span className="content-name">Email<span style={{color:'red'}}>*</span></span>
                            </label>                           
                        </div>
                        <div id="error_email" className='form_error'>{errors.email}</div>
                    </div>
                    <div className="phone field">
                        <div className="form">
                            <input style={{color:'black'}} type="number" name="countryCode" value={formData.countryCode} onChange={handleChange} />
                            <label htmlFor="name" className="label-name">
                                <span className="content-name">Country Code<span style={{color:'red'}}>*</span></span>
                            </label>                           
                        </div>
                        <div className="form">
                            <input style={{color:'black'}} type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                            <label htmlFor="name" className="label-name">
                                <span className="content-name">Phone Number<span style={{color:'red'}}>*</span></span>
                            </label>                           
                        </div>
                        <div id="error_phoneNumber" className='form_error'>{errors.phoneNumber}</div>
                    </div>
                    <div className="notes field">
                        <p className="heading">Message</p>
                        <textarea name="message" placeholder="Enter Your Message Here" onChange={handleChange} required></textarea>
                        <div id="error_message" className='form_error'>{errors.message}</div>
                    </div>
                    <div className="submit" onClick={()=>handleSubmit(true)}>Send Message</div>
                    <div className="confirmation" id="error_submit">{errors.submit}</div>
                </form>
            )
        }
    }else{
        return(
            <CircleLoader/>
        )
    }
}
export default function Contact() {
    return (
        <div className="container-fluid contact_cont mb-5">
            <div className="heading">Get In Touch With Us</div>
            <div className="row">
                <div className="col-12 col-lg-6 section1">
                    <Form/>
                </div>
                <div className="col-12 col-lg-6 section2 mt-3 mt-md-5 mt-lg-0">
                    <div className="section2_cont">
                        <div className="heading">
                            <p className="big">You can also reach us by:</p>
                        </div>
                        <div className="contact_us">
                            <div className="reach phone"><FontAwesomeIcon icon={faPhone} /> <a href="tel:+919740096628">+91 9740096628</a></div>
                            <div className="reach email"><FontAwesomeIcon icon={faEnvelope} /> <a href="mailto:wallflourbakehouse@gmail.com" target="_blank">wallflourbakehouse@gmail.com</a></div>
                            <div className="reach address"><FontAwesomeIcon icon={faLocationArrow} /> <a href="https://goo.gl/maps/8hp7DEGMuDjvznqn9" target="_blank">Satya Greens Apartment, Kodigehalli, Thindlu, Bangalore 560097</a></div>
                        </div>
                        <div className="social">
                            <div className="socialcontainer">
                                <div className="social-icons">
                                    <a className="what" target="blank" href="https://wa.me/919740096628"><FontAwesomeIcon icon={faWhatsapp} /></a>
                                    <a className="insta" target="blank" href="https://www.instagram.com/wallflour_bakehouse/"><FontAwesomeIcon icon={faInstagram} /></a>
                                    <a className="fb" target="blank" href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                                    <a className="mail" target="blank" href="mailto:wallflourbakehouse@gmail.com"><FontAwesomeIcon icon={faEnvelope} /></a>
                                    <a className="yt" target="blank" href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
