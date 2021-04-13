import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { AiFillPlusCircle, AiOutlineHistory} from "react-icons/ai";
import {Avatar, Button, Form, Input, Modal, Select} from "antd";
import * as signalR from "@microsoft/signalr";
import {useHistory} from "react-router";
import hubConnection from "../components/HubConnection";
const {Option} = Select;

export const PlusIcon = styled(AiFillPlusCircle)`
  height: 100%;
  width: 30%;
  color: #504f60;
`;


export const RoomContainer = styled.div`
    border: 1px solid lightgrey;
    position: relative;
    border-radius: 10px;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 3px 3px lightgrey; 
    span{
        color: #504f60;
        font-size: 20px;
        font-weight: 500px;
    }
    
    span:nth-child(2){
        position: absolute;
        bottom: 0;
        color: lightgrey;
        font-size: 15px;
    }
`;

export const PageTitle = styled.h1`
    align-text: center;
    color: #504f60;
`;

export const AvailableRoomsContainer = styled.div`
    width: 100%;
    height: 40%;
    display: flex;
    border-bottom: 1px solid lightgrey;
    align-items: center;
    justify-content: space-around;
    position: relative;
    flex-wrap: wrap;
`;

export const AvailableRoomsTitle = styled.h2`
    position: absolute;
    color: #504f60;
    left: 0;
    top: 0;
`;

export const AddRoomContainer = styled.div`
    border: 1px solid lightgrey;
    border-radius: 10px;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 3px 3px lightgrey; 
`;

export const SearchRoomsContainer = styled.div`
    margin-top: 3%;
    width: 100%;
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
    flex-wrap: wrap;
    
    span{
        color: #504f60;
        font-size: 15px;
        font-weight: 500px;
    }
`;

export const SearchRoomForm = styled(Form)`
    position: absolute;
    left:15%;
    top: 0;
`;

export const SearchInput = styled(Input)`
    background: whitesmoke;
    border-radius: 5px;
`;


const options = ["Design", "Jewelry", "Books", "Cars", "Coins", "Art"];

function Rooms() {
    const hubConnection = new signalR.HubConnectionBuilder().withUrl("/chatHub")
        .build();
    hubConnection.start();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRoom, setNewRoom] = useState({roomName: '', roomTag: options[0]});
    const [roomSearch, setRoomSearch] = useState('')
    const [availableRooms, setAvailableRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState("");
    const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);


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
    const handleSearchChange = (event) => {
        setRoomSearch(event.target.value);
        setFilteredRooms([]);
        if (event.target.value !== "") {
            const result = availableRooms.filter(room => room.roomTag.toLowerCase().includes(event.target.value.toLowerCase()));
            setFilteredRooms(result);
        }
    }

    const handleLeaveRoom = () => {
        leaveRoom(joinedRoom);
        setJoinedRoom("");
        setIsRoomModalVisible(false);
    }

    const handleDeleteRoom = () => {
        deleteRoom(joinedRoom);
        setAvailableRooms(availableRooms.filter(room => room.roomName !== joinedRoom));
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
    return (
        <>
            <PageTitle>Rooms</PageTitle>
            <AvailableRoomsContainer>
                <AvailableRoomsTitle>Available rooms</AvailableRoomsTitle>
                <AddRoomContainer>
                    <PlusIcon onClick={() => showModal()}/>
                </AddRoomContainer>
                {availableRooms.map((room) => (
                    <RoomContainer onClick={() => handleJoinRoom(room.roomName)}>
                        <span> {`Join ${room.roomName}`}</span>
                        <span> #{room.roomTag}</span>
                    </RoomContainer>
                ))}
            </AvailableRoomsContainer>
            <SearchRoomsContainer>
                <AvailableRoomsTitle>Search by tag</AvailableRoomsTitle>
                <SearchRoomForm layout="horizontal">
                    <Form.Item>
                        <SearchInput type="text" name="roomSearch" value={roomSearch} onChange={handleSearchChange}/>
                    </Form.Item>
                </SearchRoomForm>
                {filteredRooms.length !== 0 ? (filteredRooms.map((room) => (
                    <RoomContainer onClick={() => handleJoinRoom(room.roomName)}>
                        <span> {`Join ${room.roomName}`}</span>
                        <span> #{room.roomTag}</span>
                    </RoomContainer>
                ))) : <span>No rooms with this tag</span>}
            </SearchRoomsContainer>
            <Modal title="Create room" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical">
                    <Form.Item label="Room name">
                        <Input type="text" name="roomName" value={newRoom.roomName} onChange={handleInputChange}/>
                    </Form.Item>
                    <Form.Item label="Category">
                        <Select defaultValue={options[0]} style={{width: "100%"}} onChange={handleSelectChange}>
                            {options.map((option) => <Option value={option}>{option}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title={`Joined Room ${joinedRoom}`} visible={isRoomModalVisible} footer={null} onCancel={handleCancel}>
                <Button onClick={handleLeaveRoom}>Leave Room</Button>
                <Button onClick={handleDeleteRoom}>Delete Room</Button>
            </Modal>
        </>
    );
}

export default Rooms;
