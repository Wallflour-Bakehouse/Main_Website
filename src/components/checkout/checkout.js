import React, { useState, useEffect } from 'react'
import Error from '../error/error';
import axios from 'axios'
import Loader from '../loader/loader';
import {url} from '../../url'
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import { Link, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPenToSquare, faPlus, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import './checkout.css'

function AddressBox(props){

    function selectShippingAddress(item){
        props.setSelectedAddress(item)
        const nodeList = document.querySelectorAll('.box_cont')
        for( let i=0; i<nodeList.length; i++){
            nodeList[i].classList.remove('active')
        }
        document.getElementById(item._id).classList.add('active')
    }

    function editShippingAddress(item){
        props.setFormVissible(true)
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

    function addNewAddress(){
        props.setFormVissible(true)
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
        if(props.address.length!==0){
            return(
                <>
                    {props.address.map(item =>
                        <div className="col-12 col-md-6" key={item._id}>
                            <div className="box_cont" id={item._id}>
                                <div className="box box_add" onClick={()=>selectShippingAddress(item)}>
                                    <div>
                                        <h5>{item.name}</h5>
                                        <b>Phone:</b> +{item.countryCode} - {item.phoneNumber}
                                        <div><b>Address: </b>{item.address}, {item.landmark}, {item.city} - {item.pincode}, {item.state}</div>
                                    </div>
                                    <div className="confirmation">Address Selected<FontAwesomeIcon icon={faCircleCheck} /></div>
                                </div>
                                <div className="select" onClick={()=>selectShippingAddress(item)}><span></span></div>
                                <div className="edit" onClick={()=>editShippingAddress(item)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                                <div className="delete" onClick={()=>deleteAddress(item._id)}><FontAwesomeIcon icon={faTrashAlt} /></div>
                            </div>
                        </div>
                    )}
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                        <div className="add_address" onClick={addNewAddress}>
                            <div><FontAwesomeIcon icon={faPlus}/></div>
                            Click Here To Add A New Address
                        </div>
                    </div>
                </>
            ) 
        }
        else{
            return(
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <div className="add_address" onClick={addNewAddress}>
                        <div><FontAwesomeIcon icon={faPlus}/></div>
                        Click Here To Add A New Address
                    </div>
                </div>
            )
        }
    }
    else{
        return(<></>)
    }
}

export default function Checkout() {

    const [user, setUser] = useState(null)
    const [orderOpen, setOrderOpen] = useState()
    const [formVissible, setFormVissible] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState()
    const [cart, setCart] = useState()
    const [pageError, setPageError] = useState()
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
    
    useEffect(() => {
        document.title = `WallFlour Bakehouse | Checkout`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_2').classList.add('active')
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
            axios
            .get(url+'/cart/',{
                headers: {'authorization': `Bearer ${token}`}
            })
            .then((res)=>{
                setCart(res.data.cart)
                setOrderOpen(res.data.openOrder)
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
                if(formData.id===''){
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
            } 
            catch(error){
                console.log(error)
            }
        }
    }

    function placeOrder(){
        if(!selectedAddress){
            document.querySelector('.warning').classList.add('active')
            document.querySelector('.pay_btn').classList.add('active')
            setTimeout(() => {
                document.querySelector('.pay_btn').classList.remove('active')
            }, 300);
            return
        }
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .post(url+'/order/addUserOrder', {
                shippingAddress: selectedAddress
            },{
                headers: { "authorization": `Bearer ${token}` }
            })
            .then(()=>{
                window.location.replace('/orderConfirmation')
            })
            .catch(()=>{
                alert("Can Not Place Order. Please Try Again Later")
            })
        } catch(error){
            console.log(error)
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
    else if(user&&cart){
        if(cart.cartItems.length!==0){
            return (
                <div className="checkout container mb-5">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/cart">Cart</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-12 col-lg-7 save_add">
                            <h5><b>Select Delivery Address</b></h5>
                            <div className="container-fluid">
                                <div className="row">
                                <AddressBox editAddress={editAddress} address={user.shippingAddress} setSelectedAddress={setSelectedAddress} formDataId={formData.id} setFormVissible={setFormVissible} />
                                </div>
                            </div>
                            <div className="new_add">
                            {formVissible||user.shippingAddress.length===0 ? (<>
                                <h5><b>{formData.id ? (<>Edit Delivery Address</>) : (<>Add a New Delivery Address</>) }</b></h5>
                                <Form className='mt-4'>
                                    <FormGroup row>
                                        <Label htmlFor="name" lg={3}>Full Name</Label>
                                        <Col lg={9} >
                                            <Input type="text" id="name" name="name" autoComplete="off" placeholder="Full Name" onChange={handleChange} value={formData.name} />
                                            <div id="error_name" className='form_error'>{errors.name}</div>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label htmlFor="name" lg={3}>Country Code</Label>
                                        <Col lg={9} >
                                            <Input type="number" onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 ) && e.preventDefault() } id="countryCode" name="countryCode" autoComplete="off" placeholder="Country Code" value={formData.countryCode} onChange={handleChange}/>
                                            <div id="error_countryCode" className='form_error'>{errors.countryCode}</div>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label htmlFor="name" lg={3}>Phone Number</Label>
                                        <Col lg={9} >
                                            <Input type="number" onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 ) && e.preventDefault() } id="name" name="phoneNumber" autoComplete="off" placeholder="Phone Number" onChange={handleChange} value={formData.phoneNumber} />
                                            <div id="error_phoneNumber" className='form_error'>{errors.phone}</div>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label htmlFor="landmark" lg={3}>Landmark</Label>
                                        <Col  lg={9} >
                                            <Input type="input"  id="landmark" name="landmark" autoComplete="off" placeholder="Landmark" onChange={handleChange} value={formData.landmark} />
                                            <div id="error_landmark" className='form_error'>{errors.landmark}</div>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label htmlFor="city" lg={3}>City</Label>
                                        <Col  lg={9} >
                                            <Input type="text"  id="city" name="city" autoComplete="off" placeholder="City" value={formData.city} onChange={handleChange}/>
                                            <div id="error_city" className='form_error'>{errors.city}</div>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label htmlFor="pincode" lg={3}>Pincode</Label>
                                        <Col  lg={9} >
                                            <Input type="number" onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 ) && e.preventDefault() } id="pincode" name="pincode" autoComplete="off" placeholder="Pincode" onChange={handleChange} value={formData.pincode} />
                                            <div id="error_pincode" className='form_error'>{errors.pincode}</div>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label htmlFor="state" lg={3}>State</Label>
                                        <Col  lg={9} >
                                            <Input type="input"  id="state" name="state" placeholder="State" value={formData.state} onChange={handleChange}/>
                                            <div id="error_state" className='form_error'>{errors.state}</div>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label htmlFor="address" lg={3}>Address</Label>
                                        <Col lg={9} >
                                            <textarea type="text" id="address" name="address" autoComplete="off" placeholder="Full Address" onChange={handleChange} value={formData.address} />
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
                            </>):(<></>)}
                            </div>
                        </div>
                        <div className="col-12 col-lg-5 order_summary">
                            <h5><b>Your Order</b></h5>
                            <div className="container_fluid">
                                <div className="row header">
                                    <div className="col-6 col-md-5">Product</div>
                                    <div className="col-3 col-md-3">Quantity</div>
                                    <div className="col-3 col-md-4">Total</div>
                                </div>
                                {cart.cartItems.length>0 ?
                                    (<>
                                        {cart.cartItems.map(item=>
                                            <div className="row content" key={item._id}>
                                                <div className="col-6 col-md-5">
                                                    <Link to={`/menu/${item.product.productName}`} style={{color: "var(--lineColour)", textDecoration: "underline"}}>
                                                        {item.product.productName}
                                                    </Link>
                                                </div>
                                                <div className="col-3 col-md-3">X {item.quantity}</div>
                                                <div className="col-3 col-md-4">₹ {item.total}</div>
                                            </div>
                                        )}
                                    </>):(
                                        <div className="row">
                                            <div className="col-12">Add Items to Cart!</div>
                                        </div>
                                    )
                                }
                                <div className="row">
                                    <div className="grandTotal">
                                        Total:
                                        <span className="ms-3">₹ {cart.grandTotal}</span>
                                    </div>
                                </div>
                                {cart.cartItems.length>0&&orderOpen ? (
                                    <div className="row pay_cont" onClick={placeOrder}>
                                        <div className="pay_btn">Proceed To Pay</div>
                                    </div>
                                ):(<></>)}
                                <div className="warning">Select A Delivery Address</div>
                            </div>
                        </div>
                    </div>
                </div>   
            )
        }
        else{
            return(<Redirect to="/cart" />)
        }
    }
    else{
        return(
            <Loader/>
        )
    }
}
