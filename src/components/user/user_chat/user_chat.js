import React, { useState, useEffect } from 'react'
import Error from '../../error/error';
import axios from 'axios'
import {url} from '../../../url'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import './user_chat.css'

export default function UserChat(props) {

  const [token, setToken] = useState(JSON.parse(localStorage.getItem("profile")) ? JSON.parse(localStorage.getItem("profile")).token : "")
  const [conversation, setConversation] = useState()
  const [message, setMessage] = useState('')
  const [pageError, setPageError] = useState()

  useEffect(() => {
    document.title = `WallFlour Bakehouse | Chat`
    props.setChatScreen(true)
    window.scrollTo(0, 0)
    var objDiv = document.getElementById("chat_section");
    objDiv.scrollTop = objDiv.scrollHeight;
    try{
      axios
      .get(url+'/message/getUserMessage',{
        headers: {'authorization': `Bearer ${token}`}
      })
      .then((res)=>{
        setConversation(res.data)
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
    setMessage(e.target.value)
  }

  function validateForm(){
    if(message.length===0){
      return false
    }
    return true;
  }
  
  function handleSubmit() {
    document.querySelector('.send_btn').classList.add('active')
    setTimeout(() => {
      document.querySelector('.send_btn').classList.remove('active')
    }, 501);
    try{
      let valid = validateForm()
      if(!valid) return
      axios
      .post(url+'/message/userSendMessage', {
        message: message
      },{
        headers: {'authorization': `Bearer ${token}`}
      })
      .then((res)=>{
        document.querySelector('.error_message').classList.remove('active')
        setMessage('')
        setConversation(res.data)
      })
      .catch(()=>{
        document.querySelector('.error_message').classList.add('active')
      })
    }
    catch(error){
      console.log(error)
    }
  }

  if(pageError){
    return(<Error login={true} />)
  }
  else{
    return (
      <div className="chat_cont">
        <div className="chat_header">
          <div className="left">
            <div className="dp"></div>
            <div className="name">WallFlour BakeHouse</div>
          </div>
          <div className="right">
            <a href="" className="social phone" style={{color: "black", transform: "scale(0.9)"}}>
              <FontAwesomeIcon icon={faPhone} />
            </a>
            <a href="" className="social" style={{color: "rgb(18,140,126)"}}>
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a href="" className="social" style={{color: "rgb(214,41,118)"}}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
        <div className="chat_section" id="chat_section">
          {conversation ?
            (
              <>
                <>
                  {conversation.messages.map((message)=>
                    <div className={"message"+(message.username!=="admin" ? " active" : "")}>
                      {message.message}
                    </div>)}
                  
                </>
                <div className="message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro vel ullam dicta doloribus perspiciatis molestiae cum a, illo quisquam! Libero exercitationem quas accusamus fuga. Fuga modi hic laudantium natus quasi!
                </div>
                <div className="message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro vel ullam dicta doloribus perspiciatis molestiae cum a, illo quisquam! Libero exercitationem quas accusamus fuga. Fuga modi hic laudantium natus quasi!
                </div>
                <div className="message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro vel ullam dicta doloribus perspiciatis molestiae cum a, illo quisquam! Libero exercitationem quas accusamus fuga. Fuga modi hic laudantium natus quasi!
                </div>
                <div className="message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro vel ullam dicta doloribus perspiciatis molestiae cum a, illo quisquam! Libero exercitationem quas accusamus fuga. Fuga modi hic laudantium natus quasi!
                </div>
              </>
            ):(<></>)
          }
        </div>
        <div className="chat_footer">
          <div className="input">
            <textarea className="type_message" type="text" name="message" placeholder='Type A Message' onChange={handleChange} value={message} />
            <div className="error_message">Chat Is Not Available Now. Please Try Again Later</div>
          </div>
          {message.length!==0 ? (
            <div className="send_btn" onClick={handleSubmit}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          ):(<></>)}
        </div>
      </div>
    )
  }
}
