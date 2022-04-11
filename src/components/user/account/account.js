import React, { useState, useEffect } from 'react'
import Error from '../../error/error';
import moment from 'moment'
import axios from 'axios'
import CircleLoader from '../../loader/circle_loader'
import {url} from '../../../url'
import { Link, Redirect } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Col, FormFeedback, Modal, ModalBody, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTimes } from '@fortawesome/free-solid-svg-icons'
import './account.css'

function DpOptionCard({images, setUser, user}){

    function setDp(image){
        const nodeList = document.querySelectorAll('.dp_opt_card')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        document.getElementById(image._id).classList.add('active')
        setUser({...user, dp: image.dp})
        const token = JSON.parse(localStorage.getItem("profile")).token
        axios
        .put(url+'/user/setUserDp', {
            imageId: image._id,
        },{
            headers: { "authorization": `Bearer ${token}` }
        })
        .then(()=>{
            let profile = JSON.parse(localStorage.getItem('profile'))
            profile.result.dp=image.dp
            localStorage.setItem('profile', JSON.stringify(profile));
            window.location.reload()
        })
    }

    return images.map(image=>
        <div className="col-6 col-md-3 col-lg-2 mt-2" key={image._id}>
            <div className="dp_opt_card" id={image._id} onClick={()=>setDp(image)} style={{backgroundImage: 'url('+image.dp+')'}}></div>
        </div>
    )
}

function DpEdit(props){
    return(
        <Modal isOpen={props.modalVisible} toggle={props.toggleModal} size="lg">
            <ModalHeader><span>Change Display Picture</span> <span onClick={props.toggleModal} style={{cursor: "pointer"}}><FontAwesomeIcon icon={faTimes} /></span></ModalHeader>
            <ModalBody>
                <div className="container-fluid">
                    <div className="row">
                        <DpOptionCard images={props.images} user={props.user} setUser={props.setUser} />
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default function Account(props) {
    
    const [modalVisible, setModalVisible] = useState(false)
    const [user, setUser] = useState()
    const [dp, setDp] = useState()
    const [errors, setErrors] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        countryCode: '',
        phoneNumber: '',
        dob: ''
    })
    const [password, setPassword]=useState({password: '', newPassword: '', reNewPassword: ''})
    const [errorsPassword, setErrorsPassword] = useState({password: '', newPassword: '', reNewPassword: ''})
    const [pageError, setPageError] = useState()

    useEffect(() => {
        document.title = `WallFlour Bakehouse | Account`
        window.scrollTo(0, 0)
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .get(url+'/user/userData',{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=>{
                setUser(res.data)
            })
            .catch(()=>{
                setPageError(true)
            })
            axios
            .get(url+'/user/getAllDp')
            .then((res)=>{
                setDp(res.data)
            })
            .catch(()=>{
                setPageError(true)
            })
        } 
        catch(error){
            setPageError(true)
        }
    }, [])

    function handleInputChange(e){
        setUser({...user, [e.target.name]: e.target.value})
    }

    function handlePasswordInputChange(e){
        setPassword({...password, [e.target.name]: e.target.value})
    }

    function formSubmit(pass){
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            if(pass){
                let valid=validateForm()
                if(valid){
                    axios
                    .put(url+'/user/userDataUpdate', user, {
                        headers: { "authorization": `Bearer ${token}` }
                    })
                    .then(()=>{
                        props.triggerModal("Confirmation", "Your Details Have Been Updated")
                    })
                    .catch(()=>{
                        setErrors({...errors, username: 'Username Is Already In Use'})
                        document.getElementById('error_username').classList.add('active')
                    })
                }
            }
            else{
                let valid=validatePassword()
                if(valid){
                    axios
                    .put(url+'/user/userPasswordUpdate', password, {
                        headers: { "authorization": `Bearer ${token}` }
                    })
                    .then((res)=>{
                        props.triggerModal("Confirmation", "Your Password Have Been Updated")
                        setPassword({password: '', newPassword: '', reNewPassword: ''})
                    })
                    .catch((err)=>{
                        if(err.response.status===403){
                            setErrorsPassword({...errorsPassword, password: 'Incorrect Password'})
                            document.getElementById('error_password').classList.add('active')
                        }
                    })
                }
            }
        } catch(error) {
            console.log(error)
        }
    }
    function toggleModal(){
        setModalVisible(!modalVisible)
    }

    function validatePassword(){
        const nodeList = document.querySelectorAll('.form_error')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        if(password.password===''){
            setErrorsPassword({...errorsPassword, password: 'Enter Current Password'})
            document.getElementById('error_password').classList.add('active')
            return false
        }
        if(password.newPassword===''){
            setErrorsPassword({...errorsPassword, newPassword: 'Enter New Password'})
            document.getElementById('error_newPassword').classList.add('active')
            return false
        }
        if(password.newPassword.length<6){
            setErrorsPassword({...errorsPassword, newPassword: 'Password Should Be Greater Than 5 Charecters'})
            document.getElementById('error_newPassword').classList.add('active')
            return false
        }
        if(password.reNewPassword===''){
            setErrorsPassword({...errorsPassword, reNewPassword: 'Re Enter The New Password'})
            document.getElementById('error_reNewPassword').classList.add('active')
            return false
        }
        if(password.reNewPassword!==password.newPassword){
            setErrorsPassword({...errorsPassword, reNewPassword: 'Password Does Not Match'})
            document.getElementById('error_reNewPassword').classList.add('active')
            return false
        }
        return true;
    }

    function validateForm(){

        const usernamePattern = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
        const countryPattern = /^\d{1,3}$/
        const phonePattern = /^\d{10}$/
        const emailPattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        
        const nodeList = document.querySelectorAll('.form_error')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        if(user.firstname.length < 3){
            setErrors({...errors, firstname: 'Name Should Be Greater Than or Equal To 3 Charecters'})
            document.getElementById('error_firstname').classList.add('active')
            return false
        }
        if(user.lastname.length < 3){
            setErrors({...errors, lastname: 'Name Should Be Greater Than or Equal To 3 Charecters'})
            document.getElementById('error_lastname').classList.add('active')
            return false
        }
        if(!usernamePattern.test(user.username)){
            setErrors({...errors, username: 'Invalid Username' })
            document.getElementById('error_username').classList.add('active')
            return false
        }
        if(!emailPattern.test(user.email)){
            setErrors({...errors, email: 'Enter A Valid Email Address' })
            document.getElementById('error_email').classList.add('active')
            return false
        }
        if(!countryPattern.test(user.countryCode)){
            setErrors({...errors, countryCode: 'Wrong Country Code'})
            document.getElementById('error_countryCode').classList.add('active')
            return false
        }
        if(!phonePattern.test(user.phoneNumber)){
            setErrors({...errors, phoneNumber: 'Enter A Valid Phone Number' })
            document.getElementById('error_phoneNumber').classList.add('active')
            return false
        }
        let difference=moment().diff(moment(user.dob), 'years')
        if(difference<3 || difference>140){
            setErrors({...errors, dob: 'Incorrect Date of Birth' })
            document.getElementById('error_dob').classList.add('active')
            return false
        }
        return true;
    }

    if(pageError){
        return(<Error login={true} />)
    }
    else if(user&&dp){
        return (
            <div className="account_cont container mb-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/user/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Login and Security</li>
                    </ol>
                </nav>
                <div className="dp_cont">
                    <div className="dp" style={{backgroundImage: 'url('+user.dp+')'}} >
                        <div className="edit" onClick={()=>toggleModal()}><FontAwesomeIcon icon={faPenToSquare} /></div>
                    </div>
                </div>
                <DpEdit modalVisible={modalVisible} toggleModal={toggleModal} user={user} setUser={setUser} images={dp} />
                <div className="heading">Login Details</div>
                <div className="row">
                    <Form className='mt-4'>
                        <FormGroup row>
                            <Label htmlFor="firstname" lg={2}>First Name</Label>
                            <Col lg={10} >
                                <Input type="text" id="firstname" name="firstname" autoComplete="off" placeholder="First Name"  value={user.firstname} onChange={handleInputChange} />
                                <div id="error_firstname" className='form_error'>{errors.firstname}</div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="lastname" lg={2}>Last Name</Label>
                            <Col lg={10} >
                                <Input type="text" id="lastname" name="lastname" autoComplete="off" placeholder="Last Name" value={user.lastname} onChange={handleInputChange} />
                                <div id="error_lastname" className='form_error'>{errors.lastname}</div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="username" lg={2}>Username</Label>
                            <Col lg={10} >
                                <Input type="text" id="username" name="username" autoComplete="off" placeholder="Username" value={user.username} onChange={handleInputChange} />
                                <div id="error_username" className='form_error'>{errors.username}</div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="email" lg={2}>Email</Label>
                            <Col lg={10} >
                                <Input type="text" id="email" name="email" autoComplete="off" placeholder="Email" value={user.email} onChange={handleInputChange} />
                                <div id="error_email" className='form_error'>{errors.email}</div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="phone" lg={2}>Phone Number</Label>
                            <Col  lg={3} >
                                <Input type="input"  id="countrycode" name="countryCode" autoComplete="off" placeholder="Country Code" value={user.countryCode} onChange={handleInputChange} />
                                <div id="error_countryCode" className='form_error'>{errors.countryCode}</div>
                            </Col>
                            <Col  lg={7} >
                                <Input type="input"  id="phonenumber" name="phoneNumber" autoComplete="off" placeholder="Phone Number" value={user.phoneNumber} onChange={handleInputChange} />
                                <div id="error_phoneNumber" className='form_error'>{errors.phoneNumber}</div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="dob" lg={2}>Date of Birth</Label>
                            <Col lg={10} >
                                <Input type="date" id="dob" name="dob" autoComplete="off" placeholder="Date Of Birth" value={moment(user.dob).format("YYYY-MM-DD")} onChange={handleInputChange} />
                                <div id="error_dob" className='form_error'>{errors.dob}</div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col lg={12}>
                                <div className="btn_cont">
                                    <div className="btn_ mt-3" style={{paddingBlock: '7px'}} onClick={()=>formSubmit(true)}>Save</div>
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
                <div className="heading mt-4">Password Reset</div>
                <div className="row">
                    <Form className='mt-3'>
                        <FormGroup row>
                            <Label htmlFor="cpass" lg={2}>Current Password</Label>
                            <Col lg={10} >
                                <Input type="text" id="cpass" name="password" autoComplete="off" placeholder="Enter The Current Password" value={password.password} onChange={handlePasswordInputChange} />
                                <div id="error_password" className='form_error'>{errorsPassword.password}</div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="npass" lg={2}>New Password</Label>
                            <Col lg={10} >
                                <Input type="text" id="npass" name="newPassword" autoComplete="off" placeholder="Enter A New Password" value={password.newPassword} onChange={handlePasswordInputChange} />
                                <div id="error_newPassword" className='form_error'>{errorsPassword.newPassword}</div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="cpass" lg={2}>Re Enter New Password</Label>
                            <Col lg={10} >
                                <Input type="text" id="rpass" name="reNewPassword" autoComplete="off" placeholder="Re Enter The New Password" value={password.reNewPassword} onChange={handlePasswordInputChange} />
                                <div id="error_reNewPassword" className='form_error'>{errorsPassword.reNewPassword}</div>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <div className="btn_cont">
                                <div className="btn_ mt-3" onClick={()=>formSubmit(false)}>Save</div>
                            </div>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
    else{
        return <CircleLoader/>
    }
}
