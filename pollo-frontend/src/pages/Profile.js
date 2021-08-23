import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import * as auth from "redux/Auth/authRedux";
import user from 'assests/img/demouser.jpg';
import { updateUserInfo } from 'redux/Auth/authCrud';


import {
    themeColor,
    shadow
  } from 'constant'

//material core
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';



function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,    
    },
    headerProfile:{
        
        height:'auto',

    },
    profileHead:{
        width:'100%',
        backgroundColor: themeColor,
        padding:'80px',
        height:'280px',
        

    },
    avatar:{
        height:'50px',
        width:'50px'

    },
    card:{
      boxShadow: shadow

    },
    cardone:{
        paddingLeft: '57px!important',
        marginTop:'-89px',
        
    },
    cardtwo:{
      marginTop:'-89px',
      paddingRight: '25px!important',
      paddingLeft: '0px!important',
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
      height:'50px',
      width:'48%',
      '&:hover': {
        backgroundColor: 'white',
        color: themeColor,
        border: `2px solid ${themeColor}`
      },
    },
    rightCardContent:{
      display:'flex',
      flexFlow: 'column',
      justifyContent:'center',
      alignItems:'center',
      width:'100%',
    },
    address:{
      fontSize:'10px'

    },
    input: {
      display: 'none',
    },
    someid:{
      fontSize: '20px',
    position: 'absolute',
    top: '14px',
    left: '66px',
    color: 'white',
    fontWeight: 'bold',

    },
    description:{
      ">div": {
        display: "none",
        
      }

    },
  }));

function Profile(props) {
  // const [admin, setAdmin] = React.useState(props.currentUser && props.currentUser.userModel ? props.currentUser.userModel.userRole : null);
  
  const [imageError, setImageError] = React.useState(false);
  const [baseImage, setBaseImage] = React.useState(props.currentUser ? props.currentUser.userModel.avatar : "");

    const setImageErrorAway = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setImageError(false);
    };

    const HeadingText=({
        text, }) =>{ return(
        <strong><span style={{fontSize:15}}>{text}</span></strong>
        );
      };

      const uploadImage = async (e) => {
        const file = e.target.files[0];
        if(file.size > 1000000){
          setImageError(true);
        }else{
          const base64 = await convertBase64(file);
        setBaseImage(base64);
        }
        
        
      };
    
      const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
    
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };

        
      const updateUser = (e) => {
        e.preventDefault();  
        
        updateUserInfo(props.currentToken.token, props.currentUser.userModel.address, e.target.userid.value, e.target.userhandle.value, e.target.userrole.value === "Not set by admin" ? " " : e.target.userrole.value,e.target.userdesc.value === ""? " " : e.target.userdesc.value, baseImage)
        .then(function (response) {
          props.setUser({ userModel: response.data.result });
          setBaseImage(response.data.result.avatar);
        })
         
      }

      

    const classes = useStyles();
    return (
        <div className={classes.root}>
           <form onSubmit={e => { updateUser(e) }} encType="multipart/form-data">
            <Grid container spacing={3}>
                <Grid className={classes.headerProfile} item xs={12}>
                    <div className={classes.profileHead}>
                      <div style={{position: 'relative'}}>
                      <Avatar className={classes.avatar} alt="Remy Sharp" src={baseImage !== "" ? baseImage : user}  />

                      <span className={classes.someid}>{props.currentUser && props.currentUser.userModel ? props.currentUser.userModel.userId : null}</span>
                    
                      </div>
                      
                    
                    
                    <input accept="image/*" className={classes.input} id="icon-button-file" type="file" name="profile" onChange={(e) => {uploadImage(e); }}/>
                    
                    <label htmlFor="icon-button-file">
                      <IconButton style={{color:'white'}} aria-label="upload picture" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                    
                    </div>
                </Grid>
                <Grid className={classes.cardone} item xs={11}>
                <Card className={classes.card}>
                      <CardHeader className={classes.header}
                            title={
                                <HeadingText text={'My Account'}></HeadingText>
                            }
                          />
                           <CardContent className={classes.cardlayout}>
                             <div className={classes.content}>
                            
                             <FormControl fullWidth className={classes.margin} variant="outlined">
                               <div style={{display:'flex',justifyContent:'space-between'}}>
                               <TextField
                                    id="userid"
                                    name="userid"
                                    disabled
                                    label="User id"
                                    color="#F87243"
                                    style={{width:'48%'}}
                                    defaultValue={props.currentUser && props.currentUser.userModel ? props.currentUser.userModel.userId : null}
                                    style={{display:'none'}}
                                    
                                    variant="outlined"
                                  />
                                  <TextField
                                    id="userhandle"
                                    name="userhandle"
                                    
                                    label="User handle"
                                    style={{width:'48%',borderRadius:'100px'}}
                                    defaultValue={props.currentUser && props.currentUser.userModel ? props.currentUser.userModel.userHandle : null}
                                    
                                    variant="outlined"
                                  />

                                  <TextField
                                    id="userrole"
                                    name="userrole"
                                    label="User role"
                                    disabled
                                    color="#F87243"
                                    style={{width:'48%'}}
                                    defaultValue={props.currentUser && props.currentUser.userModel ? (props.currentUser.userModel.userRole === "" ? 'Not set by admin' : props.currentUser.userModel.userRole ): null}
                                    
                                    variant="outlined"
                                  />

                               </div>

                               <div style={{ height: '30px' }}></div>

                               <div style={{display:'flex',justifyContent:'space-between'}}>
                                 <textarea id="userdesc"
                                     name="userdesc"
                                     placeholder="User Introduction"
                                     style={{color:"black",width:'100%', padding:'10px', height:'120px', fontFamily:'inherit', fontSize:'15px'}}
                                     defaultValue={props.currentUser && props.currentUser.userModel ? (props.currentUser.userModel.userDesc ===""? "": props.currentUser.userModel.userDesc ): null}></textarea>
                               

                                  

                               </div>
                               
                              
                              <div style={{ height: '20px' }}></div>

                              <Button variant="contained" type="submit" className={classes.primary} disableElevation>
                                    Update profile
                                    </Button>
                             </FormControl>


                             
                             </div>
                         
                            
                          
                          
                        </CardContent>
                      </Card>
                   

                </Grid>
               
                
            </Grid>
            </form>
            <Snackbar open={imageError} autoHideDuration={6000} onClose={setImageErrorAway}>
              <Alert onClose={setImageErrorAway} severity="error">
                Please Select an image less than 1 MB
              </Alert>
            </Snackbar>
            
        </div>
    )
}
export default connect(
    ({ auth }) => ({ currentUser: auth.currentUser, currentToken: auth.currentToken }),
    auth.actions
  )(Profile);