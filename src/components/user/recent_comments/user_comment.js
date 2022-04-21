import React, { useState, useEffect} from 'react'
import Error from '../../error/error';
import CommentCard from '../../comment_card/comment_card'
import CircleLoader from '../../loader/circle_loader';
import axios from 'axios'
import moment from 'moment';
import {url} from '../../../url'
import { Link } from 'react-router-dom'
import './user_comments.css'

export default function UserComment() {

    const [comments, setComments] = useState(null)
    const [comment, setComment] = useState({
        '_id': '',
        'productName': '',
        'user': '',
        'rating': 5,
        'comment': '',
        'createdAt': ''
    })
    const [pageError, setPageError] = useState()

    useEffect(() => {
        document.title = `WallFlour Bakehouse | User Comments`
        window.scrollTo(0, 0)
        document.querySelectorAll('.mob_list').forEach((ele)=>{
            if(!ele.classList.contains('active')) return
            ele.classList.remove('active')
        })
        document.getElementById('mob_4').classList.add('active')
        try{
            setComment({...comment, user: JSON.parse(localStorage.getItem("profile")).result.username})
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .get(url+'/comment/',{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=>{
                setComments(res.data)
            })
            .catch(()=>{
                setPageError(true)
            })
        } 
        catch(error){
            setPageError(true)
        }
    },[])

    function handleChange(e){
        setComment({...comment, [e.target.name]: e.target.value})
    }

    function updateComment(){
        if(comment.user.length<1) return
        if(comment.rating<0 || comment.rating>5) return
        if(comment.comment.length<2 || comment.comment.length > 200) return
        try{
            const token = JSON.parse(localStorage.getItem("profile")).token
            axios
            .put(url+'/comment/'+comment._id, comment,{
                headers: { "authorization": `Bearer ${token}` }
            })
            .then(()=>{
                window.location.reload()
            })
        } catch(error){
            setPageError(true)
        }
    }
    
    if(pageError){
        return(<Error login={true} />)
    }
    else if(comments){
        return (
            <div className='user_comment_cont container mb-5'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/user/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Comments</li>
                    </ol>
                </nav>
                <div className="heading">Recent Comments</div>
                { comment.productName  ? (
                    <div className="row mt-4">
                        <div className="col-12">
                            <h5>Editing Comment on {comment.productName} on {moment(comment.createdAt).format("DD/MM/YYYY")} at {moment(comment.createdAt).format("HH:MM")}</h5>
                            <div className="add_comment_sec">
                                <img src="https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png" alt="" />
                                <div className='form'>
                                    <div className='mb-2'>
                                        <label htmlFor="">Rating</label>
                                        <select name="rating" onChange={handleChange}>
                                            <option value={5}>5</option>
                                            <option value={4}>4</option>
                                            <option value={3}>3</option>
                                            <option value={2}>2</option>
                                            <option value={1}>1</option>
                                        </select>
                                    </div>
                                    <textarea type="text" placeholder='Add a comment...' name="comment" onChange={handleChange} value={comment.comment}/>
                                </div>
                                <div className="btn_cont" onClick={updateComment}><div className="btn_">Comment</div></div>
                            </div>
                        </div>
                    </div>
                ):(<></>)}
                { comments.length!==0 ? (
                    <div className="row">
                        {comments.map(comment =>
                            <div className="col-12 section mt-4" key={comment._id}>
                                <div className="heading mb-2">Comment on <Link to={`/menu/${comment.productName}`}>{comment.productName}</Link> on {moment(comment.createdAt).format("DD/MM/YYYY")} ({moment(comment.createdAt).format("hh:mm A")}) </div>
                                <CommentCard commentReview={true} comment={comment} setComment={setComment} scroll={false} />
                            </div>
                        )}
                    </div>
                ):( 
                    <div className="no_comments mt-5">
                        <h4>You Have Made No Comments</h4>
                        Feel Free To Share Your Opinion So That We Can Serve You Better
                    </div> 
                )}
                
            </div>
        )
    }else{
        return(<CircleLoader/>)
    }
}
