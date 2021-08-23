import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Web3 from 'web3';
//material core
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Badge from '@material-ui/core/Badge';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';


import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Meta from 'assests/img/metamask.png';
import Binance from 'assests/img/binance.png';
import Toruslab from "assests/img/torus.png";
import Trust from "assests/img/trustwallet.png";


// material icons
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ContactsIcon from '@material-ui/icons/Contacts';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import TextsmsIcon from '@material-ui/icons/Textsms';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { getallpost } from 'redux/Post/postCrud'

import Pollo from 'assests/img/logo.png'
import { useMetamask } from "use-metamask";
import { connect } from "react-redux";
import {
  drawerWidth,
  themeColor,
} from 'constant'

import SlateEditor from './SlateEditor';
//import actions
import * as auth from "redux/Auth/authRedux";
import * as notification from "redux/Notification/notificationRedux";
import * as post from "redux/Post/postRedux";
import { signup, login, getUserByAddress, logout } from 'redux/Auth/authCrud';
import { createnewpost } from 'redux/Post/postCrud'
import { getBalance } from 'redux/Pofi/pofiCrud'
import { getGlobalSettings } from 'redux/GlobalSetting/globalCrud'
import {
  postNotification,
  getNotificationByUserId,
  readNotificationByIndex,
  markAsAllNotifications
} from 'redux/Notification/notificationCrud'

import { WALLET_TYPES } from '../utils/constants'
import { isUserModerateOrLeader, formatWalletAddress, getSignedMessage, getBSCSignedMessage } from '../utils';
import { getTorusWallet, getTrustWallet, getBSCWallet } from '../utils/wallets'




function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: themeColor,
    },
  },
}))(MenuItem);

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      marginLeft: drawerWidth,
      zIndex: 1250
    },
    display: 'flex',
    justifyContent: 'space-between',
  },
  appBars: {
    position: 'relative',
    backgroundColor: '#F87243 !important'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color:themeColor,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
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
    '&:hover': {
      backgroundColor: themeColor,
    },
  },
  controls: {
    
    textAlign: 'right',
    paddingRight: '20px',
    [theme.breakpoints.down('sm')]: {
      paddingRight: '0px',
    }
  },
  logoBar: {
    minHeight: '50px',
    

  },

  logo: {
    marginTop: '12px',
    height: '29px',
   
    paddingLeft: drawerWidth / 6,
    [theme.breakpoints.down('sm')]: {
      height: '18px',
      paddingLeft: 0,
      marginTop: '16px',
    }
  },
  modal: {
    display: 'flex',
    // right: "5%",
    // float: "right",
    // alignSelf: "right"
    justifyContent: 'center',
    alignItems: "center"
  },
  validation: {
    color: 'red',
    margin: 0,
  },
  itemContent: {
    alignSelf: 'center',
  },
  listitem: {
    borderRadius: 100,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 10,

  },
  connect: {
    backgroundColor: '#FDECE5',
    width: '280px',
    height: '220px',
    position: 'relative',
    
  },

  paper: {
    backgroundColor: theme.palette.background.paper,


    textAlign: 'center',
    width: "350px",
    height: "auto",


  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: "50px",
    paddingRight: "50px",
    fontWeight: "bold"
  },
  bottomtext: {
    paddingLeft: "50px",
    paddingBottom: "20px",
    textAlign: "center",
    cursor: "pointer"
  },
  listcursor: {
    cursor: "pointer"
  },
  listitemtext: {
    backgroundColor: "#fcebe6",
    borderRadius: "10px",
    marginBottom: "10px"

  },
  divhead:{
    display: 'flex',
    justifyContent:'space-between',
    [theme.breakpoints.down('sm')]:{
      justifyContent:'space-around',
      display:'flex',
      width:'100vw!important',
    }
    
  }

}));

function Header(props) {
  const socket = props.socket;
  const { connect, metaState } = useMetamask();
  const [values] = React.useState({
    userid: '@',
    userhandle: '',
  });

  const [subscribeModal, subscribeModalToggle] = React.useState(false);
  const [newThreadModal, newThreadModalToggle] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorNotifications, setAnchorNotifications] = React.useState(null);
  const [metamaskStatus, setMetamaskStatus] = React.useState(false);
  const [currentWalletTypes, setCurrentWalletTypes] = React.useState(props.currentWalletType?props.currentWalletType.type : undefined);
  const [currentAddress, setCurrentAddress] = React.useState('');

  const [elStatus, setStatusAway] = React.useState(false);
  const [elStatusBan, setStatusAwayBan] = React.useState(false);
  const [loginer, setLoginEr] = React.useState(false);
  const [emptyID, setEmptyID] = React.useState(false);
  const [emptyHandle, setEmptyHandle] = React.useState(false);
  const [postStatus, setPostStatus] = React.useState(false);
  const [lowerLoginBalance, setLowerLoginBalance] = React.useState(false);
  const [newNotification, setNewNotification] = React.useState(false);
  const [warningStatus, setWarningStatus] = React.useState(false);
  const [postExceed, setExceed] = React.useState(false);
  const [walletConnected, setWalletConnected] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [noties, setNoties] = React.useState(0);
  const [userBalance, setUserBalance] = React.useState(0);
  const [loginRequired, setLoginRequired] = React.useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const ethereum = window.ethereum;
  // getUserInformation from the Wallet Address

  const getUserInformation = (address, walletType) => {
    login(address)
    .then(function (response) {
      if (response.data.result === null) {
        if (walletType === WALLET_TYPES.METAMASK) {
          let from = address;
          const msgParams = getSignedMessage();
          let params = [from, msgParams];
          let method = 'eth_signTypedData_v4';
          ethereum.request({ method, params})
          .then((result) => {
            handleSubscribeOpen();
            console.log('TYPED SIGNED:' + JSON.stringify(result));
          })
          .catch((error) => {
              console.log(error);
          })
        }
        else if (walletType === WALLET_TYPES.BSCWALLET) {
          let from = address;
          const msgParams = getBSCSignedMessage();
          let params = [from, msgParams];
          let method = 'eth_sign';
          window.BinanceChain.request({ method, params})
          .then((result) => {
            handleSubscribeOpen();
            console.log('TYPED SIGNED:' + JSON.stringify(result));
          })
          .catch((error) => {
            console.log(error);
          })     
        }
        else if (walletType === WALLET_TYPES.TORUSWALLET) {
          const torusWallet = getTorusWallet();
          if (!torusWallet) return;
          let from = address;
          const msgParams = getSignedMessage();
          let params = [from, msgParams];
          let method = 'eth_signTypedData_v4';
          torusWallet.provider.request({ method, params})
          .then((result) => {
            handleSubscribeOpen();
            console.log('TYPED SIGNED:' + JSON.stringify(result));
          })
          .catch((error) => {
            console.log(error);
          }) 
        }
        else if (walletType === WALLET_TYPES.TRUSTWALLET) {
          const trustWallet = getTrustWallet();
          if (!trustWallet) return;
          let from = address;
          const msgParams = getSignedMessage();
          let params = [from, msgParams];
          trustWallet.signTypedData(params)
          .then((result) => {
            handleSubscribeOpen();
            console.log('TYPED SIGNED:' + JSON.stringify(result));
          })
          .catch((error) => {
            console.log(error);
          })
        }
      } else if (response.data.result) {
        props.setUser({ userModel: response.data.result });
        props.setToken({ token: response.data.result.token });
        if (socket)
          socket.emit("sign-in", response.data.result);
        props.setWallet({ address: response.data.result.address });
        props.setWalletType({ type: walletType });
        setWalletConnected(true);
        handleClose();
        getNotificationByUserId(response.data.result.token, response.data.result.userId)
        .then(({ data }) => {
          if (data.success) {
            setNoties(data.result.notifications)
            props.SetNotifications(data.result);
          }
        })
        getBalance(response.data.result.token, response.data.result.address).then(({ data }) => {
          let userBalance = data.result.totalUserBalance;
          getGlobalSettings(response.data.result.token).then(({ data }) => {
            setUserBalance(userBalance);
            setLoginRequired(data.result[0].loginRequirement);
            if (userBalance < data.result[0].loginRequirement) {
              setLowerLoginBalance(true);
              props.setUser(undefined);
              props.setToken(undefined);
              props.setWallet(undefined);
              props.setWalletType(undefined);
              setWalletConnected(false);
            }
          })
        })
      }                
    })
  }
  // Connecting To Torus Wallet
  const connectTorusWallet = async (e) => {
    e.preventDefault();
    try {
      let torusWallet = await getTorusWallet();
      await torusWallet.login();
      // torusWallet.showWallet();
      const web3 = new Web3(torusWallet.provider);
      const result = await web3.eth.getAccounts();
      if (result.length > 0) {
        let address = result[0];
        setCurrentWalletTypes(WALLET_TYPES.TORUSWALLET);
        setCurrentAddress(address);
        getUserInformation(address, WALLET_TYPES.TORUSWALLET);  
      } else {
        alert("Torus Connection Error");
      }
    } catch(err) {
      console.log(err);
      alert("Please install Torus Wallet.");
    }
  };

  const connectBSCWallet =  async (e) => {
    try {
      let bscWallet = await getBSCWallet();
      await bscWallet.activate();
      let address = await bscWallet.getAccount();
      setCurrentAddress(address);
      setCurrentWalletTypes(WALLET_TYPES.BSCWALLET);
      getUserInformation(address, WALLET_TYPES.BSCWALLET);
    } catch(error) {
      alert("Please install Binance Smart Chain Wallet.");
    }
  }
  const connectTrustWallet = async (e) => {
    try {
      let trustWallet = await getTrustWallet();
      if (!trustWallet.connected) {
        trustWallet.createSession();
        trustWallet.on("connect", (error, payload) => {
          if (error) {
            throw error;
          }
        
          // Get provided accounts and chainId
          const { accounts, chainId } = payload.params[0];
          if (accounts.length > 0) {
            let address = accounts[0];
            setCurrentWalletTypes(WALLET_TYPES.TRUSTWALLET);
            setCurrentAddress(address);
            getUserInformation(address, WALLET_TYPES.TRUSTWALLET);    
          } else {
            alert("Trust Wallet Connection Error");
          }
        });
      } else {
        const request = trustWallet._formatRequest({
          method: 'get_accounts',
        });
      
        trustWallet
          ._sendCallRequest(request)
          .then(result => {
            // Returns the accounts
            if (result.length > 0) {
              let address = result[0].address;
              setCurrentWalletTypes(WALLET_TYPES.TRUSTWALLET);
              setCurrentAddress(address);
              getUserInformation(address, WALLET_TYPES.TRUSTWALLET);    
            } else {
              alert("Trust Wallet Connection Error");
            }
          })
          .catch(error => {
            // Error returned when rejected
            console.error(error);
          });
      }
      trustWallet.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }
        // Delete connector
        props.setUser(undefined);
        props.setWallet(undefined);
        props.setWalletType(undefined);
        props.setToken(undefined);
        setWalletConnected(false);
      });
      
    } catch(error) {
      alert("Please install Trust Wallet.");
    }
  }

  const connectMetaMask = async(e) => {
    if (metaState.isAvailable) {
      (async () => {
        try {
          if (!metaState.isConnected) {
            await connect(Web3);
          }
            setCurrentAddress(ethereum.selectedAddress);
            setCurrentWalletTypes(WALLET_TYPES.METAMASK);
            getUserInformation(ethereum.selectedAddress, WALLET_TYPES.METAMASK);    
        } catch (error) {
          console.log(error);
        }
      })();
    } else if (metaState.isAvailable === false) {
      console.log("Metamask");
      setMetamaskStatus(true);
    }
  }
  React.useEffect(() => {
    if ((props.currentUser && (props.currentUser.selectedAddress || props.currentUser.userModel)) &&
        (props.currentWalletType && props.currentWalletType.type) && props.currentToken) {
      setCurrentWalletTypes(props.currentWalletType.type);
      getUserByAddress(props.currentToken.token, props.currentUser.userModel.address)
      .then(function (response) {
        if (response.data.result) {
          props.setUser({ userModel: response.data.result });
          if (socket)
            socket.emit("sign-in", response.data.result);
          props.setWallet({ address: response.data.result.address });
          props.setWalletType({ type: props.currentWalletType.type });
          setWalletConnected(true);
          handleClose();
          getNotificationByUserId(props.currentToken.token, response.data.result.userId)
          .then(({ data }) => {
            if (data.success) {
              setNoties(data.result.notifications)
              props.SetNotifications(data.result);
            }
          })
          getBalance(props.currentToken.token, response.data.result.address).then(({ data }) => {
            let userBalance = data.result.totalUserBalance;
            getGlobalSettings(props.currentToken.token).then(({ data }) => {
              if (userBalance < data.result[0].loginRequirement) {
                setLowerLoginBalance(true);
                props.setUser(undefined);
                props.setToken(undefined);
                props.setWallet(undefined);
                props.setWalletType(undefined);
                setWalletConnected(false);
              }
            })
          })
        }
      })
    } else {
      props.setUser(undefined);
      props.setWallet(undefined);
      props.setWalletType(undefined);
      props.setToken(undefined);
      setWalletConnected(false)
    }
  }, []);

  React.useEffect(() => {
    initSocketConnection();
    setupSocketListeners();
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    console.log("loadNotifications")
    if (props.currentUser && props.currentUser.userModel && props.currentToken && props.currentToken.token)
      getNotificationByUserId(props.currentToken.token, props.currentUser.userModel.userId)
        .then(({ data }) => {
          if (data.success) {
            setNoties(data.result.notifications)
            props.SetNotifications(data.result);
          }
        })
  }

  const initSocketConnection = () => {
    console.log("initSocketConnection")
    if (props.currentUser && props.currentUser.userModel && socket)
      socket.emit("sign-in", props.currentUser.userModel);
  }


  // notification: title of the new Thread
  // from: the userId of the person who posted for you
  const onNewThreadReceived = (notification, from) => {
    if (props.currentUser && props.currentUser.userModel && props.currentToken && props.currentToken.token) {
      getNotificationByUserId(props.currentToken.token, props.currentUser.userModel.userId)
        .then(({ data }) => {
          if (data.success) {
            setNewNotification(true);
            setNoties(data.result.notifications)
            props.SetNotifications(data.result);
          }
        })
      }
  }
  const setupSocketListeners = () => {
    socket.on("newThread", onNewThreadReceived.bind(this));
  }

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifications = (event) => {
    setAnchorNotifications(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsMenuClose = () => {
    setAnchorNotifications(null);
  };

  const handleSubscribeOpen = () => {
    subscribeModalToggle(true);
  };

  const handleSubscribeClose = (e) => {

    subscribeModalToggle(false);
  };

  const checkValues = (e) => {
    let ret = true;
    if (e.target.userid.value === '' || e.target.userid.value === '@') {
      setEmptyID(true);
      ret = false;
    }
    if (e.target.userhandle.value === '') {
      setEmptyHandle(true);
      ret = false;
    }
    console.log(ret)
    return ret;
  };

  const registerUser = (e) => {
    e.preventDefault();
    if (!checkValues(e)) return;

    signup(currentAddress, e.target.userid.value.toLowerCase(), e.target.userhandle.value, "", "", "")
      .then(function (response) {
        if (response.data.result != null) {
          getUserInformation(currentAddress, currentWalletTypes);
        } else {
          props.setUser(undefined);
          props.setWallet(undefined);
          props.setWalletType(undefined);
          props.setToken(undefined);
          setWalletConnected(false);
          handleClose();
        }
      })

    subscribeModalToggle(false);
  }
  const handleSignOut = async(e) => {
    if (props.currentWalletType.type === WALLET_TYPES.TRUSTWALLET) {
      let trustWallet = await getTrustWallet();
      if (trustWallet.isConnected)
        trustWallet.killSession();
    }
    if (props.currentWalletType.type === WALLET_TYPES.TORUSWALLET) {
      let torusWallet = await getTorusWallet();
      torusWallet.logout();
    }
    if (props.currentWalletType.type === WALLET_TYPES.BSCWALLET) {
      let bscWallet = await getBSCWallet();
      bscWallet.deactivate();
    }
    // logout(props.currentToken.token, props.currentUser.userModel.address);
    props.setUser(undefined);
    props.setWallet(undefined);
    props.setWalletType(undefined);
    props.setToken(undefined);
    setWalletConnected(false);
  }
  const setMetamaskStatusAway = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMetamaskStatus(false);
  };

  const setPostStatusAway = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMetamaskStatus(false);
    setPostStatus(false)
  };
  const setStatusAwayPost = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setStatusAway(false);
  };

  const setStatusAwayPostBan = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setStatusAwayBan(false);
  };
  const setLoginErPost = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setLoginEr(false);
  };
  const setWarningStatusAway = (event, reason) => {
    
    setWarningStatus(false);
    
  };
  const setPostExceed = (event, reason) => {
    
    setExceed(false);
  };

  const setLoginBalance = (event, reason) => {
    setLowerLoginBalance(false);
  }

  const handleNewThreadOpen = () => {
    if (props.currentUser.userModel.userHandle === '') {
      newThreadModalToggle(false);
      setStatusAway(true);
      subscribeModalToggle(true);
    } else if (parseInt(props.currentUser.userModel.banLevel) > 0) {
      newThreadModalToggle(false);
      setStatusAwayBan(true);

    } else {
      newThreadModalToggle(true);
    }

  };

  const handleNewThreadClose = () => {
    // if(e.key === 'Escape'){
    //   return
    // }
    newThreadModalToggle(false);
  };

  const onSubmitThread = (title, content, file) => {
    if(title.length > 100 || content.length > 10000){
      setExceed(true);
      return;
    }
    handleNewThreadClose();
    try {
      var formdata = new FormData();
      formdata.append('postfile', file);
      formdata.append('title', title);
      formdata.append('address', props.currentUser.userModel.address);
      formdata.append('body', content[0].children[0].text);
      formdata.append('userHandle', props.currentUser.userModel.userHandle);

      if (props.currentUser && props.currentUser.userModel && props.currentUser.userModel.address) {
        createnewpost(props.currentToken.token , formdata)
          .then(res => {
            emitToTargetUsers(title + ' ' + content[0].children[0].text, title, '/DiscussionInfo/' + res.data.result._id); // merged title + content string to avoid duplicate the Id.
            setPostStatus(true);
            getallpost()
            .then(function (response){
            props.SetPosts(response.data.result);
          })
          });
      }
    }
    catch (error) {

    }
  }

  const getTargetUserID = (srcString) => {
    let startIndex = srcString.indexOf('@');
    let endIndex;
    let userList = [];
    while (startIndex > -1) {
      let spacePos = srcString.indexOf([' '], startIndex);
      let commaPos = srcString.indexOf([','], startIndex);
      if (spacePos > -1 && commaPos > -1)
        endIndex = Math.min(spacePos, commaPos);
      else
        endIndex = Math.max(spacePos, commaPos);

      userList.push(srcString.substr(startIndex, endIndex - startIndex));
      srcString = srcString.substr(endIndex);
      startIndex = srcString.indexOf('@');
    }

    return userList;
  }

  const emitToTargetUsers = (srcString, title, link) => {
    let userList = getTargetUserID(srcString + ' ');
    userList = removeInvalidUsers(userList);
    if (userList.length && props.currentUser && props.currentUser.userModel && props.currentToken && props.currentToken.token) {
      let notificationTitle = props.currentUser.userModel.userId + " mentioned you in a post.";
      userList.map(userId => {
        postNotification(props.currentToken.token, userId, notificationTitle, link, props.currentUser.userModel.userId)
        .then(({ data }) => {
          socket.emit("newThread",
          {
            userList: [ userId ],
            content: notificationTitle,
            from: props.currentUser.userModel.userId,
            link: link
          });
        })
      })
    }
  }

  const removeInvalidUsers = (data) => {
    let uniques = data.filter((value, index) => data.indexOf(value) === index);
    if (uniques.indexOf('@All') >= 0 || uniques.indexOf('@all') >= 0)
      return props.allUserIds.filter(userId => userId !== props.currentUser.userModel.userId);

    let ids = [];
    for (const userId of uniques)
      if (props.allUserIds.includes(userId.toLowerCase()))
        ids.push(userId);
    ids = ids.filter(userId => userId !== props.currentUser.userModel.userId.toLowerCase());
    return ids;
  }

  const readAllNotifications = () => {
    if (props.currentUser) {
      markAsAllNotifications(props.currentToken.token, props.currentUser.userModel.userId)
        .then(result => {
          if (result.data.success) {
            getNotificationByUserId(props.currentToken.token ,props.currentUser.userModel.userId)
              .then(({ data }) => {
                if (data.success) {
                  handleNotificationsMenuClose();
                  setNoties(data.result.notifications)
                  props.SetNotifications(data.result);
                }
              })
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  const handleClickWalletAddress = (event) => {
    const el = document.createElement('textarea');
    el.value = props.currentWallet.address;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  const handleNotificationItem = (notification, index) => {
    if (props.currentUser && props.currentUser.userModel.userId) {
      readNotificationByIndex(props.currentUser.userModel.userId, index)
        .then(result => {
          if (result.data.success) {
            getNotificationByUserId(props.currentToken.token, props.currentUser.userModel.userId)
              .then(({ data }) => {
                if (data.success) {
                  handleNotificationsMenuClose();
                  setNoties(data.result.notifications)
                  props.SetNotifications(data.result);
                  props.history.push(notification.link);
                }
              })
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  const renderNotifications = () => {
    if (props.notifications && props.notifications.notification_data)
      return props.notifications.notification_data.map((notification, index) => {
        if (notification.isRead === false)
          return <StyledMenuItem onClick={() => handleNotificationItem(notification, index)} key={`${notification.link}-${index}`}>
            <ListItemIcon>
              <TextsmsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={notification.title} />
          </StyledMenuItem>
      })
  }

  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <>
      <AppBar  className={classes.appBar} style={{ backgroundColor: 'headerColor', boxShadow: 'none', borderBottom: '2px solid rgba(133, 133, 133, 0.1)' }}>
        <Toolbar className={classes.divhead}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={props.handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <a href='/'>
          <div className={classes.logoBar} >
            <img className={classes.logo} src={Pollo} alt="logo" />
          </div>
          </a>
          <div className={classes.controls}>
            {walletConnected === true ? <IconButton aria-label="Wallet Icon" onClick={handleClickWalletAddress}>              
              <div>{props.currentWalletType && props.currentWalletType.type === WALLET_TYPES.METAMASK?<img src={Meta} alt="" width='25px'/> : ''}
              {props.currentWalletType && props.currentWalletType.type === WALLET_TYPES.TORUSWALLET?<img src={Toruslab} alt="" width='25px'/> : ''}
              {props.currentWalletType && props.currentWalletType.type === WALLET_TYPES.TRUSTWALLET?<img src={Trust} alt="" width='25px'/> : ''}
              {props.currentWalletType && props.currentWalletType.type === WALLET_TYPES.BSCWALLET?<img src={Binance} alt="" width='25px'/> : ''}
              {props.currentWallet && props.currentWallet.address?<p style={{ fontSize: '12px', color: themeColor, fontWeight: 'bold', margin:0 }}>{formatWalletAddress(props.currentWallet.address)}</p>:''}</div>
            </IconButton> : null}
            {walletConnected === true ? <IconButton aria-label="New Thread" onClick={handleNewThreadOpen}>
              <PostAddIcon style={{ color: themeColor }} />
            </IconButton> : null}
            {walletConnected === true ? <IconButton aria-label="Notifications" onClick={handleNotifications}>
              <Badge badgeContent={parseInt(noties) < 0 ? 0 :parseInt(noties) } color="secondary">
                <NotificationsIcon style={{ color: themeColor }} />
              </Badge>
            </IconButton> : null}
            {walletConnected === true ? <IconButton
              aria-label="User"
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              onClick={handleUserMenuClick}
            >
              <PersonIcon style={{ color: themeColor }} />
              {props.currentUser?<p style={{ fontSize: '12px', color: themeColor, fontWeight: 'bold', paddingLeft: 4 }}>{props.currentUser.userModel.userId}</p>:''}
            </IconButton> : null}
            {walletConnected === false ?
              <Button variant="contained" onClick={handleOpen} className={classes.primary} disableElevation>
                <ExitToAppIcon fontSize="small" /> Connect
          </Button> : null}
          </div>
        </Toolbar>

        <Dialog open={subscribeModal} onClose={handleSubscribeClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Register</DialogTitle>
          <form onSubmit={e => { registerUser(e) }}>
            <DialogContent>
              <DialogContentText>

              </DialogContentText>

              <FormControl fullWidth className={classes.margin} variant="outlined">


                <TextField
                  disabled
                  id="metmaskid"
                  name="metmaskid"
                  label={currentWalletTypes}
                  defaultValue={currentAddress}
                  variant="outlined"
                />
                <div style={{ height: '20px' }}></div>
                <TextField
                  id="userid"
                  label="User id*"
                  name="userid"
                  defaultValue={values.userid}
                  variant="outlined"
                  onKeyDown={() => setEmptyID(false)}
                />
                {emptyID && <p className={classes.validation}>Input your ID.</p>}
                <div style={{ height: '20px' }}></div>
                <TextField
                  id="userhandle"
                  label="User handle*"
                  name="userhandle"
                  defaultValue={values.userhandle}
                  variant="outlined"
                  onKeyDown={() => setEmptyHandle(false)}
                />
                {emptyHandle && <p className={classes.validation}>Input your handle.</p>}
                <div style={{ height: '20px' }}></div>


              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button style={{ width: '131.3px' }} variant="contained" onClick={handleSubscribeClose} className={classes.primary} disableElevation>
                Cancel
              </Button>
              <Button variant="contained" type="submit" className={classes.primary} disableElevation>
                Register
              </Button>
            </DialogActions>
          </form>
          <div style={{ height: '20px' }}></div>
        </Dialog>

        <Dialog fullScreen open={newThreadModal} onClose={handleNewThreadClose} TransitionComponent={Transition} BackdropComponent={Backdrop} BackdropProps={{
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
                onSubmit={onSubmitThread} userids={props.allUserIds}
              />
            </Fade>
          </List>
        </Dialog>

        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
        >
          {walletConnected === true ? <a style={{ color: 'black', textDecoration: 'none' }} href="/profile"><StyledMenuItem >
            <ListItemIcon>
              <ContactsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Profile" />

          </StyledMenuItem></a> : null}
          {walletConnected === true && isUserModerateOrLeader(props.currentUser)? <a style={{ color: 'black', textDecoration: 'none' }} href="/admin"> <StyledMenuItem >
            <ListItemIcon>
              <MeetingRoomIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Admin Pannel" />
          </StyledMenuItem></a> : null}
          {walletConnected === true ? <StyledMenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <MeetingRoomIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </StyledMenuItem> : null}
        </StyledMenu>
        {props.currentUser? <StyledMenu
          id="notifications-menu"
          anchorEl={anchorNotifications}
          keepMounted
          open={Boolean(anchorNotifications)}
          onClose={handleNotificationsMenuClose}
        >
          {props.notifications && props.notifications.isRead === false && <StyledMenuItem onClick={readAllNotifications} style={{ color: 'red' }}>
            <ListItemIcon>
              <DoneAllIcon fontSize="small" style={{ color: 'red' }} />
            </ListItemIcon>
            <ListItemText primary="Mark all as read" />
          </StyledMenuItem>}

          {props.notifications && props.notifications.isRead === true && <StyledMenuItem onClick={handleNotificationsMenuClose}>
            <ListItemText primary="You don't have any notifications." />
          </StyledMenuItem>}

          {renderNotifications()}
        </StyledMenu>:''}

      </AppBar>
      <Snackbar open={postStatus} autoHideDuration={6000} onClose={setPostStatusAway}>
        <Alert style={{ backgroundColor: '#4caf50' }} onClose={setPostStatusAway} severity="success">
          Your Post has been sucessfully saved
        </Alert>
      </Snackbar>

      <Snackbar open={newNotification} autoHideDuration={6000} onClose={() => setNewNotification(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert style={{ backgroundColor: '#4caf50' }} onClose={() => setNewNotification(false)} severity="success">
          +1 new notification
        </Alert>
      </Snackbar>

      <Snackbar open={warningStatus} autoHideDuration={6000} onClose={setWarningStatusAway}>
        <Alert onClose={setWarningStatusAway} severity="warning">
          Your Post has been sucessfully saves
        </Alert>
      </Snackbar>
      <Snackbar open={postExceed} autoHideDuration={6000} onClose={setPostExceed}>
        <Alert onClose={setPostExceed} severity="warning">
          Your post or content character length exceed please make it less 
        </Alert>
      </Snackbar>
      <Snackbar open={lowerLoginBalance} autoHideDuration={6000} onClose={setLoginBalance}>
        <Alert onClose={setLoginBalance} severity="warning">
          Your PoFi balance {userBalance} is lower than minimum balance {loginRequired} required for login 
        </Alert>
      </Snackbar>
      <Snackbar open={metamaskStatus} autoHideDuration={6000} onClose={setMetamaskStatusAway}>
        <Alert onClose={setMetamaskStatusAway} severity="error">
          Your browser does not have MetaMask
        </Alert>
      </Snackbar>
      <Snackbar open={elStatus} autoHideDuration={6000} onClose={setStatusAwayPost}>
        <Alert onClose={setStatusAwayPost} severity="error">
          Please Update your profile before posting
        </Alert>
      </Snackbar>
      <Snackbar open={elStatusBan} autoHideDuration={6000} onClose={setStatusAwayPostBan}>
        <Alert onClose={setStatusAwayPostBan} severity="error">
          Your are banned for posting
        </Alert>
      </Snackbar>
      <Snackbar open={loginer} autoHideDuration={6000} onClose={setLoginErPost}>
        <Alert onClose={setLoginErPost} severity="error">
          Please Log out from Metamask
        </Alert>
      </Snackbar>
      <Snackbar open={metamaskStatus} autoHideDuration={6000} onClose={setMetamaskStatusAway}>
        <Alert onClose={setMetamaskStatusAway} severity="error">
          Your browser does not have MetaMask
        </Alert>
      </Snackbar>
      {/* Modal Login */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h1 >Connect to a Wallet</h1>
            <Divider />
            <div className={classes.demo}>
              <List >
                <div className={classes.listitemtext} onClick={connectMetaMask}>
                  <ListItem button>

                    <ListItemText className={classes.listcursor}

                    >Metamask</ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <img src={Meta} alt="" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem></div><div className={classes.listitemtext} onClick={connectTrustWallet}>
                  <ListItem button>

                    <ListItemText

                    >Trustwallet</ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <img src={Trust} alt="" width="32px" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem></div><div className={classes.listitemtext} onClick={connectBSCWallet}>
                  <ListItem button>

                    <ListItemText

                    >Binance Smart Chain</ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <img src={Binance} alt="" width="32px" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem></div><div className={classes.listitemtext} onClick={connectTorusWallet} ><ListItem cursor="pointer" button>

                    <ListItemText className={classes.listcursor} aria-label="torus" >Torus</ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="torus">
                        <img src={Toruslab} alt="" width="32px" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem></div>

              </List>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default connect(
  ({ auth, wallet, notification, post }) => ({ currentUser: auth.currentUser, currentWallet: auth.currentWallet, currentWalletType: auth.currentWalletType, currentToken: auth.currentToken, notifications: notification.notifications, posts: post.posts }),
  { ...auth.actions, ...notification.actions, ...post.actions}
)(withRouter(Header));