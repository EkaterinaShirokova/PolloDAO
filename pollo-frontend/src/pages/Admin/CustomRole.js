import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import * as auth from "redux/Auth/authRedux";
import * as role from "redux/Role/roleRedux";
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { getALLRoles, newRole} from "redux/Role/roleCrud"

import ListItemIcon from '@material-ui/core/ListItemIcon';

import ListItemText from '@material-ui/core/ListItemText';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import {
    themeColor,
    shadow
  } from 'constant'

const useStyles = makeStyles((theme) => ({
    rootme: {
        
      width: '100%',
      height: '320px auto',
      
    },
    content: {
        paddingTop: 0,
        fontWeight: '600',
        display: 'flex',
    
      },
    input: {
        width: '350px',
        fontSize: '20px',
        border:`2px solid ${themeColor}`,
        paddingLeft:'20px',
        fontSize: '14px',
        color:themeColor,
        borderRadius:'100px'
      },
    balance:{
        color: 'white',
        fontSize: '18px',
        paddingBottom:'10px'
    },
    checkbalance:{
        paddingTop:'20px',
        display:'flex'
    },
    checkbtn:{
        color:'white',
        background: themeColor,
        borderRadius: '100px',
        width:'190px',
       
        
        border: '2px solid #F87243 !important',
        '&:hover': {
            background:'none',
            color:themeColor,
            border: '2px solid #F87243',
            
        }
    },
  }));
  

function CustomRole(props) {
    const classes = useStyles();
    const[loading, setLoading] = React.useState(false);
   


    React.useEffect(() => {
        setLoading(true);
        getALLRoles()
          .then(({ data }) => {
            if (data.success) {
                props.setAllRoles(data.result);
                setLoading(false);
            } else {
              console.log("Readin Roles failed!");
            }
          })
          .catch(() => {
            console.log("Reading Roles error!");
          });
    
      }, []);

    const addRole = () =>{
        setLoading(true);
        var role = document.querySelector("#customrole").value; 
        if(props.currentToken && props.currentToken.token && props.currentUser && props.currentUser.userModel  )
        {
        
        newRole(props.currentToken.token || props.currentUser.userModel.token, role, props.currentUser.userModel.userId,props.currentUser.userModel.userHandle, props.currentUser.userModel.address )
        .then(function (response) {

            getALLRoles()
            .then(({ data }) => {
              props.setAllRoles(data)
                setLoading(false);

            })
            
            

        })
       }
    };

    const allRolesinMap = () =>{
         return props.allRoles.map(roles =>{
            return (
            <>
            <List key={roles.userId}>
            <ListItem>
            <ListItemIcon>
                <PermContactCalendarIcon />
            </ListItemIcon>
            <ListItemText
                primary={roles.role}
                secondary={`Made by ${roles.userId}`}
            />
            </ListItem> 
            </List>
            </>
            
            )

        })
    }

   

    return (
        <div className={classes.rootme}>


            
                
                <div className={classes.checkbalance}>
                <InputBase
                className={classes.input}
                placeholder="Custom Role"
                id="customrole"
                
                inputProps={{ 'aria-label': 'Custom role' }}
                />
                <div style={{width:'10px'}}></div>
                   <Button onClick={addRole} className={classes.checkbtn}>Add Role</Button>
                </div>
                <div style={{height:'50px'}}></div>
                <Typography className={classes.content} variant="subtitle2" display="block" gutterBottom>
                        Custom Roles
                    </Typography>
                
                <div className={classes.roleList}>
                   

                {loading ? <div>
            <Skeleton animation= "wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            </div> :  allRolesinMap()} 

            

            
                
                 
                

                    

               
                </div>
                    
        </div>
    )
}

export default connect(
    ({ auth, role }) => ({ currentToken: auth.currentToken, currentUser: auth.currentUser, allRoles: role.allRoles }),
    role.actions
  )(CustomRole);


