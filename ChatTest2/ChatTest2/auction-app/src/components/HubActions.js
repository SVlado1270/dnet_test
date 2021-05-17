import React from "react";
import * as signalR from "@microsoft/signalr";

export const CREATE_CONNECTION_SUCCESS = "create_connection_success";
export const CREATE_CONNECTION_FAIL = "create_connection_fail";

export const GET_CURRENT_CONNECTION = "get_current_connection";

export const DESTROY_CURRENT_CONNECTION = "get_current_connection";

const createConnection = (dispatch) => {
    const connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
    const createHubConnection = async () => {
        try {
            await connection.start()
            console.log('Connection successful!')
            dispatch({type: CREATE_CONNECTION_SUCCESS, payload: connection})
        } catch (err) {
            alert(err);
            console.log('Error while establishing connection: ' + {err})
            dispatch({type: CREATE_CONNECTION_SUCCESS, payload: err})
        }
    }
    createHubConnection();
};


const getConnection = (dispatch) => {
    dispatch({type: GET_CURRENT_CONNECTION, payload: {}})
}

const destroyConnection = (dispatch, connection) => {
    dispatch({type: DESTROY_CURRENT_CONNECTION, payload: connection})
}

export {
    createConnection,
    getConnection,
    destroyConnection
}