import React, {useEffect, useState} from "react";
import styled from "styled-components";
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

function NewRooms({hub}) {
    const history = useHistory();
    const [hubConnection, setHubConnection] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [createdRooms, setCreatedRooms] = useState([]);
    const [itemsCategories, setItemsCategories] = useState([]);

    useEffect(() => {
        if (hub) {
            setHubConnection(hub);
            hub.on("onError", (error) => {
                console.log("Error", error)
            })
            hub.on("onCreateRoom", () => {
                getRooms(hub);
                getCreatedRooms(hub);
            })
            hub.on("removeChatRoom", () => {
                getRooms(hub);
                getCreatedRooms(hub);
            })
            hub.on("addUser", (user) => {
                console.log(user, "Add user")
            })
        }
    }, [hub]);

    useEffect(() => {
        if (hubConnection) {
            getCategories();
            getRooms(hubConnection);
            getCreatedRooms(hubConnection);
            // getCreatedRooms(hubConnection);
        }
    }, [hubConnection]);


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const getRooms = (connection) => {
        connection.invoke("GetActiveRooms").then(result => {
            setAvailableRooms(result);
            setFilteredRooms(result);
        });
    }

    const getCreatedRooms = (connection) => {
        connection.invoke("GetUserRooms", localStorage.getItem("username")).then(result => {
            setCreatedRooms(result);
        });
    }

    const getCategories = async () => {
        await hubConnection.invoke("GetCategories").then((result) => setItemsCategories(result));
    }

    const joinRoom = async (roomName) => {
        await hubConnection.invoke("JoinRoom", roomName, localStorage.getItem("username"));
    }

    const deleteRoom = async (roomName) => {
        await hubConnection.invoke("DeleteRoom", roomName, localStorage.getItem("username"));
    }

    const handleJoinRoom = (roomName) => {
        joinRoom(roomName).then(() => history.push(`/room/${roomName}`));
    }

    const handleDeleteCreatedRoom = (roomName) => {
        deleteRoom(roomName);
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
                handleCancel={handleCancel}
                categories={itemsCategories}
                hubConnection={hubConnection}
            />
        </>
    );
}

export default NewRooms;
