import React from 'react'
import moment from 'moment'
import axios from 'axios'
import {url} from '../../url'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import './comment_card.css'

export default function CommentCard({comment, commentReview, setComment, scroll}) {

    function editComment(comment){
        if(scroll){
            window.scrollTo(0, 0)
        }
        setComment(comment)
    }

    function deleteComment(comment){
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .delete(url+'/comment/'+comment._id,{
                headers: { "authorization": `Bearer ${token}` },
                data: {
                    "productName": comment.productName,
                }
            })
            .then(()=>{
                window.location.reload()
            })
        } catch(error){
            console.log(error)
        }
    }

    if(comment){
        return (
            <div className={"comment_cont"+(commentReview ? " active" : "")} key={comment._id} id={comment._id}>
                <div className="img full_view" style={{backgroundImage: 'url('+comment.dp+')'}}></div>
                <div className="comment">
                    <div className="top_line">
                        <div className="img mob_view" style={{backgroundImage: 'url('+comment.dp+')'}}></div>
                        <div>
                            <div className="name">{comment.user}</div>
                            <div className='date_review'>
                                <div className="date">{moment(comment.createdAt).fromNow()}</div>
                                <div className="rating">Rating: {comment.rating}/5</div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom_line">
                        <div className="cmt">
                            {comment.comment}
                        </div>
                        {commentReview ? (
                            <>
                                <div className="delete" onClick={()=>deleteComment(comment)}><FontAwesomeIcon icon={faTrashAlt} /></div>
                                <div className="edit" onClick={()=>editComment(comment)}><FontAwesomeIcon icon={faPenToSquare} /></div>
                            </>
                        ):(<></>)}
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(<></>)
    }
}
