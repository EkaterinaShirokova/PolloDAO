// created by sphinx
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";



// material components
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';


import './App.css';

// custom components
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'

// custom pages
import Discussions from 'pages/Discussions/Discussions'
import DiscussionInfo from 'pages/DiscussionInfo/DiscussionInfo'
import Members from 'pages/Members'
import Proposals from 'pages/Proposals'
import ProposalDetails from './pages/ProposalDetails';
import ProposalVote from './pages/ProposalVote';
import Profile from 'pages/Profile'
import Admin from 'pages/Admin/Admin'

//Protected Route
import ProtectedRoute from "components/ProtectedRoute";

//Admin Route
import AdminRoute from "components/AdminRoute";


import store, { persistor } from "./redux/store";
import ProposalForm from 'pages/ProposalForm';
import Trust from 'pages/Trust';
import { getalluser } from 'redux/Auth/authCrud';

import io from "socket.io-client";
import { SemipolarLoading } from 'react-loadingg';
import { themeColor, SOCKET_URI } from 'constant'
import { ConfirmProvider } from 'material-ui-confirm'
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));


export class RoutePaths {
    static Proposals = "/proposals";
    static ProposalDetails = "/Proposals/:id/details";
    static ProposalCreate = "/proposals/new";
    static ProposalEdit = "/proposal/edit/:id";
    static ProposalVote = "/proposal/vote/:id";
}



function App(props) {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const [loading, setLoading] = React.useState(true);
    const [allUserIds, setUserIds] = React.useState(null);
    const socket = io.connect();
    React.useEffect(() => {
        setLoading(true);
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
                    setUserIds(ids);
                    console.log("Success loading all users");
                    setLoading(false);

                } else {
                    console.log("Reading users failed!");
                }
            })
            .catch(() => {
                console.log("Reading users error!");
            });
    }

    return (
        <div className={classes.root}>
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <CssBaseline />
                    <ConfirmProvider>
                    <BrowserRouter>
                        {/* {loading && <SemipolarLoading size='large' color={themeColor} />}
                        {!loading && <> */}
                        <Header handleDrawerToggle={handleDrawerToggle} allUserIds={allUserIds} socket={socket}/>
                        <Sidebar
                            mobileOpen={mobileOpen}
                            handleDrawerToggle={handleDrawerToggle}
                        />
                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            <Switch>
                                <Route path="/" exact render={
                                    (props) => <Discussions {...props} allUserIds={allUserIds}/>}
                                />
                                <Route path="/DiscussionInfo" render={
                                    (props) => <DiscussionInfo {...props} allUserIds={allUserIds}/>}
                                />
                                <Route path="/Members" component={Members} />
                                <Route path="/Trust" component={Trust} />

                                <Route exact path={RoutePaths.Proposals} component={Proposals} />
                                <Route path={RoutePaths.ProposalDetails} render={
                                    (props) => <ProposalDetails {...props} socket={socket} />}
                                /> 
                                <Route path={RoutePaths.ProposalCreate} render={
                                    (props) => <ProposalForm {...props} socket={socket} />
                                }/>
                                <Route path={RoutePaths.ProposalEdit} render={
                                    (props) => <ProposalForm {...props} socket={socket} />
                                }/>
                                <Route path={RoutePaths.ProposalVote} component={ProposalVote} />

                                <ProtectedRoute exact path='/profile' component={Profile} />
                                <AdminRoute exact path='/admin' component={Admin} socket={socket}/>

                            </Switch>
                        </main>
                        {/* </>} */}
                    </BrowserRouter>
                    </ConfirmProvider>
                </PersistGate>
            </Provider>
        </div>
    );
}

App.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default App;
