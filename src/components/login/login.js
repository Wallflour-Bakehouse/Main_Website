import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { url } from '../../url'
import { Link } from 'react-router-dom'
import './login.css'
import './backgroundAnimation.css'


export default function Login() {

    const [formData, setFormData] = useState({
        'username': "",
        'password': "",
    })

    const [errors, setErrors] = useState({ username: '', password: '', submit: '' })
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(()=>{
        document.title = `Wallflour Bakehouse | Login`
        window.scrollTo(0, 0)
    },[])

    function validateForm(){

        const usenamePattern = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
        
        const nodeList = document.querySelectorAll('.form_error')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        if(!usenamePattern.test(formData.username)){
            setErrors({...errors, username: 'Invalid Username' })
            document.getElementById('error_username').classList.add('active')
            return false
        }
        if(formData.password===''){
            setErrors({...errors, password: 'Enter Password' })
            document.getElementById('error_password').classList.add('active')
            return false
        }
        return true;
    }

    function handleSubmit() {
        try{
            let valid = validateForm()
            if(valid){
                axios
                .post(url+'/user/login', formData)
                .then((res)=>{
                    localStorage.setItem('profile', JSON.stringify(res.data))
                    window.location.replace('/home')
                })
                .catch(()=>{
                    setErrors({...errors, submit: 'Invalid Credentials' })
                    document.getElementById('error_submit').classList.add('active')
                })
            }
        }
        catch(error){
            console.log(error)
        }
    }


    return (
        <div className="login_cont">
            <div class="bubbles">
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
            </div>
            <div className="login">
                <div className="email">
                    <div className="form">
                        <input style={{color:'black'}} id="email" type="text" name="username" autoComplete="off" onChange={handleChange} required />
                        <label htmlFor="username" className="label-name">
                            <span className="content-name">Enter Your Username</span>
                        </label>                           
                    </div>
                    <div id="error_username" className='form_error'>{errors.username}</div>
                </div>
                <div className="password">
                    <div className="form">
                        <input style={{color:'black'}} id="pass" type="password" name="password" autoComplete="off" onChange={handleChange} required />
                        <label htmlFor="password" className="label-name">
                            <span className="content-name">Enter Password</span>
                        </label>                           
                    </div>
                    <div id="error_password" className='form_error'>{errors.password}</div>
                </div>
                <div className="submit" onClick={handleSubmit}>Login</div>
                <div id="error_submit" className='form_error'>{errors.submit}</div>
                <Link to="/signup"><div className="msg">Don't have an account? Create A New Account</div></Link>
            </div>
        </div>
    )
}