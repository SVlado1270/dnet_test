import React from "react";
import styled from "styled-components";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from './pages/Home.js';
import Login from './pages/auth/Login.js';
import Rooms from "./pages/Rooms";
import Register from "./pages/auth/Register";
import PrivateRoute from "./components/PrivateRoute";
import Room from "./pages/Room";
import HomeLayout from "./components/common/HomeLayout";
import {createBrowserHistory} from "history";

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  font-family: 'Ubuntu', sans-serif;
`;

const history = createBrowserHistory();

function App() {
    return (
        <AppWrapper>
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <HomeLayout>
                        <PrivateRoute component={Home} path="/" exact/>
                        <PrivateRoute component={Rooms} path="/rooms" exact/>
                        <PrivateRoute component={Room} path="/room/:roomName" exact/>
                    </HomeLayout>
                </Switch>
            </Router>
        </AppWrapper>
    );
}


export default App;
