import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {useParams} from "react-router-dom";
import ChatBox from "../components/ChatBox";
import AddMessageBox from "../components/AddMessageBox";
import {Button, Col, Row, Space, message, Image, Typography} from "antd";
import ConnectedUserBox from "../components/ConnectedUserBox";
import {useHistory} from "react-router";

const {Title} = Typography;
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
    min-height: 600px;
    max-height: 700px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
     display: none;
   }
`;

export const ConnectedUsersContainer = styled.div`
    max-height: 400px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
     display: none;
   }
`;

export const ChatSider = styled.div`
    border-left: 1px solid lightgrey;
    width: 20%;
    padding: 15px;
`;


function Room({hub}) {
    const bottomRef = useRef();
    const history = useHistory();
    let {roomName} = useParams();
    const [hubConnection, setHubConnection] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [roomItem, setRoomItem] = useState();

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
                    scrollToBottom();
                });
            })
        }
    }, [hub]);

    useEffect(() => {
        if (hubConnection) {
            getConnectedUsersInRoom(hubConnection);
            getMessages(roomName, hubConnection);
            getRoomItem(roomName, hubConnection);
        }

    }, [hubConnection])

    const getConnectedUsersInRoom = (connection) => {
        connection.invoke("GetAllUsersInRoom", roomName).then(result => {
            setConnectedUsers(result.map((user) => ({
                username: user?.userName,
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

    const getRoomItem = async (roomName, connection) => {
        await connection.invoke("GetItemFromRoom", roomName).then((result) => {
            setRoomItem(result);
        });
    }

    const getMessages = (roomName, connection) => {
        connection.invoke("GetMessagesFromRoom", roomName).then((result) => {
            setMessages(result);
        });
        scrollToBottom();
    }

    const sendMessage = async (messageContent) => {
        await hub.invoke("SendMessageToRoom", roomName, localStorage.getItem("username"), messageContent);
    }

    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <>
            <Space size={50}>
                <PageTitle>Joined Room: <strong>{roomName}</strong> </PageTitle>
                <Button type="primary" onClick={handleLeaveRoom}>Leave Room</Button>
            </Space>
            <Row>
                <ChatContainer>
                    <MessagesArea>
                        {messages.map((mess) =>
                            <Row key={mess.id} gutter={[16, 16]}>
                                {mess.userId === localStorage.getItem("userId") ? (<Col offset={12} span={12}>
                                    <ChatBox messageContent={mess.content} username={mess.userName}/>
                                </Col>) : (<Col span={12}> <ChatBox hasAvatar={true} messageContent={mess.content}
                                                                    username={mess.userName}
                                /></Col>)}
                            </Row>)
                        }
                        <div ref={bottomRef}/>
                    </MessagesArea>
                    <AddMesageArea>
                        <AddMessageBox sendMessage={sendMessage}/>
                    </AddMesageArea>
                </ChatContainer>
                <ChatSider>
                    <Row>
                        <Col>
                            <Space direction={"vertical"}>
                                <Title level={4}>Item Details</Title>
                                <span><strong>Item:</strong> {roomItem?.name}</span>
                                <span><strong>Description:</strong> {roomItem?.description}</span>
                            </Space>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "10px", marginBottom: "10px"}}>
                        <Col>
                            <Image
                                width={150}
                                src={roomItem?.url}
                            />
                        </Col>
                    </Row>
                    <Title level={4}>Connected users</Title>
                    <ConnectedUsersContainer>
                        {connectedUsers.length > 0 ? connectedUsers.map((connectedUser) => <ConnectedUserBox
                            key={connectedUser.userId}
                            username={connectedUser?.username} fullName={connectedUser.fullName}/>) : null}
                    </ConnectedUsersContainer>
                </ChatSider>
            </Row>
        </>
    );
}

export default Room;
