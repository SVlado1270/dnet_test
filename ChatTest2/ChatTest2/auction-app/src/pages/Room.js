import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useParams} from "react-router-dom";
import ChatBox from "../components/ChatBox";
import AddMessageBox from "../components/AddMessageBox";
import {Button, Col, Row, Space, message} from "antd";
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
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (hub) {
            setHubConnection(hub);
            hub.on("addUser", () => {
                getConnectedUsersInRoom(hub);
            })
            hub.on("onUserLeave", () => {
                getConnectedUsersInRoom(hub);
            })
            hub.on("onRoomDeleted", (mess) => {
                message.destroy()
                message.error(mess, 2)
                history.push('/rooms');
            })
            hub.on("leftRoom", () => {
                history.push("/rooms");
            })
            hub.on("onMessageSend", (messageContent) => {
                getMessages(roomName, hub);
            })
            hub.on("onMessageSendSuccess", async () => {
                await hub.invoke("GetMessagesFromRoom", roomName).then((result) => {
                    setMessages(result);
                });
            })
        }
    }, []);

    useEffect(() => {
        if (hubConnection) {
            getConnectedUsersInRoom(hubConnection);
            getMessages(roomName, hubConnection);
        }
    }, [hubConnection])

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
    }
    const leaveRoom = async (roomName) => {
        await hubConnection.invoke("LeaveRoom", roomName, localStorage.getItem("username"));
    }

    const getMessages = async (roomName, connection) => {
        await connection.invoke("GetMessagesFromRoom", roomName).then((result) => {
            setMessages(result);
        });
    }

    const sendMessage = async (messageContent) => {
        await hub.invoke("SendMessageToRoom", roomName, localStorage.getItem("username"), messageContent);
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
                        {messages.length}
                        {messages.map((mess) =>
                            <Row key={mess.id}>
                                {mess.userId === localStorage.getItem("userId") ? (<Col offset={12}>
                                    <ChatBox messageContent={mess.content}/>
                                </Col>) : (<Col span={12}> <ChatBox hasAvatar={true} messageContent={mess.content}
                                /></Col>)}
                            </Row>)
                        }
                    </MessagesArea>
                    <AddMesageArea>
                        <AddMessageBox sendMessage={sendMessage}/>
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
