import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import * as auth from "redux/Auth/authRedux";
import * as global from "redux/GlobalSetting/globalRedux";
import Button from '@material-ui/core/Button';
import { getBalance } from "redux/Pofi/pofiCrud";
import Skeleton from '@material-ui/lab/Skeleton';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import {getGlobalSettings, updateGlobalSettings} from "redux/GlobalSetting/globalCrud";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    themeColor,
    shadow
  } from 'constant'

const useStyles = makeStyles((theme) => ({
    rootme: {
      background: themeColor,  
      width: '100%',
      height: '450px auto',
      padding: '40px'
    },
    content: {
        paddingTop: 0,
        fontWeight: '600',
        display: 'flex',
        color:'white',
    
      },
    input: {
        width: '350px',
        fontSize: '15px',
        border:'2px solid white',
        paddingLeft:'10px',
        color:'white',
        borderRadius:'100px',
       
            "-internal-autofill-selected": {
              
              background:"none",
            }
          
      },
    balance:{
        color: 'white',
        fontSize: '15px',
        paddingBottom:'10px'
    },
    checkbalance:{
        paddingTop:'20px',
        display:'flex'
    },
    checkbtn:{
        color:themeColor,
        background: 'white',
        borderRadius: '100px',
        width:'190px',
        
        border: '1px solid white',
        '&:hover': {
            background:'none',
            color:'white',
            border: '1px solid white',
            
        }
    },
  }));
  

function PofiReq(props) {
    const classes = useStyles();
    
    const[userPoFiShareFromPoFiBUSDPool, setuserPoFiShareFromPoFiBUSDPool] =React.useState('');
    const[userPoFiShareFromPoFiBNBPool, seuserPoFiShareFromPoFiBNBPool] = React.useState('');
    const[poolPoFiBalanceOfUser,setpoolPoFiBalanceOfUser] = React.useState('');
    const[poFiBalanceOfUser, setpoFiBalanceOfUser] =React.useState('');
    const[userPoFiShareFromPoFiBNBVault, setuserPoFiShareFromPoFiBNBVault] = React.useState('');
    const[userPoFiShareFromPoFiBUSDVault, setuserPoFiShareFromPoFiBUSDVault] =React.useState('');
    const[poFiVaultBalanceOfUser, setpoFiVaultBalanceOfUser] = React.useState('')
    const[totalUserBalance, setTotalUserBalance] = React.useState('');
    const[show, setshow] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    
    
    const[loading, setLoading] = React.useState(false);
    const[settingLoading, setSettingLoading] = React.useState(false);
    


    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const checkbalancePofi = () =>{
        setLoading(true);
        var userAdd = document.querySelector("#addressPofi").value; 
        if(userAdd && props.currentToken && props.currentToken.token && props.currentUser && props.currentUser.userModel && props.currentUser.userModel )
        getBalance(props.currentToken.token, userAdd)
        .then(function(res){
            setuserPoFiShareFromPoFiBUSDPool(res.data.result.userPoFiShareFromPoFiBUSDPool);
            seuserPoFiShareFromPoFiBNBPool(res.data.result.userPoFiShareFromPoFiBNBPool);
            setpoolPoFiBalanceOfUser(res.data.result.poolPoFiBalanceOfUser);
            setpoFiBalanceOfUser(res.data.result.poFiBalanceOfUser);
            setuserPoFiShareFromPoFiBNBVault(res.data.result.userPoFiShareFromPoFiBNBVault);
            setuserPoFiShareFromPoFiBUSDVault(res.data.result.userPoFiShareFromPoFiBUSDVault);
            setpoFiVaultBalanceOfUser(res.data.result.poFiVaultBalanceOfUser);
            setTotalUserBalance(res.data.result.totalUserBalance);
            setLoading(false)
            setshow(true)

        });
    };

    const handleSubmitGlobal =(e)=> {
        e.preventDefault();
        handleClose();
        setSettingLoading(true);

        if(props.currentUser && props.currentToken && props.currentToken.token && props.currentUser.userModel){
            updateGlobalSettings(e.target.loginreq.value, e.target.proposalreq.value, props.currentUser.userModel.userId, props.currentToken.token )
            .then(function(res){
                props.setGlobalSetting(res.data.result[0]);
                setSettingLoading(false);
            })
        }
    }

    React.useEffect(() => {

        if(props.currentToken && props.currentToken.token){
            
        
        getGlobalSettings(props.currentToken.token)
          .then(({ data }) => {
            if (data.success) {
                props.setGlobalSetting(data.result[0]);
                
                
            } else {
              console.log("Readin Setting failed!");
            }
          })
          .catch(() => {
            console.log("Reading Setting error!");
          });
        }
    
      }, [props]);

    return (
        <div className={classes.rootme}>
            {loading ? <div>
            <Skeleton animation= "wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            </div> : null }
            {loading == false? <div>

                <div className={classes.checkbalance}>
                <InputBase
                className={classes.input}
                placeholder="User Address"
                id="addressPofi"
                
                inputProps={{ 'aria-label': 'Address' }}
                />
                <div style={{width:'10px'}}></div>
                   <Button onClick={checkbalancePofi} className={classes.checkbtn}>Check Balance</Button>
                </div>
                <div style={{height:'20px'}}></div>
                {show ? <div><div className={classes.balance}>
               PoFi Share from PoFiBUSD Pool: <span style={{fontWeight:'bold'}}> {userPoFiShareFromPoFiBUSDPool}</span>  
                </div>
                <div className={classes.balance}>
                PoFi Share from PoFiBNB Pool: <span style={{fontWeight:'bold'}}> {userPoFiShareFromPoFiBNBPool}</span>
                </div>
                <div className={classes.balance}> 
                PoFi Pool Balance of the User Address: <span style={{fontWeight:'bold'}}> {poolPoFiBalanceOfUser}</span>
                </div>
                <div className={classes.balance}>
                PoFi Balance of the User Address: <span style={{fontWeight:'bold'}}> {poFiBalanceOfUser}</span>
                </div>
                <div className={classes.balance}>
                PoFi Share from PoFiBNB Vault: <span style={{fontWeight:'bold'}}> {userPoFiShareFromPoFiBNBVault}</span>
                </div>
                <div className={classes.balance}>
                PoFi Share from PoFiBUSD Vault: <span style={{fontWeight:'bold'}}> {userPoFiShareFromPoFiBUSDVault}</span>
                </div>
                <div className={classes.balance}>
                PoFi Share from PoFi Vault: <span style={{fontWeight:'bold'}}> {poFiVaultBalanceOfUser}</span>
                </div>
                <div className={classes.balance}>
                Total Balance is: <span style={{fontWeight:'bold'}}> {totalUserBalance}</span>
                </div> </div> : null}
                
                
                </div>: null}
                <div style={{height:'10px'}}></div>

                <Divider />
                <div style={{height:'10px'}}></div>
                <div style={{height:'10px'}}></div>

                  <Typography className={classes.content} variant="subtitle2" display="block" gutterBottom>
                        Custom Roles
                  </Typography>

                    <div style={{height:'10px'}}></div>
                   <div style={{height:'10px'}}></div>

                   {settingLoading ? <div>
            <Skeleton animation= "wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            </div> : null }

            {settingLoading == false ? <div><div className={classes.balance}>
                 Settings last changed by: <span style={{fontWeight:'bold'}}> {props.globalSettings && props.globalSettings.editedBy && props.globalSettings.editedBy[props.globalSettings.editedBy.length-1] ? props.globalSettings.editedBy[props.globalSettings.editedBy.length-1].userId : null}</span>
                </div>

                   <div className={classes.balance}>
                Login Requirement: <span style={{fontWeight:'bold'}}> {props.globalSettings ? props.globalSettings.loginRequirement : null}</span>
                </div>
                <div className={classes.balance}>
                Proposal Requirement: <span style={{fontWeight:'bold'}}> {props.globalSettings ?  props.globalSettings.proposalRequirement :null}</span>
                </div></div>: null}

                   
                <div style={{height:'20px'}}></div>
                   <Button onClick={handleClickOpen} className={classes.checkbtn}>Change Setting</Button>

                   <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" >
                    <DialogTitle id="form-dialog-title">Change global settings</DialogTitle>
                    <form onSubmit={handleSubmitGlobal}>
                    <DialogContent >
                    
                    <TextField
                        
                        margin="dense"
                        id="loginreq"
                        label="Login Requirement"
                        type="text"
                        fullWidth
                        name="loginreq"
                        defaultValue={props.globalSettings ? props.globalSettings.loginRequirement : null}
                    />
                     <div style={{height:'10px'}}></div>
                    <TextField
                        
                        margin="dense"
                        id="proposalreq"
                        label="Proposal Requirement"
                        type="text"
                        fullWidth
                        name="proposalreq"
                        defaultValue={props.globalSettings ?  props.globalSettings.proposalRequirement :null}
                    />
                    <div style={{height:'10px'}}></div>
                    
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Update
                    </Button>
                    </DialogActions>
                    </form>
                </Dialog>
             



                
               
                    
        </div>
    )
}

export default connect(
    ({ auth, global }) => ({ currentUser: auth.currentUser, currentToken: auth.currentToken, globalSettings: global.globalSettings}),
    global.actions
  )(PofiReq);


