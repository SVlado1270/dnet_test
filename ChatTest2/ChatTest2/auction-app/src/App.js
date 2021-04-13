import React from "react";
import styled from "styled-components";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Rooms from "./pages/Rooms";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/common/AppLayout";
import Room from "./pages/Room";

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  font-family: 'Ubuntu', sans-serif;
`;


function App() {
    return (
        <AppWrapper>
            <Router>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <AppLayout>
                        <PrivateRoute component={Home} path="/" exact/>
                        <PrivateRoute component={Rooms} path="/rooms" exact/>
                        <PrivateRoute component={Room} path="/room/:roomName" exact/>
                    </AppLayout>
                </Switch>
            </Router>
        </AppWrapper>
    );
}


export default App;
