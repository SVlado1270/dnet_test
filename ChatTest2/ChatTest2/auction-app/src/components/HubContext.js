import * as React from 'react'
import {useContext} from "react";
import {CREATE_CONNECTION_FAIL, CREATE_CONNECTION_SUCCESS, GET_CURRENT_CONNECTION} from "./HubActions";

const HubStateContext = React.createContext();
const HubDispatchContext = React.createContext();

function hubReducer(state, action) {
    switch (action.type) {
        case CREATE_CONNECTION_SUCCESS: {
            return {
                ...state,
                hubConnection: action.payload
            }
        }
        case CREATE_CONNECTION_FAIL: {
            return {
                ...state,
                error: action.payload
            }
        }
        case GET_CURRENT_CONNECTION: {
            return {
                ...state,
                hubConnection: action.payload
            }
        }
        default: {
            return state;
        }
    }
}

function HubProvider({children}) {
    const [state, dispatch] = React.useReducer(hubReducer, {hubConnection: {}})
    return (
        <HubStateContext.Provider value={state}>
            <HubDispatchContext.Provider value={dispatch}>
                {children}
            </HubDispatchContext.Provider>
        </HubStateContext.Provider>
    );
}

const useHubConnectionState = () => {
    const context = useContext(HubStateContext);
    if (context === undefined) {
        throw new Error("useHubConnectionState must be used within a HubProvider");
    }
    return context;
};

const useHubConnectionDispatch = () => {
    const context = useContext(HubDispatchContext);
    if (context === undefined) {
        throw new Error("useHubConnectionDispatch must be used within a HubProvider");
    }
    return context;
};

export {useHubConnectionDispatch, useHubConnectionState, HubProvider}