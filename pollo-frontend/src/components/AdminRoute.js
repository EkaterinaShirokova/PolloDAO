import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import * as auth from "redux/Auth/authRedux";

const AdminRoute = ({ component: Component, socket, props, ...rest }) => {
   var userModel = rest.currentUser ? rest.currentUser.userModel : null;
   return (
    <Route {...rest} render={
      props => {
        if (userModel && userModel.userRole && (userModel.userRole == 'leader' || userModel.userRole == 'moderator')) {
          return <Component socket={socket} />
        } else {
          return <Redirect to={
            {
              pathname: '/',
              state: {
                from: props.location
              }
            }
          } />
        }
      }
    } />
  )
}


export default connect(
    ({ auth }) => ({ currentUser: auth.currentUser }),
    auth.actions
  )(AdminRoute);