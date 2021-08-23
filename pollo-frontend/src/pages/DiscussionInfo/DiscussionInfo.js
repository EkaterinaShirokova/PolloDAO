// created by corasphinx
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getUserByAddress } from 'redux/Auth/authCrud';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button, Container, TextareaAutosize, Divider } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import fileDownload from 'js-file-download'
import { SiFacebook } from "react-icons/si";
import { SiTwitter } from "react-icons/si";
import { MentionsInput, Mention } from 'react-mentions';
import {BASE_URL} from 'redux/config'

// material icons
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import SaveIcon from '@material-ui/icons/Save';
import ChatIcon from '@material-ui/icons/Chat';
import ShareIcon from '@material-ui/icons/Share';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';

import user from 'assests/img/user.png';
import { themeColor } from 'constant';
import store from "redux/store";
import { getPostById, downloadFile, likePost,filePreview } from 'redux/Post/postCrud';
import { createComment, getComment, likeComment } from "redux/Comment/commentCrud";
import Skeleton from '@material-ui/lab/Skeleton';

import { getalluser } from 'redux/Auth/authCrud';
import * as post from "redux/Post/postRedux";
import * as auth from "redux/Auth/authRedux";

const defaultStyle = {
    control: {
        margin: '-15px',
        borderRadius: '10px',
        fontSize: '22px',
        minHeight: "120px"
    },

    highlighter: {
        overflow: "hidden"
    },

    input: {
        margin: 5
    },

    "&singleLine": {
        control: {
            display: "inline-block",
            width: 130
        },

        highlighter: {
            padding: 1,
            border: "2px inset transparent"
        },

        input: {
            padding: 1,
            border: "2px inset"
        }
    },

    "&multiLine": {
        control: {
            fontFamily: "monospace",
            border: "1px solid silver",
        },

        highlighter: {
            padding: 5
        },

        input: {
            margin: -7,
            padding: 15,
            minHeight: 20,
            outline: 0,
            border: 0
        }
    },

    suggestions: {
        list: {
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.15)",
            fontSize: 10
        },

        item: {
            padding: "5px 15px",
            borderBottom: "1px solid rgba(0,0,0,0.15)",

            "&focused": {
                backgroundColor: themeColor
            }
        }
    }
};
  
const defaultMentionStyle = {
    // backgroundColor: "#cee4e5"
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    button: {
        marginBottom: '30px',
        borderRadius: 20,
        color: themeColor
    },
    leftcontent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100px',
    },
    metainfo: {
        display: 'flex',
        alignItems: 'center',
    },
    avatarPost: {
        border: '2px solid',
        borderColor: themeColor,
        height: '20px',
        width: '20px',
    },
    avatar: {
        border: '2px solid',
        borderColor: themeColor,
        height: '40px',
        width: '40px',
    },
    light: {
        color: grey[700],
        paddingLeft: 18,

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
    },
    shareIcon: {
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
        marginLeft: '50px',
        '&:hover': {
            backgroundColor: themeColor,
        },
    },
    container: {
        paddingTop: '30px',
        paddingBottom: '30px'
    },
    textArea: {
        borderRadius: '10px',
        padding: '10px',
        fontSize: '22px',
        marginLeft: '30px',
        minWidth: '100vh',
        marginBottom: '30px',
    },
    commentBlock: {
        display: 'flex',
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function DiscussionInfo(props) {
    const classes = useStyles();
    const [currentPost, setPost] = React.useState('');
    const [skeletonStyle, setskeleton] = React.useState('none');
    const [commentStyle, setCommentStyle] = React.useState('block');
    const [comment, setComment] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [allUserIds, setUserIds] = React.useState(null);
    const [likeActive, setlikeActive] = React.useState('gray');
    const [mentionState, setMentionState] = React.useState({
        value: '',
        mentions: []
    });
    const [commentLoading, setCommentLoading] = React.useState(false);
    const [titleUsers, setTitleUsers] = React.useState([]);  
    const [file, setFile] = React.useState('');     

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    const handleChange = (event, newValue, newPlainTextValue, mentions) => {
        setComment(newPlainTextValue);
        setMentionState({ ...mentionState, value: event.target.value });
    };

    const saveFile = (fileName) =>{
        if(props && props.selectedPost && props.selectedPost.filepath){
            downloadFile(props.selectedPost._id)
            .then(function(res){
                fileDownload(res.data, props.selectedPost.filepath.split('uploads/')[1] )
            })

        }
    }
    
    
    React.useEffect(() => {
        loadUsersInfo();
    }, []);
    const loadUsersInfo = () => {
        getalluser()                                   
            .then(({ data }) => {
                if (data.success) {
                    setUserIds(null);
                    let ids = [];
                    for (const user of data.result)
                        ids.push(user.userId.toLowerCase());
                    const availableUserIds = ids.filter(userId => userId.toLowerCase().startsWith('@'))
                    let alluserIds = ['@all'].concat(availableUserIds);
                    const userIds = alluserIds.map(userId => { return { id: userId, display: userId } });
                    
                    setTitleUsers(userIds);
                    console.log("Success loading all users");
                } else {
                    console.log("Reading users failed!");
                }
            })
            .catch(() => {
                console.log("Reading users error!");
            });
    }
   

      React.useEffect(() => {
        if(props.selectedPost == null){
          
            var postId = props.location.pathname.split('/').pop()
            filePreview(postId)
            .then(function(result) {
                if(result.data){
                    setFile(result.data)
                }
                
            
            })
            .catch((e) => {
                setFile('')
            })
            getPostById(postId)
            .then(function(res){
                setPost(res.data.result);
                props.SetSelectedPost(res.data.result);
                var liked = res.data.result.liked;
                var userId =  props.currentUser.userModel.userId;
                var filteredArray = liked.filter(function(itm){
                    return userId.indexOf(itm.userId) > -1;
                  });
                  if(filteredArray && filteredArray.length > 0){
                    setlikeActive(themeColor)
                  }else{
                    setlikeActive('gray')
                  }
                
            });
        }
        
        })
    

    useEffect(() => {
        
        var postId = props.location.pathname.split('/').pop()

        
        filePreview(postId)
            .then(function(result) {
                
                if(result.data){
                    setFile(result.data)
                }
            })
            .catch((e) => {
                setFile('')
            })

        if(props.currentToken){
        
            
        getPostById(postId)
        .then(function(res){
            setPost(res.data.result);
            props.SetSelectedPost(res.data.result);
            var liked = res.data.result.liked;
                var userId =  props.currentUser.userModel.userId;
                var filteredArray = liked.filter(function(itm){
                    return userId.indexOf(itm.userId) > -1;
                  });
                  if(filteredArray && filteredArray.length > 0){
                    setlikeActive(themeColor)
                  }else{
                    setlikeActive('gray')
                  }
            getUserByAddress(props.currentToken.token, res.data.result.address)
            .then(function(response){
              // debugger;
              props.SetSelectedPostUser(response.data.result);
            })

        
            
            
        });
    }
         
        store.subscribe(() =>
        setPost(store.getState().post ? store.getState().post.selectedPost : null)
      )
    }, [props.posts, props.selectedPost]);


    const newComment = (e) => {
        setskeleton('block');
        setCommentStyle('none');
        e.preventDefault();
        debugger;
        setCommentLoading(true);
        createComment(props.currentToken.token , props.selectedPost._id, comment, props.currentUser.userModel.address , props.currentUser.userModel.userHandle)
        .then(function(){
            getPostById(props.selectedPost._id)
            .then(function(res){
                setPost(res.data.result);
                props.SetSelectedPost(res.data.result);
                setComment('');
                setMentionState({ value: '', mentions: []});
                setskeleton('none');
                setCommentStyle('block');
                setCommentLoading(false);
            });
        });

    }

    
    const shareMe = (e) => {
       var socialMedia =  e.currentTarget.getAttribute('social');
       var pageLink = window.location.href;
       var pageTitle = String(document.title).replace(/\&/g, '%26');
       if (socialMedia == 'facebook'){
        window.open(`http://www.facebook.com/sharer.php?u=${pageLink}&quote=${pageTitle}`,'sharer','toolbar=0,status=0,width=626,height=436');
       }else if(socialMedia == 'twitter'){
        window.open(`https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageLink}`,'sharer','toolbar=0,status=0,width=626,height=436');

       }
    }

    const handleLike = () =>{
        var isUser = true;
        
        if(props.currentUser.userModel && props.selectedPost){
          var liked = props.selectedPost.liked;
          var userId =  props.currentUser.userModel.userId;
          var filteredArray = liked.filter(function(itm){
            return userId.indexOf(itm.userId) > -1;
          });
          if(filteredArray && filteredArray.length > 0){
              isUser = false;
          }
        }
        
        likePost(props.currentToken.token, props.selectedPost._id,  props.currentUser.userModel.userId, isUser)
        .then(function(res){
            setPost(res.data.result);
                props.SetSelectedPost(res.data.result);
                var liked = res.data.result.liked;
                var userId =  props.currentUser.userModel.userId;
                var filteredArray = liked.filter(function(itm){
                    return userId.indexOf(itm.userId) > -1;
                  });
                  if(filteredArray && filteredArray.length > 0){
                    setlikeActive(themeColor)
                  }else{
                    setlikeActive('gray')
                  }
                
        })

    }

    const handleCommentLike =(e) =>{
        if(props.currentToken && props.currentUser){
            var commentId = e.currentTarget.getAttribute('data-comment');
            var userId =  props.currentUser.userModel.userId;
            var notYetCommented = true;
            if(commentId){
                getComment(commentId)
                .then(function(comment){
                    debugger;
                    var filteredArray = comment.data.result.liked.filter(function(itm){
                        return userId.indexOf(itm.userId) > -1;
                      });
                      if(filteredArray && filteredArray.length > 0){
                        notYetCommented = false;
                      }else{
                        notYetCommented = true;
                      }
                      likeComment(props.currentToken.token, comment.data.result._id, props.currentUser.userModel.userId,notYetCommented )
                      .then(function(comment){
                        getPostById(props.selectedPost._id)
                        .then(function(res){
                            
                            props.SetSelectedPost(res.data.result);
            
                        });
                      })
                })
            }

        }
       
    }

    
    return (
        <>
      {props.selectedPost != null ?  <div className={classes.root}>
      <Grid container>
            <Grid item xs={12}>
                <Typography style={{ fontSize: '20px', fontWeight: '600' }} variant="h1" gutterBottom>
                    {props.selectedPost.title || currentPost.title}
               
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <div className={classes.metainfo}>

                    
                <Avatar className={classes.avatar} alt={props.selectedPost.userHandle || currentPost.userHandle } src={props.selectedPost.avatar || currentPost.avatar} /> 
                    <span className={classes.light}>Posted by</span>
                    <span className={classes.hightlight}>{props.selectedPost.userHandle || currentPost.userHandle} <span style={{fontSize:'10px', color:'black'}}>{props.selectedPost.userId}</span>  <span style={{color: themeColor, paddingLeft:"5px", paddingRight:"5px"}}> {props.selectedPost.userRole }</span></span>
                    <span className={classes.light}>Posted on</span>
                    <span className={classes.hightlight}>{props.selectedPost.created || currentPost.created || currentPost.modified || props.selectedPost.modified}</span>

                    <div className={classes.comment}>
                        <ChatIcon style={{ color: grey[500] }}></ChatIcon>
                        <span className={classes.hightlight}>{ props.selectedPost.comments && props.selectedPost.comments.length || currentPost.comments && currentPost.comments.length}</span>
                    </div>
                    <div className={classes.shareIcon}>
                        <ShareIcon onClick={handleClickOpen} ></ShareIcon>
                        {props.currentUser && props.currentUser.userModel ? <Button onClick={handleLike} style={{paddingLeft:'20px',color:likeActive}}startIcon={<ThumbUpIcon />}>
                        {props.selectedPost.liked.length}
                        </Button> : null }
                        
                        <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">{"Share this post"}</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <div style={{display: 'flex', color:themeColor, fontSize:'24px', justifyContent: 'space-evenly'}}>
                                <SiTwitter style={{cursor: 'pointer'}} social='twitter' onClick={shareMe}>

                                </SiTwitter>

                               <SiFacebook style={{cursor: 'pointer'}} social='facebook' onClick={shareMe}>

                                </SiFacebook>
                                
                               

                            </div>
                            
                        </DialogContentText>
                        </DialogContent>

                    </Dialog>
                    </div>
                </div>
            </Grid>
        </Grid>
        <Container className={classes.container}>
            <Typography variant="h5" className={classes.content}>
                {props.selectedPost.body || currentPost.body}
            </Typography>
        </Container>
        <Container>
            {props.selectedPost && props.selectedPost.filepath ? <Button
                variant="outlined"
                className={classes.button}
                startIcon={<SaveIcon/>}
                onClick={saveFile }
                
            >
                {props.selectedPost && props.selectedPost.filepath  ? props.selectedPost.filepath.split('uploads/')[1] : null}
            </Button>
            : null}

            {file ? <div className={classes.preview}>
                <img style={{height:'100px'}}src={file}></img>


            </div> : null}            

            {props.currentUser && props.currentUser.userModel ? <Grid container>

                

                
                <form onSubmit={e => { newComment(e) }}>
                <Grid item xs={12} className={classes.commentBlock}>
                    <Avatar className={classes.avatar} alt={props.currentUser && props.currentUser.userModel.userHandle} src={props.currentUser && props.currentUser.userModel.avatar} />
                    {/* <TextareaAutosize aria-label="minimum height" rowsMin={3} placeholder="Type here to reply..." className={classes.textArea} name="comment" id="commentbox" /> */}
                    <MentionsInput
                        value={mentionState.value}
                        onChange={handleChange}
                        style={defaultStyle}
                        className={classes.textArea}
                        placeholder = "Type here to reply"
                        
                    >
                        <Mention
                            markup="[__display__]{__id__}"
                            data={titleUsers}
                            style={defaultMentionStyle}
                        />
                    </MentionsInput>
                </Grid>

                <Grid item xs={12}>
                    <Button type="submit" variant="contained" disabled={commentLoading} className={classes.primary} disableElevation>
                        Post reply {commentLoading?<CircularProgress size="15px"/> : ''}
                    </Button>
                </Grid>
                </form>

                
            </Grid> : null }
            
            
        </Container>
      
      <Divider style={{ marginTop: '30px', marginBottom: '30px' }} />
      <div style={{display:skeletonStyle}}>

        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        </div>
     
      {props.selectedPost.comments ? props.selectedPost.comments.map(comment => {
            return (
                <div key={comment._id}>
                   
                    <div style={{display:commentStyle}}>
                     <Container key={comment._id} >
              <Grid container justify="flex-start" spacing={3}>
                  <Grid item>
                      <Avatar className={comment.avatar} alt={comment.userHandle} src={comment.avatar} />
                  </Grid>
                  <Grid item >
                      <Grid container spacing={0}>
                          <Grid item xs={12}>
                              <Grid container justify="flex-start" spacing={3}>
                                  <Grid item >
                                      <Typography variant="h6">{comment.userHandle} <span style={{color: themeColor, paddingLeft:"10px"}}> { comment.userRole}</span></Typography>
                                  </Grid>
                                  
                                  
                              </Grid>
                          </Grid>
                          <Grid item xs={12}>
                              <Grid container justify="flex-start" spacing={3}>
                                  <Grid item >
                                      <Typography variant="h6" style={{ color: grey[700] }}>{comment.text}</Typography>
                                  </Grid>
                                 
                              </Grid>
                          </Grid>
                          <Grid item xs={12}>
                              <Grid container justify="flex-start" spacing={3}>
                                  <Grid item >
                                      <Typography variant="h6" style={{ color: grey[700] }}>{comment.created}</Typography>
                                  </Grid>
                              </Grid>
                          </Grid>
                          <Grid item xs={12}>
                              <Grid container justify="flex-start" spacing={3}>
                                  <Grid item >
                                      {props.currentUser && props.currentUser.userModel ?
                                      <div data-comment={comment._id}  onClick={handleCommentLike} >

                                      {
                                       (comment.liked.filter(function(itm){
                                        return props.currentUser.userModel.userId.indexOf(itm.userId) > -1;
                                            }).length) ?  <Button
                                         style={{color:themeColor}}               
                                                startIcon={<ThumbUpIcon />}
                                                >
                                                {comment.liked.length}
                                            </Button> : <Button
                                        
                                        startIcon={<ThumbUpIcon />}
                                        >
                                        {comment.liked.length}
                                        </Button>}
                                  
                                  </div> : null
                                    
                                    
                                    }
                                      
                                  </Grid>
                              </Grid>
                          </Grid>
                      </Grid>
                  </Grid>
              </Grid>
          </Container>
          </div>
          

                </div>
            )} )
            :  null}
     
      </div> : null}
  </>
       
    );
}
export default connect(
    ({ post, auth }) => ({ selectedPost: post.selectedPost, currentUser: auth.currentUser,currentToken: auth.currentToken,selectedPostUser: post.selectedPostUser }),
    post.actions
)(DiscussionInfo);