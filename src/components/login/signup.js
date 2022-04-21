import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import {url} from '../../url'
import './signup.css'
import './backgroundAnimation.css'

const initialState = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    rePassword: '',
    countryCode: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    billingAddress: '',
    landmark: '',
    city: '',
    pincode: '',
    state: ''
}
export default function SignUp(props) {

    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors]= useState(initialState)

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(()=>{
        props.setLoginOrSignupText("Signup")
        document.title = `Wallflour Bakehouse | Signup`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_4').classList.add('active')
    },[])

    function validateForm(){

        const usernamePattern = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
        const countryPattern = /^\d{1,3}$/
        const phonePattern = /^\d{10}$/
        const emailPattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        const signup = document.querySelector('.signup').classList
        signup.remove('error')
        const nodeList = document.querySelectorAll('.form_error')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        if(formData.firstname.length < 3){
            setErrors({...errors, firstname: 'Name Should Be Greater Than or Equal To 3 Charecters'})
            document.getElementById('error_firstname').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.lastname.length < 3){
            setErrors({...errors, lastname: 'Field Can Not Be Empty'})
            document.getElementById('error_lastname').classList.add('active')
            signup.add('error')
            return false
        }
        if(!usernamePattern.test(formData.username)){
            setErrors({...errors, username: 'Invalid Username' })
            document.getElementById('error_username').classList.add('active')
            signup.add('error')
            return false
        }
        if(!emailPattern.test(formData.email)){
            setErrors({...errors, email: 'Enter A Valid Email Address' })
            document.getElementById('error_email').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.password===''){
            setErrors({...errors, password: 'Enter Password' })
            document.getElementById('error_password').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.password.length<6){
            setErrors({...errors, password: 'Password Should Be Greater Than 5 Charecters' })
            document.getElementById('error_password').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.rePassword===''){
            setErrors({...errors, rePassword: 'Re Enter The New Password'})
            document.getElementById('error_rePassword').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.rePassword!==formData.password){
            setErrors({...errors, rePassword: 'Password Does Not Match'})
            document.getElementById('error_rePassword').classList.add('active')
            signup.add('error')
            return false
        }
        if(!countryPattern.test(formData.countryCode)){
            setErrors({...errors, countryCode: 'Wrong Country Code'})
            document.getElementById('error_countryCode').classList.add('active')
            signup.add('error')
            return false
        }
        if(!phonePattern.test(formData.phoneNumber)){
            setErrors({...errors, phoneNumber: 'Enter A Valid Phone Number' })
            document.getElementById('error_phoneNumber').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.gender!=='Male'&&formData.gender!=='Female'&&formData.gender!=='Secret'){
            setErrors({...errors, gender: 'Please Select An Option' })
            document.getElementById('error_gender').classList.add('active')
            signup.add('error')
            return false
        }
        if(!formData.dob){
            setErrors({...errors, dob: 'Incorrect Date of Birth' })
            document.getElementById('error_dob').classList.add('active')
            signup.add('error')
            return false
        }
        let difference=moment().diff(moment(formData.dob), 'years')
        if(difference<4 || difference>140){
            setErrors({...errors, dob: 'Incorrect Date of Birth' })
            document.getElementById('error_dob').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.billingAddress.length===0){
            setErrors({...errors, billingAddress: 'Address can not be empty' })
            document.getElementById('error_billingAddress').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.landmark.length===0){
            setErrors({...errors, landmark: 'Landmark can not be empty' })
            document.getElementById('error_landmark').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.city.length===0){
            setErrors({...errors, city: 'Enter Your City' })
            document.getElementById('error_city').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.pincode.length===0){
            setErrors({...errors, pincode: 'Invalid Pincode' })
            document.getElementById('error_pincode').classList.add('active')
            signup.add('error')
            return false
        }
        if(formData.state.length===0){
            setErrors({...errors, state: 'Enter Your State' })
            document.getElementById('error_state').classList.add('active')
            signup.add('error')
            return false
        }

        return true;
    }

    const handleSubmit = () => {
        try{
            let valid = validateForm()
            if(valid){
                axios
                .post(url+'/user/signup', formData)
                .then((res)=>{
                    localStorage.setItem('profile', JSON.stringify(res.data))
                    window.location.href='/signup/preference'
                })
                .catch((error)=>{
                    setErrors({...errors, submit: error.response.data.message })
                    document.getElementById('error_submit').classList.add('active')
                    document.querySelector('.signup').classList.add('error')
                })
            }
        }
        catch(error){
            console.log(error)
        }
    }
    
    return (
        <div className="signup_cont">
            <div className="bubbles">
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
            </div>
            <div className="signup container-fluid">
                <div className="heading">Welcome To Wallflour Bakehouse</div>
                <div className="subheading">Create An Account</div>
                <div className="row">
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" className="firstname" name="firstname" onChange={handleChange} required />
                            <label htmlFor="firstname" className="label-name L_firstname">
                                <span className="content-name"> First Name</span>
                            </label>                           
                        </div>
                        <div id="error_firstname" className='form_error'>{errors.firstname}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" className="lastname" name="lastname" onChange={handleChange} required />
                            <label htmlFor="lastname" className="label-name L_lastname">
                                <span className="content-name"> Last Name</span>
                            </label>                           
                        </div>
                        <div id="error_lastname" className='form_error'>{errors.lastname}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" className="username" name="username" onChange={handleChange} required />
                            <label htmlFor="username" className="label-name L_username">
                                <span className="content-name">New Username</span>
                            </label>                           
                        </div>
                        <div id="error_username" className='form_error'>{errors.username}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" className="email" name="email" onChange={handleChange} required />
                            <label htmlFor="email" className="label-name L_email">
                                <span className="content-name"> Email Address</span>
                            </label>                           
                        </div>
                        <div id="error_email" className='form_error'>{errors.email}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="password" className="pass" name="password" onChange={handleChange} required />
                            <label htmlFor="password" className="label-name password">
                                <span className="content-name">Password</span>
                            </label>                           
                        </div>
                        <div id="error_password" className='form_error'>{errors.password}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="password" className="rePassword" name="rePassword" onChange={handleChange} required />
                            <label htmlFor="rePassword" className="label-name rePassword">
                                <span className="content-name">Re-Enter Password</span>
                            </label>                           
                        </div>
                        <div id="error_rePassword" className='form_error'>{errors.rePassword}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="number" className="countryCode" name="countryCode" onChange={handleChange} required />
                            <label htmlFor="countryCode" className="label-name countryCode">
                                <span className="content-name">Country Code</span>
                            </label>                           
                        </div>
                        <div id="error_countryCode" className='form_error'>{errors.countryCode}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="number" className="phoneNumber" name="phoneNumber" onChange={handleChange} required />
                            <label htmlFor="phoneNumber" className="label-name phoneNumber">
                                <span className="content-name">Phone Number</span>
                            </label>                           
                        </div>
                        <div id="error_phoneNumber" className='form_error'>{errors.phoneNumber}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div style={{marginBlock: "5px", fontSize: "18px", fontWeight:"500"}}>Gender</div>
                        <div className='d-flex justify-content-around align-items-center'>
                            <div>
                                <input type="radio" id="male" name="gender" value="Male" onChange={handleChange}/>
                                <label htmlFor="male" className='ms-2'>Male</label>
                            </div>
                            <div>
                                <input type="radio" id="female" name="gender" value="Female" onChange={handleChange}/>
                                <label htmlFor="female" className='ms-2'>Female</label>
                            </div>
                            <div>
                                <input type="radio" id="secret" name="gender" value="Secret" onChange={handleChange}/>
                                <label htmlFor="secret" className='ms-2'>Rather not say</label>
                            </div>
                        </div>
                        <div id="error_gender" className='form_error'>{errors.gender}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="date" className="dob" name="dob" required onChange={handleChange} />
                            <label htmlFor="dob" className="label-name dob">
                                <span className="content-name">Your Birthday</span>
                            </label>                           
                        </div>
                        <div id="error_dob" className='form_error'>{errors.dob}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="notes">
                        <h5 style={{margin: "20px 0"}}>Billing Address</h5>
                        <textarea id="t" name="billingAddress" placeholder="Address" className="address" onChange={handleChange} required></textarea>
                        <div id="error_billingAddress" className='form_error'>{errors.billingAddress}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" name="landmark" className="landmark" onChange={handleChange} required />
                            <label htmlFor="landmark" className="label-name landmark">
                                <span className="content-name">Address Landmark</span>
                            </label>                           
                        </div>
                        <div id="error_landmark" className='form_error'>{errors.landmark}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" name="city" className="city" onChange={handleChange} required />
                            <label htmlFor="city" className="label-name city">
                                <span className="content-name">City</span>
                            </label>                           
                        </div>
                        <div id="error_city" className='form_error'>{errors.city}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" name="pincode" className="pincode" onChange={handleChange} required />
                            <label htmlFor="pincode" className="label-name pincode">
                                <span className="content-name">Pincode</span>
                            </label>                           
                        </div>
                        <div id="error_pincode" className='form_error'>{errors.pincode}</div>
                    </div>
                    <div className="col-12 col-md-6 mb-1">
                        <div className="form">
                            <input style={{color:'black'}} type="text" name="state" className="state" onChange={handleChange} required />
                            <label htmlFor="state" className="label-name state">
                                <span className="content-name">State</span>
                            </label>                           
                        </div>
                        <div id="error_state" className='form_error'>{errors.state}</div>
                    </div>
                </div>
                <div className='d-flex flex-column align-items-center mt-5'>
                    <div onClick={handleSubmit} className="submit">Next</div>
                    <div id="error_submit" className='form_error'>{errors.submit}</div>
                    <Link to="/login"><div className="msg">Already have an account? Login</div></Link>
                </div>
            </div>
        </div>
    )
}
