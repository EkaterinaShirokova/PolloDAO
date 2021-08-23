/*
Members UI Autor: Krishna @ Tue 11 may 2021
*/

import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { blue, green ,grey} from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { getalluser } from 'redux/Auth/authCrud'
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import { connect } from "react-redux";
import * as auth from "redux/Auth/authRedux";
import {
  themeColor,
} from 'constant'




const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      maxWidth:'900px',
        
    },
    card:{
      maxWidth: 400,
      minHeight:200,
      borderRadius:20,
      padding:10,
      border: '1.2px solid #E7EDF3',
      position: 'relative',
      boxShadow: '1px 1px 4px rgb(0 0 0 / 7%)',
      '&:hover': {
        
        borderColor: '#5B9FED',
        cursor:'pointer',
      },
      

    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    avatar: {
      backgroundColor: blue[500],
    },
    content:{
     paddingTop: 0,
     fontWeight:'600',
     display:'flex',
    
    },
    header:{
      paddingBottom: 10,
     
    },
    cardlayout:{
      paddingTop: 0,
    },
    actions:{
      position: 'absolute',
      right: '23px',
      top: '18px',
      display: 'flex'
      

    },
    icnbtn:{
      padding: '0px !important'
    }
  }));

function Members(props) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [actionUser, setActionUser] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    

    const handleClose = () => {
      setOpen(false);
    };



    React.useEffect(() => {
      setLoading(true);
      getalluser()
        .then(({ data }) => {
          if (data.success) {
            props.setAllUsers(data.result);
            setLoading(false);
          } else {
            console.log("Readin users failed!");
          }
        })
        .catch(() => {
          console.log("Reading users error!");
        });
  
    }, []);

    const renderUsers = () => {
      if (props.allUsers )
        return props.allUsers.map(users => {
          return (
             <Grid item xs={12} sm={4} key={users._id}>
                      <Card className={classes.card}>
                      <CardHeader className={classes.header}
                            avatar={
                              <Avatar aria-label="profile" className={classes.avatar} src={users.avatar === null || "" ?  users.userHandle.charAt(0).toUpperCase() : users.avatar}/>   
                            } />
                          
                           <CardContent className={classes.cardlayout}>
                             <div className={classes.content}>
                          <Typography className={classes.content} variant="subtitle2" display="block" gutterBottom>
                            {users.userHandle}  <span style={{color: themeColor, paddingLeft:"10px"}}> {users.userRole}</span>
                          </Typography>
                          {users.userRole === 'admin' ? <CheckCircleIcon  style={{ color: green[500],fontSize: 18,marginTop:'1px' ,marginLeft:'4px'}}></CheckCircleIcon>: null }
                              </div>
                          <Typography  variant="body2" component="p">
                          {users.userId}
                          </Typography>
                          <Typography style={{ color: grey[500]}}  variant="body2" component="p">
                          {users.userDesc}
                          </Typography>
                          
                        </CardContent>
                        
                      </Card>
                      
                    </Grid> 
                    
           )
        })
    }

    return (
        <div>
            <div className={classes.root} >
              <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
              >
               <DialogTitle id="alert-dialog-slide-title">{"Delete User"}</DialogTitle>
               <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete this user ?
                </DialogContentText>
               </DialogContent>
               <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Disagree
                </Button>
                <Button onClick={handleClose} color="primary">
                  Agree
                </Button>
               </DialogActions>
              </Dialog>
              <Grid container spacing={3}>
              {loading ? <div>

                <div style={{height:'20px'}}></div>

                <Skeleton variant="circle" width={40} height={40} />
                <Skeleton variant="text" />
                <Skeleton variant="rect" width={210} height={118} />

                
              </div>  : renderUsers()}
              </Grid>
              
            </div>
          </div>
    )
}

export default connect(
  ({ auth }) => ({ currentUser: auth.currentUser, allUsers: auth.allUsers, currentWallet: auth.currentWallet}),
  auth.actions
)(Members);