import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useParams} from "react-router-dom";
import ChatBox from "../components/ChatBox";
import AddMessageBox from "../components/AddMessageBox";
import {Button, Col, Row, Space} from "antd";
import ConnectedUserBox from "../components/ConnectedUserBox";
import {useHistory} from "react-router";

export const PageTitle = styled.h1`
    align-text: center;
    color: #504f60;
`;

export const ChatContainer = styled.div`
    width: 80%;
    position: relative;
    padding: 15px;
`;

export const AddMesageArea = styled.div`
    height: 10%;
`;

export const MessagesArea = styled.div`
    max-height: 600px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
     display: none;
   }
`;

export const ConnectedUsersContainer = styled.div`
    border: 1px solid lightgrey;
    width: 20%;
    padding: 15px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
     display: none;
   }
`;


function Room({hub}) {
    const history = useHistory();
    let {roomName} = useParams();
    const [hubConnection, setHubConnection] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);

    useEffect(() => {
        if (hub) {
            setHubConnection(hub);
            getConnectedUsersInRoom(hub);
        }
    }, []);

    const getConnectedUsersInRoom = (connection) => {
        connection.invoke("GetAllUsersInRoom", roomName).then(result => {
            setConnectedUsers(result.map((user) => ({
                username: user.username,
                fullName: user.fullName,
                userId: user.id
            })))
        });
    }

    const handleLeaveRoom = () => {
        leaveRoom(roomName);
        history.push("/rooms")
    }
    const leaveRoom = async (roomName) => {
        await hubConnection.invoke("LeaveRoom", roomName, localStorage.getItem("username"));
    }
    return (
        <>
            <Space size={50}>
                <PageTitle>Joined Room: <strong>{roomName}</strong> </PageTitle>
                <Button type="primary" onClick={handleLeaveRoom}>Leave Room</Button>
            </Space>
            <Row>
                <ChatContainer>
                    <MessagesArea>
                        <Row>
                            <Col span={12}>
                                <ChatBox hasAvatar={true}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <ChatBox hasAvatar={true}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <ChatBox hasAvatar={true}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={12}>
                                <ChatBox/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <ChatBox hasAvatar={true}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={12}>
                                <ChatBox/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <ChatBox hasAvatar={true}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={12}>
                                <ChatBox/>
                            </Col>
                        </Row>
                    </MessagesArea>
                    <AddMesageArea>
                        <AddMessageBox/>
                    </AddMesageArea>
                </ChatContainer>
                <ConnectedUsersContainer>
                    {connectedUsers.length > 0 ? connectedUsers.map((connectedUser) => <ConnectedUserBox
                        key={connectedUser.userId}
                        username={connectedUser.username} fullName={connectedUser.fullName}/>) : null}
                </ConnectedUsersContainer>
            </Row>
        </>
    );
}

export default Room;
