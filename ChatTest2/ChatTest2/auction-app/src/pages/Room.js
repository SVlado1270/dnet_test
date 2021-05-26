import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {useParams} from "react-router-dom";
import ChatBox from "../components/ChatBox";
import AddMessageBox from "../components/AddMessageBox";
import {Button, Col, Row, Space, message, Image, Typography, Statistic} from "antd";
import ConnectedUserBox from "../components/ConnectedUserBox";
import {useHistory} from "react-router";
import {FireOutlined} from "@ant-design/icons";

const {Countdown} = Statistic;
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

export const BidAmount = styled.span`
    color: red;
`;

function Room({hub}) {
    const bottomRef = useRef();
    const history = useHistory();
    let {roomName} = useParams();
    const [hubConnection, setHubConnection] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [roomItem, setRoomItem] = useState();
    const [currentAmount, setCurrentAmount] = useState(0);
    const [deadline, setDeadline] = useState();
    const [lastBid, setLastBid] = useState({username: "", amount: 0})
    const [roomDetails, setRoomDetails] = useState({});
    const [startTime, setStartTime] = useState();
    const [isAuctionBegin, setIsAuctionBegin] = useState(false);

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
            hub.on("WasBidOnItem", (username, amount, timestamp) => {
                setDeadline(parseInt(timestamp) + 1000 * 15);
                setLastBid({username: username, amount: amount})
                setCurrentAmount(amount);
            })
            hub.on("UpdatedItem", (msg, username) => {
                if (username === localStorage.getItem("username")) {
                    message.destroy();
                    message.success("Congrats! You won", 2);
                } else {
                    message.destroy();
                    message.success(msg, 2);
                }
                history.push('/rooms');
            })
        }
    }, [hub]);

    useEffect(() => {
        if (hubConnection) {
            getConnectedUsersInRoom(hubConnection);
            getMessages(roomName, hubConnection);
            getRoomItem(roomName, hubConnection);
            getRoomDetails(roomName, hubConnection);
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


    const getRoomDetails = async (roomName, connection) => {
        await connection.invoke("GetRoomDetails", roomName).then((result) => {
            setRoomDetails(result);
            setStartTime(parseInt(result.startTime))
            setIsAuctionBegin(parseInt(result.startTime) > Date.now())
        });
    }

    const getRoomItem = async (roomName, connection) => {
        await connection.invoke("GetItemFromRoom", roomName).then((result) => {
            setRoomItem(result.item1);
            setCurrentAmount(result.item2.amount);
            setDeadline(parseInt(result.item2.bidTime) + 1000 * 15)
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

    const bidOnItem = async (amount) => {
        await hub.invoke("BidOnItem", roomName, localStorage.getItem("username"), amount, JSON.stringify(Date.now()));
    }

    const updateItem = async () => {
        await hubConnection.invoke("UpdateItem", roomName, localStorage.getItem("username"));
    }
    const scrollToBottom = () => {
        bottomRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleBid = () => {
        bidOnItem(currentAmount + 100);
    }

    const onFinish = () => {
        setIsAuctionBegin(true);
    }

    const onAuctionStartFinish = () => {
        updateItem();
    }

    return (
        <>
            <Space size={50}>
                <PageTitle>Joined Room: <strong>{roomName}</strong> </PageTitle>
                <Button type="primary" onClick={handleLeaveRoom}>Leave Room</Button>
                <Button type="primary" icon={<FireOutlined/>} danger onClick={handleBid}
                        disabled={startTime > Date.now()}>Bid
                    more</Button>
                <Countdown title="Auction Start Countdown" value={startTime} onFinish={onFinish}/>
                <Countdown title="Bid Countdown" value={deadline} onFinish={onAuctionStartFinish}/>
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
                                <Title level={4}>Current bidded amount</Title>
                                <Title level={3} style={{color: "red"}}>{currentAmount}</Title>
                            </Space>
                        </Col>
                    </Row>
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
