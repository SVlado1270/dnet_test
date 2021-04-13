import React, {useEffect} from "react";
import styled from "styled-components";
import {useParams} from "react-router-dom";
import hubConnection from "../components/HubConnection";
import {Button} from "antd";


export const PageTitle = styled.h1`
    align-text: center;
    color: #504f60;
`;

function Room() {
    let {roomName} = useParams();
    return (
        <>
            <PageTitle>Joined Room {roomName}</PageTitle>
        </>
    );
}

export default Room;
