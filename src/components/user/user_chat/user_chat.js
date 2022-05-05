import React, { useState, useEffect, useRef } from 'react'
import Error from '../../error/error';
import axios from 'axios'
import moment from 'moment'
import {url} from '../../../url'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import './user_chat.css'

export default function UserChat(props) {

  const token = JSON.parse(localStorage.getItem("profile")) ? JSON.parse(localStorage.getItem("profile")).token : ""
  const [conversations, setConversations] = useState()
  const [message, setMessage] = useState('')
  const [pageError, setPageError] = useState()
  const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => {
      elementRef.current.scrollIntoView()
      document.getElementById("message_section").focus() 
    });
    return <div ref={elementRef} />;
  };

  useEffect(() => {
    document.title = `WallFlour Bakehouse | Chat`
    props.setChatScreen(true)
    window.scrollTo(0, 0)
    try{
      axios
      .get(url+'/message/getUserMessage',{
        headers: {'authorization': `Bearer ${token}`}
      })
      .then((res)=>{
        setConversations(res.data.conversation)
      })
      .catch(()=>{
        setPageError(true)
      })
    }
    catch(error){
      setPageError(true)
    }
  }, [token, props])

  function handleChange(e){
    if(e.nativeEvent.inputType === "insertLineBreak") return;
    setMessage(e.target.value)
  }

  function validateForm(){
    if(message.length===0){
      return false
    }
    return true;
  }
  
  function handleSubmit() {
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
        setConversations(res.data.conversation)
      })
      .catch(()=>{
        document.querySelector('.error_message').classList.add('active')
      })
    }
    catch(error){
      console.log(error)
    }
  }

  function enterToSendMsg(e){
    e.preventDefault();
    if (e.key === "Enter" || e.keyCode === 13) {
      handleSubmit()
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
            <a href="tel:+919740096628" className="social phone" style={{color: "black", transform: "scale(0.9)"}}>
              <FontAwesomeIcon icon={faPhone} />
            </a>
            <a href="https://wa.me/919740096628" className="social" style={{color: "rgb(18,140,126)"}}>
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a href="https://www.instagram.com/wallflour_bakehouse/" className="social" style={{color: "rgb(214,41,118)"}}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
        <div className="chat_section" id="message_section">
          {conversations ?
            ( 
              <>
                {conversations.map((conversation)=>
                  <div className='conversation_sec' key={conversation._id}>
                    <div className="date">{moment(conversation.conversationDate).format("DD/MM/YYYY")} {daysOfTheWeek[moment(conversation.conversationDate).day()]}</div>
                    {conversation.messages.map(message=>
                      <div className={"message"+(message.role!=="admin" ? " active" : "")} key={message._id}>
                        {message.message}
                        <div className="time">{moment(message.time).format("hh:mm A")}</div>
                      </div>
                    )}
                  </div>
                )}
                <AlwaysScrollToBottom />
              </>
            ):(<></>)
          }
        </div>
        <div className="chat_footer">
          <div className="input">
            <textarea className="type_message" type="text" name="message" placeholder='Type A Message' onKeyUp={enterToSendMsg} onChange={handleChange} value={message} />
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
