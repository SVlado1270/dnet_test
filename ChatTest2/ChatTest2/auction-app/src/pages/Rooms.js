import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Button, Modal} from "antd";
import * as signalR from "@microsoft/signalr";
import SearchRooms from "../components/SearchRooms";
import CreateRoomModal from "../components/CreateRoomModal";
import AvailableRooms from "../components/AvailableRooms";
import CreatedRooms from "../components/CreatedRooms";


export const PageTitle = styled.h1`
    align-text: center;
    color: #504f60;
    font-weight: bold;
`;

const options = ["Design", "Jewelry", "Books", "Cars", "Coins", "Art"];


function Rooms() {
    const [hubConnection, setHubConnection] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRoom, setNewRoom] = useState({roomName: '', roomTag: options[0]});
    const [availableRooms, setAvailableRooms] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState("");
    const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
    const [filteredRooms, setFilteredRooms] = useState([]);


    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
        if (connection) {
            connection.start()
                .then(() => {
                    console.log("Connection started")
                    getRooms(connection);
                })
            setHubConnection(connection);
        }
        return () => {
            connection.stop().then(() => console.log("Connection stopped"))
        }
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        createRoom();
        setAvailableRooms([...availableRooms, newRoom]);
        setIsModalVisible(false);
        setNewRoom({roomName: '', roomTag: options[0]});
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewRoom({roomName: '', roomTag: options[0]});
    };

    const handleJoinRoom = (roomName) => {
        joinRoom(roomName);
        setJoinedRoom(roomName);
        setIsRoomModalVisible(true);
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

    const handleDeleteRoom = () => {
        deleteRoom(joinedRoom);
        const newRooms = availableRooms.filter(room => room.roomName !== joinedRoom);
        setAvailableRooms(newRooms);
        setFilteredRooms(newRooms);
        setJoinedRoom("");
        setIsRoomModalVisible(false);
    }

    const handleDeleteCreatedRoom = (roomName) => {
        deleteRoom(roomName);
        const newRooms = availableRooms.filter(room => room.roomName !== roomName);
        setAvailableRooms(newRooms);
        setFilteredRooms(newRooms);
        setJoinedRoom("");
        setIsRoomModalVisible(false);
    }

    const createRoom = () => {
        hubConnection.invoke("CreateRoom", newRoom.roomName, localStorage.getItem("username"));
    }

    const joinRoom = (roomName) => {
        hubConnection.invoke("JoinRoom", roomName, localStorage.getItem("username"));
    }

    const deleteRoom = (roomName) => {
        hubConnection.invoke("DeleteRoom", roomName, localStorage.getItem("username"));
    }

    const leaveRoom = (roomName) => {
        hubConnection.invoke("LeaveRoom", roomName, localStorage.getItem("username"));
    }

    const getRooms = (connection) => {
        connection.invoke("GetActiveRooms").then(result => {
            const rooms = result.map(room => ({roomName: room.name, roomTag: options[0]}));
            setAvailableRooms(rooms);
            setFilteredRooms(rooms);
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
                availableRooms={availableRooms}
                handleJoinRoom={handleJoinRoom}
                handleDelete={handleDeleteCreatedRoom}
            />
            <CreateRoomModal
                isModalVisible={isModalVisible}
                handleOk={handleOk}
                handleCancel={handleCancel}
                newRoom={newRoom}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
            />
            <Modal title={`Joined Room ${joinedRoom}`} visible={isRoomModalVisible} footer={null}
                   onCancel={handleLeaveRoom}>
                <Button onClick={handleLeaveRoom}>Leave Room</Button>
                <Button onClick={handleDeleteRoom}>Delete Room</Button>
            </Modal>
        </>
    );
}

export default Rooms;