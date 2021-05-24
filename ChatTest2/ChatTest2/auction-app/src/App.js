import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from './pages/Home.js';
import Login from './pages/auth/Login.js';
import Register from "./pages/auth/Register";
import PrivateRoute from "./components/PrivateRoute";
import Room from "./pages/Room";
import HomeLayout from "./components/common/HomeLayout";
import {createBrowserHistory} from "history";
import {HubProvider} from "./components/HubContext";
import NewRooms from "./pages/NewRooms";
import hubInstance from "./utils/hubConnection";

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  font-family: 'Ubuntu', sans-serif;
`;

const history = createBrowserHistory();

function App() {
    const [hubConnection, setHubConnection] = useState(null);

    useEffect(() => {
        hubInstance.getInstance().getConnection().then((result) => {
            setHubConnection(result)
        })
    }, []);
    return (
        <AppWrapper>
            <HubProvider>
                <Router history={history}>
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/register" component={Register}/>
                        <HomeLayout>
                            <PrivateRoute component={Home} path="/" exact/>
                            <PrivateRoute component={() => <NewRooms hub={hubConnection}/>} path="/rooms" exact/>
                            <PrivateRoute component={() => <Room hub={hubConnection}/>} path="/room/:roomName" exact/>
                        </HomeLayout>
                    </Switch>
                </Router>
            </HubProvider>
        </AppWrapper>
    );
}


export default App;
