
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { blue, green, grey } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { restrictedUsers } from 'redux/Auth/authCrud'
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
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { connect } from "react-redux";
import * as auth from "redux/Auth/authRedux";
import { updateUserInfoByLeader } from "redux/Auth/authCrud";
import { postNotification } from 'redux/Notification/notificationCrud'



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: '900px',

  },
  card: {
    maxWidth: 400,
    minHeight: 200,
    borderRadius: 20,
    padding: 10,
    border: '1.2px solid #E7EDF3',
    position: 'relative',
    boxShadow: '1px 1px 4px rgb(0 0 0 / 7%)',
    '&:hover': {

      borderColor: '#5B9FED',
      cursor: 'pointer',
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
  content: {
    paddingTop: 0,
    fontWeight: '600',
    display: 'flex',

  },
  header: {
    paddingBottom: 10,

  },
  cardlayout: {
    paddingTop: 0,
  },
  actions: {
    position: 'absolute',
    right: '23px',
    top: '18px',
    display: 'flex'


  },
  icnbtn: {
    padding: '0px !important'
  },
  dialog: {
    width: '600px'

  },
  select: {
    borderRadius: '0px !important'
  },
}));

function RestrictedUsers(props) {
  const socket = props.socket;
  const classes = useStyles();
  const [rUser, setRUser] = React.useState()
  
  


  React.useEffect(() => {
    restrictedUsers()
      .then(({ data }) => {
        if (data.success) {
          props.setRestrictedUsers(data.result);
        } else {
          console.log("Readin users failed!");
        }
      })
      .catch(() => {
        console.log("Reading users error!");
      });

  }, []);

  

  return (
    <div>
      <div className={classes.root} >
        <Grid container spacing={3}>
          { props.restrictedUsers.map(users => {

            return (
            <Grid item xs={12} sm={4} key={users._id}>
                <Card className={classes.card}>
                <CardHeader className={classes.header}
                    avatar={
                    <Avatar aria-label="profile" className={classes.avatar} src={users.avatar === null || "" ? users.userHandle.charAt(0).toUpperCase() : users.avatar} />
                    } />
                

                <CardContent className={classes.cardlayout}>
                    <div className={classes.content}>
                    <Typography className={classes.content} variant="subtitle2" display="block" gutterBottom>
                        {users.userHandle}
                    </Typography>
                    {users.userRole === 'leader' || 'moderator' && !users.userRole === 'user' ? <CheckCircleIcon style={{ color: green[500], fontSize: 18, marginTop: '1px', marginLeft: '4px' }}></CheckCircleIcon> : null}
                    </div>
                    <Typography variant="body2" component="p">
                    {users.userId}
                    </Typography>
                    <Typography style={{ color: grey[500] }} variant="body2" component="p">
                    {users.userDesc}
                    </Typography>

                </CardContent>

                </Card>

            </Grid>
            )
            })}
        </Grid>

      </div>
    </div>
  )
}

export default connect(
  ({ auth }) => ({ currentUser: auth.currentUser, allUsers: auth.allUsers, currentWallet: auth.currentWallet, restrictedUsers: auth.restrictedUsers }),
  auth.actions
)(RestrictedUsers);