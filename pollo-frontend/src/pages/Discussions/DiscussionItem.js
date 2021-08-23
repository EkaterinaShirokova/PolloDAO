import React from 'react'
import { connect } from "react-redux";

// material core
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Button from '@material-ui/core/Button';
import SlateEditor from 'components/SlateEditor';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import List from '@material-ui/core/List';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// material icons
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import ChatIcon from '@material-ui/icons/Chat';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin4Fill } from "react-icons/ri";

import user from 'assests/img/user.png';
import { themeColor } from 'constant'

import * as post from "redux/Post/postRedux";
import { updatepost, deletepost,getallpost } from 'redux/Post/postCrud'
import store from "redux/store";
import { getUserByAddress } from 'redux/Auth/authCrud';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  customcard: {
    display: 'flex',
    background: '#FFFFFF 0% 0% no-repeat padding-box;',
    borderRadius: '9px',
    boxShadow: '4px 21px 24px #B4ABAB27',
    alignItems: 'center',
    padding: 22,
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
      borderLeft: `5px solid ${themeColor}`,
      borderRight: `5px solid ${themeColor}`,
      paddingLeft: '17px'
    },
    [theme.breakpoints.down('sm')]:{
      width:'90vw',
    },
  },
  appBars:{
    position: 'relative',
    backgroundColor: '#F87243 !important'
  },
  leftcontent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    [theme.breakpoints.down('sm')]:{
      display:'none',
    }
  },
  metainfo: {
    paddingTop: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    border: '2px solid',
    borderColor: themeColor,
    height: '30px',
    width: '30px',
  },
  light: {
    color: grey[700],
    paddingLeft: 18,
    [theme.breakpoints.down('sm')]:{
      display:'none',
    }

  },
  hightlight: {
    fontWeight: 'bold',
    color: themeColor,
    paddingLeft: 8,
  },
  comment: {
    paddingLeft: 18,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]:{
      display:'none',
    }
  },
  view: {
    paddingLeft: 18,
    display: 'flex',
    alignItems: 'center',
  },
  rightcontent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    paddingLeft: 50,
  },
  primary: {
    backgroundColor: themeColor,
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    textTransform: 'none',
    paddingLeft: '30px',
    paddingRight: '30px',
    borderRadius: 100,
    top: '14px',
    bottom: '25px',
    right: '10px',

    '&:hover': {
      backgroundColor: themeColor,
    },
  },
  cardmain: {
    width: '100vw',

  },
  editbutton: {
    boxSshadow: '4px 21px 24px #b4abab27',
    position: 'absolute',
    top: '-23px',
    right: '29px',
    borderRadius: '100%',
    border: '2px solid #70707054',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deletebutton: {
    boxSshadow: '4px 21px 24px #b4abab27',
    position: 'absolute',
    top: '-23px',
    right: '84px',
    borderRadius: '100%',
    border: '2px solid #70707054',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'

  }
}));

function DiscussionItem({ history, post, userids, SetSelectedPost, token , ...rest}) {
  const classes = useStyles();
  const [newThreadModal, newThreadModalToggle] = React.useState(false);
  const [currentUser, setUser] = React.useState('');
  const [postUser, setPostUserAv] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState();


  const movetoInfo = () => {
    SetSelectedPost(post);
    history.push(`/DiscussionInfo/${post._id}`);
  }
  const handleNewThreadOpen = () => {
    newThreadModalToggle(true);
  };

  const handleNewThreadClose = () => {
    newThreadModalToggle(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  
  const editPost = (e) => {
    e.stopPropagation();
    handleNewThreadOpen();

  }
  const deleteCurrent = (e) => {
    e.stopPropagation();
    try {
      if (post) {
        
        deletepost(token ,post._id, post.address)
        .then(function(){
          getallpost()
          .then(({ data }) => {
            if (data.success) {
              rest.SetPosts(data.result);
              handleClose()
              
              
            } else {
              console.log("Readin posts failed!");
            }
          })
          .catch(() => {
            console.log("Reading posts error!");
          });

        })
      }

    } catch (e) {

    }

  }

  const updatePost = (title, content) => {
    handleNewThreadClose();
    try {
      if (post) {
        updatepost(token , post._id, post.address, title, content[0].children[0].text)
        .then(function(){
          getallpost()
          .then(({ data }) => {
            if (data.success) {
              rest.SetPosts(data.result);
              
              
            } else {
              console.log("Readin posts failed!");
            }
          })
          .catch(() => {
            console.log("Reading posts error!");
          });

        })
      
      }
    }
    catch (e) {
    }
  }
  React.useEffect(() => {

    if (post && token) {
      setLoading(true);
      getUserByAddress(token, post.address)
            .then(function(response){
              // debugger;
              rest.SetSelectedPostUser(response.data.result);
              setLoading(false);
            })
      store.subscribe(() => setUser(store.getState().auth.currentUser ? store.getState().auth.currentUser.userModel : null)

      )
    }

  }, []);


  return (
    <Grid className={classes.cardmain} container spacing={10}>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this post?"}</DialogTitle>
            
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Disagree
              </Button>
              <Button onClick={deleteCurrent} color="primary" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
      
      <Dialog fullScreen open={newThreadModal} onClose={handleNewThreadClose} TransitionComponent={Transition}  BackdropComponent={Backdrop} BackdropProps={{
            timeout: 500,
          }}>
        <AppBar className={classes.appBars}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleNewThreadClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              New Post
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
        <Fade in={newThreadModal}>
        <SlateEditor
            onSubmit={updatePost} post={post}
            userids={userids}
          />
          </Fade>
        </List>
      </Dialog>
      <Grid item xs={8} sm={8} >
        <div className={classes.customcard} >
          {((currentUser && currentUser.address === post.address) || (currentUser && currentUser.userRole.toUpperCase() === 'Moderator'.toUpperCase())) ? <div>          <div className={classes.editbutton} onClick={editPost}>
            <IconButton style={{ color: themeColor }} aria-label="upload picture" component="span">
              <AiFillEdit />
            </IconButton>
          </div>
            <div className={classes.deletebutton} onClick={handleClickOpen}>
              <IconButton style={{ color: themeColor }} aria-label="upload picture" component="span">
                <RiDeleteBin4Fill />
              </IconButton>
            </div></div> : ''}
           

          <div className={classes.leftcontent}>
            <PlaylistAddCheckIcon style={{ color: '#898A89', fontSize: '40px' }}></PlaylistAddCheckIcon>

          </div >
          <div className={classes.maincontent} onClick={movetoInfo} >

            <Typography style={{ fontSize: '20px', fontWeight: '600' }} variant="h1" gutterBottom>
              {post.title}
            </Typography>
            <Typography style={{ fontSize: '16px', color: grey[600] }} variant="h3" gutterBottom>
              {post.body}
            </Typography>

            <div className={classes.metainfo}>

             
              <Avatar aria-label="profile" className={classes.avatar} src={post.avatar}/>   
                   
              <span className={classes.light}>Posted by</span>
             <span className={classes.hightlight}>{post.userHandle} <span style={{fontSize:'10px', color:'black'}}>{post.userId}</span> <span style={{color: themeColor, paddingLeft:"5px", paddingRight:"5px"}}> {post.userRole}</span></span>
              
              <span className={classes.light, classes.hideinmobile}>Posted on</span>
              <span className={classes.hightlight}>{post.modified ? post.modified.split('T')[0] : null}</span>

              <div className={classes.comment}>
                <ChatIcon style={{ color: grey[500] }}></ChatIcon>
                <span className={classes.hightlight}>{post.comments ? post.comments.length : 0}</span>
              </div>
              <div className={classes.view}>
                
              </div>
            </div>

          </div>
          </div>
          
       
      </Grid>
    </Grid>

  )
}
export default connect(
  ({ post }) => ({selectedPostUser: post.selectedPostUser}),
  post.actions
)(DiscussionItem);