import React from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import { connect } from "react-redux";
import * as auth from "redux/Auth/authRedux";

import Torus from "@toruslabs/torus-embed";
import { BscConnector } from '@binance-chain/bsc-connector'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Meta from 'assests/img/metamask.png';
import Binance from 'assests/img/binance.png';
import Toruslab from "assests/img/torus.png";
import Trust from "assests/img/trustwallet.png";
// material core
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Box from "@material-ui/core/Box";

// material icons
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import SupervisorAccountRoundedIcon from '@material-ui/icons/SupervisorAccountRounded';
import FeaturedPlayListRoundedIcon from '@material-ui/icons/FeaturedPlayListRounded';
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';

import { drawerWidth, themeColor } from 'constant'
import person from 'assests/img/person.png'
import Portis from "@portis/web3";
const useStyles = makeStyles((theme) => ({
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
        border: '0px',
        textAlign: 'center',
        paddingTop: drawerWidth / 5,
    },
    smDrawerPaper: {
        width: drawerWidth * 0.6,
        border: '0px',
        textAlign: 'center',
        paddingTop: drawerWidth / 5,
    },
    selectedIcon: {
        color: themeColor,
    },
    defaultIcon: {
        color: '#9A9A9A',
        paddingLeft: '5px'
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
    person: {
        position: 'absolute',
        height: '200px',
        bottom: '90px',
        left: '34px',
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
        position: 'absolute',
        bottom: '25px',
        left: '72px',
        '&:hover': {
            backgroundColor: themeColor,
        },
    },
    modal: {
        display: 'flex',
        // right: "5%",
        // float: "right",
        // alignSelf: "right"
        justifyContent: 'center',
        alignItems: "center"
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
    socialmedia:{

        width:'100%',
        height:'100px',
        paddingTop:'10px',
        
    },

}));



function Sidebar(props) {
    const { window } = props;
    const theme = useTheme();
    const classes = useStyles(theme);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const bsc = new BscConnector({
        supportedChainIds: [56, 97] // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
    })
    const Web3 = require('web3');
    async function handleClickSmart() {
        await bsc.activate();
        await bsc.getAccount();
        await bsc.getChainId();
        const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
        // const loader = setupLoader({ provider: web3 }).web3;

        const account = web3.eth.accounts.create();
        console.log(account);
    }
    const handleClick = async (e) => {
        const portis = new Portis('0919f195-49e5-4ee5-89aa-4325338d97b5', 'mainnet');
        const web3 = new Web3(portis.provider);
        web3.eth
            .getAccounts()
            .then(accounts => console.log(accounts))
            .catch(error => console.log(error));

    }


    const onClickLogin = async (e) => {
        e.preventDefault();

        const torus = new Torus({});
        await torus.init({
            enableLogging: false,
        });
        await torus.login();

        const web3 = new Web3(torus.provider);
        const address = (await web3.eth.getAccounts())[0];
        const balance = await web3.eth.getBalance(address);

    };


    const drawer = (
        <div className={classes.itemContent}>
            <List style={{ marginBottom: '100px' }}>
                <ListItem className={classes.listitem}
                    button key='Discussions' component={Link} to={"/"}
                    selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, 0)}
                >
                    <ListItemIcon>
                        {selectedIndex === 0 ? <ChatRoundedIcon className={classes.selectedIcon}></ChatRoundedIcon> : <ChatRoundedIcon className={classes.defaultIcon}></ChatRoundedIcon>}
                    </ListItemIcon>
                    <ListItemText primary="Discussions" style={{ paddingLeft: '10px' }} />
                </ListItem>
                <div className={classes.space}></div>
                <ListItem
                    key='Members' component={Link} to={"/Members"}
                    button
                    selected={selectedIndex === 1} className={classes.listitem}
                    onClick={(event) => handleListItemClick(event, 1)}
                >
                    <ListItemIcon>
                        {selectedIndex === 1 ? <SupervisorAccountRoundedIcon className={classes.selectedIcon}></SupervisorAccountRoundedIcon> : <SupervisorAccountRoundedIcon className={classes.defaultIcon}></SupervisorAccountRoundedIcon>}
                    </ListItemIcon>
                    <ListItemText primary="Members" style={{ paddingLeft: '10px' }} />
                </ListItem>
                <div className={classes.space}></div>
                <ListItem
                    button
                    key='Proposals' component={Link} to={"/Proposals"}
                    selected={selectedIndex === 2} className={classes.listitem}
                    onClick={(event) => handleListItemClick(event, 2)}
                >
                    <ListItemIcon>
                        {selectedIndex === 2 ? <FeaturedPlayListRoundedIcon className={classes.selectedIcon}></FeaturedPlayListRoundedIcon> : <FeaturedPlayListRoundedIcon className={classes.defaultIcon}></FeaturedPlayListRoundedIcon>}
                    </ListItemIcon>
                    <ListItemText primary="Proposals" style={{ paddingLeft: '10px' }} />
                </ListItem>
                <div className={classes.space}></div>
               
            </List>
            <div className={classes.connect}>
                <img className={classes.person} src={person} alt="fireSpot" />
                <div className={classes.button}>
                    {props.currentUser && props.currentUser.userModel ? null : <Button variant="contained" onClick={handleOpen} className={classes.primary} disableElevation>
                        Connect
                    </Button> }

                    

                    
                </div>
                
            </div>
            <div style={{height:'10px'}}></div>
            <div  className={classes.socialmedia}>
            <a href="https://twitter.com/financepollo?lang=en">
            <IconButton style={{color:themeColor, cursor: 'pointer'}} aria-label="delete">
                <TwitterIcon />
            </IconButton>
            </a>
            <a href="https://t.me/pollofi">
            <IconButton style={{color:themeColor, cursor: 'pointer'}} aria-label="delete">
                <TelegramIcon />
            </IconButton>
            </a>

            </div>

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
                                <div className={classes.listitemtext} >
                                    <ListItem button>

                                        <ListItemText className={classes.listcursor}

                                        >Metamask</ListItemText>
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete">
                                                <img src={Meta} alt="" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem></div><div className={classes.listitemtext} onClick={handleClick}>
                                    <ListItem button>

                                        <ListItemText

                                        >Trustwallet</ListItemText>
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete">
                                                <img src={Trust} alt="" width="32px" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem></div><div className={classes.listitemtext} onClick={handleClickSmart}>
                                    <ListItem button>

                                        <ListItemText

                                        >Binance Smart Chain</ListItemText>
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete">
                                                <img src={Binance} alt="" width="32px" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem></div><div className={classes.listitemtext} onClick={onClickLogin} ><ListItem cursor="pointer" button>

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
        </div>

    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={props.mobileOpen}
                    onClose={props.handleDrawerToggle}
                    classes={{
                        paper: classes.smDrawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    )
}

export default connect(
    ({  auth }) => ({ currentUser: auth.currentUser}),
    null
)(Sidebar);
