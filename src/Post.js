import React , { useState , useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from "firebase";

 
function Post({postId, user, username, caption, imageUrl}) { // we can use props => props.username ... or an object !
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    
    // fetching the comments
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts")
            .doc(postId)
            .collection("comments")
            .add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        setComment('');    
    }
    
    return (
        <div className="post">
            {/*  header -> avatar + username */}
            <div className="post__header">
                <Avatar
                    className="post__avatar" 
                    alt="HossamRazaq"  
                    src="/static/images/avatar/1.jpg" 
                />
                <h3>{username}</h3>
            </div>
            {/* image */}
            <img 
                className="post__image" 
                src={imageUrl}
                alt="HossamPIC"> 
            </img>
        
            {/* username + caption */}
            <h4 className="post__text"><strong>{username}:</strong> {caption}</h4>

            <div className="post__comments">
                {comments.map((comment) => (
                    <p className="post__comment">
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {/* If user exist show the form ; if not don't show it ! */}
            {user && (
                <form className="post__commentBox">
                    <input 
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}    
                    />
                    <button
                        disabled={!comment}
                        className="post__button"
                        type="submit"
                        onClick={postComment}
                    >
                    Post
                    </button>   
                </form>
            )}

            
        </div>
    )
}

export default Post
