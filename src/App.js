import React , {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from "./firebase";
import { Modal, Button, makeStyles, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  // UseEffect Runs a piece of code based on a specific condition !
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  // listen on any sort of authentificatino changes happens login, signup, logout...
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
          // user has logged in...
          console.log(authUser);
          setUser(authUser); // keep you logged in...
      } else {
        // user has logged out...
        setUser(null);
      }
    })
    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  const signUp = (event) => {
    event.preventDefault(); // to not load the page after submitting

    //Authentication
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      setOpen(false);
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message)) // for validation

  }

  const signIn = (event) => {
    event.preventDefault(); // to not load the page after submitting

    //Authentication
    auth.signInWithEmailAndPassword(email, password)
    .then((authUser) => {
      setOpenSignIn(false);
    })
    .catch((error) => alert(error.message)) // for validation
   
  }

  return (
    <div className="app">
      {/* Modal Authentification */}
      {/* Start SignUp Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}  // that is called -> inline functions 
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup"> 
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="InstagramLogo"
              />
            </center>
            <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      {/* End SignUp Modal */}
      {/* Start SignIn Modal */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}  // that is called -> inline functions 
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup"> 
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="InstagramLogo"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      {/* End SignIn Modal */}
      {/* header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="InstagramLogo"
        />

        {/* If else in jsx -> if user is not null else... */}
        {user ? (
          <Button onClick={() =>auth.signOut()}>Logout</Button>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() =>setOpenSignIn(true)}>Sing In</Button>
            <Button onClick={() =>setOpen(true)}>Sign Up</Button>
          </div>
        )}

        
      </div>

      <div className="app__posts">
          <div className="app__postsleft">
            {
              posts.map(({id, post}) => (
                  <Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
              ))
            }
          </div>
          <div className="app__postsright">
            <InstagramEmbed
              url='https://www.instagram.com/p/By_CjxdHEY9/'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}/>
          </div>
      </div>
     
      {user?.displayName ? (
          <ImageUpload username={user.displayName}/>
      ): (
          <h3>Sorry you need to Login to upload...</h3>
      )}
     {/* Posts */}
     {/* Posts */}
    </div>
  );
}

export default App;