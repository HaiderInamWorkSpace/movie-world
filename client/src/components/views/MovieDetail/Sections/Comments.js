import React, { useState } from 'react'
import { Button, Input, Typography, message, Rate } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
import sentiment from 'wink-sentiment';
import swearjar from 'swearjar';
const { TextArea } = Input;
const { Title } = Typography;

function Comments(props) {
    const user = useSelector(state => state.user)
    const [Comment, setComment] = useState("")
    const [isZoomedIn, setZoom] = useState(false);
    const [noInput, setInput] = useState(false);

    const handleChange = (e) => {
            setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        // setZoom(prevValue => {
        //     return !prevValue
        // })

        if (user.userData && !user.userData.isAuth) {
            return alert('Please Log in first');
        }
        if(Comment != ""){
            console.log(swearjar.profane(Comment))
            if(!swearjar.profane(Comment)){
            
            const inputReview = sentiment(Comment);
            var noSentimentCounter = 0;
            inputReview.tokenizedPhrase.map( singleObject => {
                if(singleObject.score >= 0 || singleObject.score < 0){
                    console.log("Positive Token")
                }else{
                    noSentimentCounter++
                }
            })
            if(noSentimentCounter === inputReview.tokenizedPhrase.length){
                console.log("No sentiment found")
                console.log("You entered nothing")
                setInput(true)
                setComment("")
            } else {
                console.log("Sentiment Detected")
                const variables = {
                    content: Comment,
                    writer: user.userData._id,
                    title: props.movieTitle,
                    postId: props.postId,
                    rating: props.movieRating,
                    ratingCount: props.ratingCount
                }
                axios.post('/api/comment/saveComment', variables)
                    .then(response => {
                        if (response.data.success) {
                            setComment("")
                            props.refreshFunction(response.data.result)
                            setInput(false)
                            message.success('Review successfully submited', 10);
                            setZoom(prevValue => {
                                return !prevValue
                            })
                        } else {
                            alert('Failed to save Comment')
                        }
                    })
            }
        }else {
            setComment("")
            setInput(true)
            console.log("You enterend swear words")
            message.error('WARNING! You have committed an offence under Australian Crimes Amendment (Computer Offences) Act 2001. Your account is reported to Admin!', 10);
        }

        } else {
            setInput(true)
            setComment("")
        }

    }
    function buttonClick(){
        setZoom(prevValue => {
            return !prevValue
        })
    } 

    const style = {
        width: '100%',
        borderRadius: '5px',
        borderColor: "red"
    }

    const styleT = {
        width: '100%',
        borderRadius: '5px'
    }
        

    return (
        <div>
            <br />
            <Title level={3} > Share your opinions about {props.movieTitle} </Title>
            <hr />
            {/* Comment Lists  */}
            {/* {console.log(props.CommentLists)} */}

            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}

            {props.CommentLists && props.CommentLists.length === 0 &&
                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'200px'}} >
                    Be the first one who shares your thought about this movie
                </div>
            }

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                {isZoomedIn && (
                    <TextArea
                    style={noInput ? style : styleT}
                    onChange={handleChange}
                    value={Comment}
                    placeholder={noInput ? "Invalid Input": "Leave A Review"}
                    onClick={() => {setInput(false)}}

                />
                )}
            </form>
            <Button onClick={!isZoomedIn ? buttonClick : onSubmit } type="primary" block>{!isZoomedIn ? "Review" : "Submit" }</Button>
            <br /><br /><br />
            <div style={{width: '100%', justifyContent: 'center', display: "flex", alignItems: "center"}}>WOULD YOU LIKE TO RATE MOVIE WORLD ?</div>
            <br />
            <Rate style={{width: '100%', justifyContent: 'center', display: "flex", alignItems: "center"}} defaultValue={0} />
        </div>
    )
}

export default Comments
