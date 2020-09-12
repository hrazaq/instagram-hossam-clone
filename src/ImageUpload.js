import React , { useState }from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    // const [url, setUrl] = useState("");
    const [progress, setProgress] = useState('');

    const handleChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    }

    const handleUpload = (event) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        // its about progress function to tell the user how much should wait ! 🚶‍♂️
        uploadTask.on(
            "state_changed", // on state changed give me a snapshot of the progress👇 !
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    // it gives you the percentage in 100, of the progress !
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error Function...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function...
                storage.ref("images")
                .child(image.name)
                .getDownloadURL() // to be show as SRC in <img />
                .then(url => {
                    // Put the post { caption, imgUrl, username} in the databse...
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username,
                    });

                    setProgress(0); // When finish...
                    setCaption("");
                    setImage(null);
                });
            }
        )
    }


    return (
        <div className="imageupload"> 
            <progress className="imageupload__progress" value={progress} max="100" />
            <input  
                type="text"
                placeholder="Enter a caption..."
                value={caption}
                onChange={event => setCaption(event.target.value)}
            />
            <input className="imageupload__fileinput" type="file" onChange={handleChange}/>
            <Button type="submit" onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
