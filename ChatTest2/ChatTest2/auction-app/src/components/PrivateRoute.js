import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import isLoggedIn from "../utils/auth";

const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            isLoggedIn() ?
                <Component {...props} />
                : <Redirect to="/login"/>
        )}/>
    );
};

export default PrivateRoute;