import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import * as auth from "redux/Auth/authRedux";

const ProtectedRoute = ({ component: Component, props, ...rest }) => {
   var userModel = rest.currentUser ? rest.currentUser.userModel : null;
  return (
    <Route {...rest} render={
      props => {
        if (userModel) {
          return <Component {...rest} {...props} />
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
  )(ProtectedRoute);