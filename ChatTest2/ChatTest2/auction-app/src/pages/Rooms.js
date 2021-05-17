import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Button, Modal} from "antd";
import * as signalR from "@microsoft/signalr";
import SearchRooms from "../components/SearchRooms";
import CreateRoomModal from "../components/CreateRoomModal";
import AvailableRooms from "../components/AvailableRooms";
import CreatedRooms from "../components/CreatedRooms";
import {useHistory} from "react-router";


export const PageTitle = styled.h1`
    align-text: center;
    color: #504f60;
    font-weight: bold;
`;

const options = ["Design", "Jewelry", "Books", "Cars", "Coins", "Art"];


function Rooms({hub}) {
    const history = useHistory();
    const [hubConnection, setHubConnection] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRoom, setNewRoom] = useState({roomName: '', roomTag: options[0]});
    const [availableRooms, setAvailableRooms] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState("");
    const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [createdRooms, setCreatedRooms] = useState([]);
    useEffect(() => {
        if (hub) {
            setHubConnection(hub);
            // hub.on("onCreateRoom", (room) => {
            //     getRooms(hub);
            //     getCreatedRooms(hub);
            // })
        }
    }, [hub]);

    useEffect(() => {
        if (hubConnection) {
           getRooms(hubConnection);
          // getCreatedRooms(hubConnection);
        }
    }, [hubConnection]);


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewRoom({roomName: '', roomTag: options[0]});
    };

    const handleCreateRoom = () => {
        createRoom();
        // setCreatedRooms([...createdRooms, newRoom]);
        // setAvailableRooms([...availableRooms, newRoom]);
        // setFilteredRooms([...filteredRooms, newRoom]);
        // setIsModalVisible(false);
        // setNewRoom({roomName: '', roomTag: options[0]});
    };

    const handleJoinRoom = (roomName) => {
        joinRoom(roomName);
        setJoinedRoom(roomName);
        history.push(`/room/${roomName}`)
    }

    const handleInputChange = (event) => {
        setNewRoom({...newRoom, [event.target.name]: event.target.value});
    }

    const handleSelectChange = (value) => {
        setNewRoom({...newRoom, roomTag: value});
    }


    const handleLeaveRoom = () => {
        leaveRoom(joinedRoom);
        setJoinedRoom("");
        setIsRoomModalVisible(false);
    }

    const handleDeleteCreatedRoom = (roomName) => {
        deleteRoom(roomName);
        const newRooms = availableRooms.filter(room => room.roomName !== roomName);
        const newCreatedRooms = createdRooms.filter(room => room.roomName !== roomName);
        setAvailableRooms(newRooms);
        setFilteredRooms(newRooms);
        setCreatedRooms(newCreatedRooms);
        setJoinedRoom("");
        setIsRoomModalVisible(false);
    }

    const createRoom = async () => {
        await hubConnection.invoke("CreateRoom", newRoom.roomName, localStorage.getItem("username"));
    }

    const joinRoom = async (roomName) => {
        await hubConnection.invoke("JoinRoom", roomName, localStorage.getItem("username"));
    }

    const deleteRoom = async (roomName) => {
        await hubConnection.invoke("DeleteRoom", roomName, localStorage.getItem("username"));
    }

    const leaveRoom = async (roomName) => {
        await hubConnection.invoke("LeaveRoom", roomName, localStorage.getItem("username"));
    }

    const getRooms = (connection) => {
        connection.invoke("GetActiveRooms").then(result => {
            console.log("Result",result)
            //const rooms = result.map(room => ({roomName: room.name, roomTag: options[0]}));

           // setAvailableRooms(rooms);
           // setFilteredRooms(rooms);
        });
    }

    const getCreatedRooms = (connection) => {
        connection.invoke("GetUserRooms", localStorage.getItem("username")).then(result => {
            const rooms = result.map(room => ({roomName: room.name, roomTag: options[0]}));
            setCreatedRooms(rooms);
        });
    }
    return (
        <>
            <PageTitle>Available Rooms</PageTitle>
            <SearchRooms availableRooms={availableRooms} setFilteredRooms={setFilteredRooms}/>
            <AvailableRooms
                availableRooms={filteredRooms}
                handleJoinRoom={handleJoinRoom}
                showModal={showModal}
            />
            <PageTitle>Created Rooms</PageTitle>
            <CreatedRooms
                createdRooms={createdRooms}
                handleJoinRoom={handleJoinRoom}
                handleDelete={handleDeleteCreatedRoom}
            />
            <CreateRoomModal
                isModalVisible={isModalVisible}
                handleOk={handleCreateRoom}
                handleCancel={handleCancel}
                newRoom={newRoom}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
            />
            <Modal title={`Joined Room ${joinedRoom}`} visible={isRoomModalVisible} footer={null}
                   onCancel={handleLeaveRoom}>
                <Button onClick={handleLeaveRoom}>Leave Room</Button>
            </Modal>
        </>
    );
}

export default Rooms;
