import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { connect } from "react-redux";
import * as auth from "redux/Auth/authRedux";
import EditMembers from "pages/Admin/EditMembers";
import RestrictedUsers from "pages/Admin/RestrictedUsers";
import PofiReq from "pages/Admin/PofiReq"
import CustomRole from "pages/Admin/CustomRole"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
         {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabHeader:{
    boxShadow: 'none !important'
  },
  tabsHead:{
    color: 'black !important',
    paddingTop: '18px',
   

  },
}));

function Admin(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.tabHeader}>
        <Tabs className={classes.tabsHead} value={value} onChange={handleChange} aria-label="admin tabs" variant="scrollable">
          <Tab label="User Management" {...a11yProps(0)} />
          <Tab label="PoFi Requirement" {...a11yProps(1)} />
          
          <Tab label="Restricted Users" {...a11yProps(4)} />
          <Tab label="Custom Roles" {...a11yProps(3)} />
          
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <EditMembers socket={props.socket}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PofiReq></PofiReq>
      </TabPanel>
      
      <TabPanel value={value} index={2}>
        <RestrictedUsers></RestrictedUsers>
      </TabPanel>
      <TabPanel value={value} index={3}>
       <CustomRole></CustomRole>
      </TabPanel>
      
    </div>
  );
}

export default connect(
  ({ auth }) => ({ currentUser: auth.currentUser, allUsers: auth.allUsers, currentWallet: auth.currentWallet}),
  auth.actions
)(Admin);