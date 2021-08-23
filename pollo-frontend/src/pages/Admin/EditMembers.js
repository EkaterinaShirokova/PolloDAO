
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
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { connect } from "react-redux";
import { getALLRoles } from "redux/Role/roleCrud"
import * as auth from "redux/Auth/authRedux";
import * as role from "redux/Role/roleRedux"
import { updateUserInfoByLeader } from "redux/Auth/authCrud";
import { postNotification } from 'redux/Notification/notificationCrud'
import {
  themeColor,
} from 'constant'



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

function EditMembers(props) {
  const socket = props.socket;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [actionUser, setActionUser] = React.useState([]);
  const [ban, setBan] = React.useState(0);
  const [role, setRole] = React.useState();
  
  const [editUser] = React.useState({
    userId: '',
    banLevel: 0,
    userHandle: '',
    userRole: '',
    userDesc: '',
    address: ''
  });

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event) => {
    setBan(event.target.value);
  };
  const handleChangeRole = (event) => {
    setRole(event.target.value);
    
  };

  const handleChangeUserHandle = (event) => {
    editUser.userHandle = event.target.value
  };

  const handleChangeUserDesc = (event) => {
    editUser.userDesc = event.target.value
  };

  const handleChangeUserId = (event) => {
    editUser.userId = event.target.value
  };
  const handleEdit = (ele) => {
    editUser.userHandle = ele.currentTarget.getAttribute('handle');
    editUser.userId = ele.currentTarget.getAttribute('userid');
    editUser.userRole = ele.currentTarget.getAttribute('userrole');
    editUser.userDesc = ele.currentTarget.getAttribute('userdesc');
    editUser.address = ele.currentTarget.getAttribute('address');
    editUser.banLevel = parseInt(ele.currentTarget.getAttribute('banlevel'));
    setBan(parseInt(ele.currentTarget.getAttribute('banlevel')))

    setOpen(true);

  };

  const editUserData = (e) => {
    e.preventDefault();
    var userHandle, userId, userRole, userDesc, address, banLevel;
    userId = e.target.userid.value;
    userHandle = e.target.userhandle.value;
    if(props.allRoles && props.allRoles[e.target.userrole.value] && props.allRoles[e.target.userrole.value].role){
    userRole = props.allRoles[e.target.userrole.value].role 
    }else {
      userRole = editUser.userRole
    }

    userDesc = e.target.userdesc.value;
    address = e.target.address.value;
    banLevel = e.target.banlevel.value;
    updateUserInfoByLeader(props.currentToken.token, address, userId, userHandle, userRole, userDesc, banLevel)
      .then(function (res) {
        getalluser()
          .then(({ data }) => {
            if (data.success) {
              props.setAllUsers(data.result);
              let notificationTitle = "An admin changed your role";
              let link = "/profile";
              postNotification(props.currentToken.token, userId, notificationTitle, link, props.currentUser.userModel.userId);
              socket.emit("newThread",
                {
                  userList: [userId],
                  content: notificationTitle,
                  from: props.currentUser.userModel.userId,
                  link: link
                });

            } else {
              console.log("Updating users failed!");
            }
          })
          .catch(() => {
            console.log("Updating users error!");
          });
      });
    
    setOpen(false);
  }

  React.useEffect(() => {
    getALLRoles()
    .then(({ data }) => {
      if (data.success) {
          props.setAllRoles(data.result);
          
      } else {
        console.log("Readin Roles failed!");
      }
    })
    .catch(() => {
      console.log("Reading Roles error!");
    });
    getalluser()
      .then(({ data }) => {
        if (data.success) {
          props.setAllUsers(data.result);
        } else {
          console.log("Readin users failed!");
        }
      })
      .catch(() => {
        console.log("Reading users error!");
      });

  }, []);


  
  const renderUsers = () => {
    if (props.allUsers)

      return props.allUsers.map(users => {

        return (
          <Grid item xs={12} sm={4} key={users._id}>
            <Card className={classes.card}>
              <CardHeader className={classes.header}
                avatar={
                  <Avatar aria-label="profile" className={classes.avatar} src={users.avatar === null || "" ? users.userHandle.charAt(0).toUpperCase() : users.avatar} />
                } />
              <div className={classes.actions}>
                <div className={classes.edit}>
                  <IconButton onClick={handleEdit} className={classes.icnbtn} aria-label="edit" handle={users.userHandle} userid={users.userId} userrole={users.userRole} userdesc={users.userDesc} address={users.address} banlevel={users.banLevel ? `${users.banLevel}` : "0"} >
                    <CreateIcon ></CreateIcon>
                  </IconButton>
                </div>

              </div>

              <CardContent className={classes.cardlayout}>
                <div className={classes.content}>
                  <Typography className={classes.content} variant="subtitle2" display="block" gutterBottom>
                    {users.userHandle} <span style={{color: themeColor, paddingLeft:"10px"}}> {users.userRole}</span>
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
          <DialogTitle id="alert-dialog-slide-title">{`Edit User and Role for  ${editUser.userHandle} `}</DialogTitle>
          <form onSubmit={e => { editUserData(e) }}>
            <DialogContent className={classes.dialog}>


              <FormControl fullWidth className={classes.margin} variant="outlined">
                <TextField
                  disabled
                  id="metmaskid"
                  name="address"
                  label="Wallet address"
                  value={editUser.address}

                  variant="outlined"

                />
                <div style={{ height: '20px' }}></div>
                <FormControl variant="outlined" className={classes.formControl}>

                  <InputLabel id="demo-simple-select-outlined-labell">User Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-labell"
                    id="demo-simple-select-outlinedd"
                    value={role}
                    

                    name="userrole"
                    onChange={handleChangeRole}
                    
                    label="User Role"
                  >

                    {props.allRoles.map((role, index) =>{
                      return(
                        <MenuItem key={index} className={classes.select} value={index}>{role.role}</MenuItem>
                      )
                    })}
                    
                   

                  </Select>
                </FormControl>

                <div style={{ height: '20px' }}></div>
                <TextField
                  id="userid"
                  label="User id"
                  disabled
                  name="userid"
                  value={editUser.userId}
                  variant="outlined"
                  onChange={handleChangeUserId}

                />

                <div style={{ height: '20px' }}></div>
                <TextField
                  id="userhandle"
                  label="User handle"
                  
                  name="userhandle"
                  value={editUser.userHandle}
                  variant="outlined"
                  onChange={handleChangeUserHandle}

                />

                <div style={{ height: '20px' }}></div>

                <TextField
                  id="userdesc"
                  label="User Introduction"
                  name="userdesc"
                  value={editUser.userDesc}
                  variant="outlined"
                  onChangeCapture={handleChangeUserDesc}

                />

                <div style={{ height: '20px' }}></div>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Banned level</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={ban}
                    name="banlevel"
                    onChange={handleChange}
                    label="Benned level"
                  >
                    <MenuItem className={classes.select} value={0}>Not banned</MenuItem>
                    <MenuItem className={classes.select} value={1}>Limited Posting</MenuItem>
                    <MenuItem className={classes.select} value={2}>Temporary banned</MenuItem>
                    <MenuItem className={classes.select} value={3}>Permanenetly banned</MenuItem>
                  </Select>
                </FormControl>




              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button style={{ width: '131.3px' }} variant="contained" onClick={handleClose} className={classes.primary} disableElevation>
                Cancel
              </Button>
              <Button variant="contained" type="submit" className={classes.primary} disableElevation>
                Update
              </Button>
            </DialogActions>
          </form>

        </Dialog>
        <Grid container spacing={3}>
          {renderUsers()}
        </Grid>

      </div>
    </div>
  )
}

export default connect(
  ({ auth, role }) => ({ currentUser: auth.currentUser, currentToken: auth.currentToken, allUsers: auth.allUsers, currentWallet: auth.currentWallet, allRoles: role.allRoles }),
  (auth.actions, role.actions)
)(EditMembers);