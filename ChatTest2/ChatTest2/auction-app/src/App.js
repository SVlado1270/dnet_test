import React from "react";
import styled, {ThemeProvider} from "styled-components";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Home from './pages/Home.js';
import Login from './pages/Login.js';

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
                  <Route exact path="/" component={Home}/>
                </Switch>
            </Router>
        </AppWrapper>
    );
}


export default App;
