import React, { useState, useEffect} from 'react'
import Error from '../../error/error';
import axios from 'axios'
import CircleLoader from '../../loader/circle_loader';
import {url} from '../../../url'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Form, FormGroup, Label, Input, Col, FormFeedback } from "reactstrap";
import './user_address.css'

function AddressBox(props){

    function deleteAddress(id){
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token    
            axios
            .delete(url+'/user/deleteAddress/'+id,{
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res)=>{
                window.location.reload()
            })
        }
        catch(error){
            console.log(error)
        }
    }
    
    function editBillingAddress(address, countryCode, phoneNumber, name){
        props.setBillingAddressChange(true)
        props.editAddress({
            id: '',
            name: name,
            countryCode: countryCode,
            phoneNumber: phoneNumber,
            address: address.address,
            landmark: address.landmark,
            city: address.city,
            pincode: address.pincode,
            state: address.state
        })
    }

    function editShippingAddress(item){
        props.setBillingAddressChange(false)
        props.editAddress({
            id: item._id,
            name: item.name,
            countryCode: item.countryCode,
            phoneNumber: item.phoneNumber,
            address: item.address,
            landmark: item.landmark,
            city: item.city,
            pincode: item.pincode,
            state: item.state
        })
    }

    function addNewAddress(){
        props.editAddress({
            id:'',
            name: '',
            countryCode: '',
            phoneNumber: '',
            address: '',
            landmark: '',
            city: '',
            pincode: '',
            state: ''
        })
    }


    if(props.address){
        if(props.billingAddress){
            return (
                <div className="box box_add billing_add">
                    <div>
                        <div className='add_heading'>{props.name}</div>
                        <b>Phone:</b> +{props.countryCode} - {props.phoneNumber}
                        <p><b>Address: </b>{props.address.address}, {props.address.landmark}, {props.address.city} - {props.address.pincode}, {props.address.state}</p>
                    </div>
                    <a href="#add" className="edit" onClick={()=>editBillingAddress(props.address, props.countryCode, props.phoneNumber, props.name)}><FontAwesomeIcon icon={faPenToSquare} /></a>
                </div>
            )
        }
        else{
            if(props.address.length!==0){
                return(
                    <>
                        {props.address.map(item=>
                            <div className="box box_add" key={item._id}>
                                <div>
                                    <div className='add_heading'>{item.name}</div>
                                    <b>Phone:</b> +{item.countryCode} - {item.phoneNumber}
                                    <p><b>Address: </b>{item.address}, {item.landmark}, {item.city} - {item.pincode}, {item.state}</p>
                                </div>
                                <a href="#add" className="edit" onClick={()=>editShippingAddress(item)}><FontAwesomeIcon icon={faPenToSquare} /></a>
                                <div className="delete" onClick={()=>deleteAddress(item._id)}><FontAwesomeIcon icon={faTrashAlt} /></div>
                            </div>
                        )}
                        { props.formDataId ? (
                            <a href="#add" className="add_address" onClick={addNewAddress}>
                                <div><FontAwesomeIcon icon={faPlus}/></div>
                                Click Here To Add A New Address
                            </a>
                        ):( <></> )}
                    </>
                )
            }
            else{
                return(
                    <div className="box no_add">
                        <h5>No Shipping Address Added</h5>
                    </div>
                )
            }
        }
    }
    else{
        return(<></>)
    }
}

export default function UserAddress() {

    const [billingAddressChange, setBillingAddressChange] = useState(false)
    const [user, setUser] = useState(null)
    const [formData, setFormData] = useState({
        id:'',
        name: '',
        countryCode: '',
        phoneNumber: '',
        address: '',
        landmark: '',
        city: '',
        pincode: '',
        state: ''
    })
    const [errors, setErrors] = useState({
        name: '',
        countryCode: '',
        phoneNumber: '',
        address: '',
        landmark: '',
        city: '',
        pincode: '',
        state: ''
    })
    const [pageError, setPageError] = useState()

    useEffect(() => {
        document.title = `WallFlour Bakehouse | Address`
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_4').classList.add('active')
        window.scrollTo(0, 0)
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .get(url+'/user/userDataAddress',{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=>{
                setUser(res.data)
            })
            .catch(()=>{
                setPageError(true)
            })
        } 
        catch(error){
            setPageError(true)
        }
    }, [])

    function handleChange(e){
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    function editAddress(add){
        setFormData({
            id: add.id,
            name: add.name,
            countryCode: add.countryCode,
            phoneNumber: add.phoneNumber,
            address: add.address,
            landmark: add.landmark,
            city: add.city,
            pincode: add.pincode,
            state: add.state
        })
    }
    function formSubmit(){
        const valid = validate()
        if(valid){
            try{
                const token = JSON.parse(localStorage.getItem("profile")).token
                if(billingAddressChange){
                    axios
                    .put(url+'/user/updateBillingAddress', formData, {
                        headers: { "authorization": `Bearer ${token}` }
                    })
                    .then((res)=>{
                        setBillingAddressChange(false)
                        window.location.reload()
                    })
                }
                else if(formData.id===''){
                    axios
                    .post(url+'/user/addShippingAddress', formData,{
                        headers: { "authorization": `Bearer ${token}` }
                    })
                    .then((res)=>{
                        window.location.reload()
                    })
                }
                else{
                    axios
                    .put(url+'/user/updateShippingAddress', formData, {
                        headers: { "authorization": `Bearer ${token}` }
                    })
                    .then((res)=>{
                        window.location.reload()
                    })
                }
                console.log(formData)
            } 
            catch(error){
                console.log(error)
            }
        }
    }
    
    function validate(){
        const numPattern = /^\d{10}$/
        const countryPattern = /^\d{1,3}$/

        const nodeList = document.querySelectorAll('.form_error')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        let flag=0
        if(formData.name.length < 3){
            setErrors({...errors, name: 'Name Should Be Greater Than or Equal To 3 Charecters'})
            document.getElementById('error_name').classList.add('active')
            return false
        }
        if(!countryPattern.test(formData.countryCode)){
            setErrors({...errors, countryCode: 'Enter A Valid Country Code' })
            document.getElementById('error_countryCode').classList.add('active')
            return false
        }
        if(!numPattern.test(formData.phoneNumber)){
            setErrors({...errors, phone: 'Enter A Valid Phone Number' })
            document.getElementById('error_phoneNumber').classList.add('active')
            return false
        }
        if(formData.landmark.length===0){
            setErrors({...errors, landmark: 'Landmark can not be empty' })
            document.getElementById('error_landmark').classList.add('active')
            return false
        }
        if(formData.city.length===0){
            setErrors({...errors, city: 'City can not be empty' })
            document.getElementById('error_city').classList.add('active')
            return false
        }
        if(formData.pincode.length===0 || formData.pincode<530000 || formData.pincode>6400000 ){
            setErrors({...errors, pincode: 'Invalid Pincode' })
            document.getElementById('error_pincode').classList.add('active')
            return false
        }
        if(formData.state.length===0){
            setErrors({...errors, state: 'State can not be empty' })
            document.getElementById('error_state').classList.add('active')
            return false
        }
        if(formData.address.length===0){
            setErrors({...errors, address: 'Address can not be empty' })
            document.getElementById('error_address').classList.add('active')
            return false
        }
        return true;
    }


    if(pageError){
        return(<Error login={true} />)
    }
    else if(user){
        return (
            <div className='user_address container mb-5'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/user/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Your Address</li>
                    </ol>
                </nav>
                <div className="heading mb-4 mb-md-5">Your Address</div>
                <div className="row">
                    <div className="col-12 col-md-6 address_view pe-lg-4">
                        <div className="section billing_address">
                            <div className="heading">Billing Address</div>
                            <AddressBox billingAddress={true} setBillingAddressChange={setBillingAddressChange} editAddress={editAddress} address={user.billingAddress} name={user.name} countryCode={user.countryCode} phoneNumber={user.phoneNumber} />
                        </div>
                        <div className="section delivery_address">
                            <div className="heading">Delivery Address</div>
                            <AddressBox billingAddress={false} setBillingAddressChange={setBillingAddressChange} editAddress={editAddress} address={user.shippingAddress} formDataId={formData.id}/>
                        </div>
                    </div>
                    <div id="add" className="col-12 col-md-6 ps-lg-4 mt-4 mt-md-0">
                        <h5><b>{billingAddressChange ? (<>Update Billing Address</>) : (<>{ formData.id ? (<>Edit Shipping Address</>) : (<>Add a New Shipping Address</>)}</>) }</b></h5>
                        <Form className='mt-4'>
                            <FormGroup row>
                                <Label htmlFor="name" lg={3}>Full Name</Label>
                                <Col lg={9} >
                                    <Input type="text" id="name" name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} />
                                    <div id="error_name" className='form_error'>{errors.name}</div>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="name" lg={3}>Country Code</Label>
                                <Col lg={9} >
                                    <Input type="number" onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 ) && e.preventDefault() } id="name" name="countryCode" placeholder="Country Code" onChange={handleChange} value={formData.countryCode} />
                                    <div id="error_countryCode" className='form_error'>{errors.countryCode}</div>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="name" lg={3}>Phone Number</Label>
                                <Col lg={9} >
                                    <Input type="number" onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 ) && e.preventDefault() } id="name" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} value={formData.phoneNumber} />
                                    <div id="error_phoneNumber" className='form_error'>{errors.phone}</div>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="landmark" lg={3}>Landmark</Label>
                                <Col  lg={9} >
                                    <Input type="input"  id="landmark" name="landmark" placeholder="Landmark" onChange={handleChange} value={formData.landmark} />
                                    <div id="error_landmark" className='form_error'>{errors.landmark}</div>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="city" lg={3}>City</Label>
                                <Col  lg={9} >
                                    <Input type="text"  id="city" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                                    <div id="error_city" className='form_error'>{errors.city}</div>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="pincode" lg={3}>Pincode</Label>
                                <Col  lg={9} >
                                    <Input type="number" onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 ) && e.preventDefault() } id="pincode" name="pincode" placeholder="Pincode" onChange={handleChange} value={formData.pincode} />
                                    <div id="error_pincode" className='form_error'>{errors.pincode}</div>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="state" lg={3}>State</Label>
                                <Col  lg={9} >
                                    <Input type="input"  id="state" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                                    <div id="error_state" className='form_error'>{errors.state}</div>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="address1" lg={3}>Address</Label>
                                <Col lg={9} >
                                    <textarea type="text" id="address1" name="address" placeholder="Full Address" onChange={handleChange} value={formData.address} />
                                    <div id="error_address" className='form_error'>{errors.address}</div>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{size: 12}}>
                                    <div className="btn_cont">
                                        <div className="btn_" onClick={formSubmit}>Submit</div>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <CircleLoader/>
        )
    }
}
