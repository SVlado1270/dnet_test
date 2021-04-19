import React from "react";
import styled from "styled-components";
import {AiFillPlusCircle} from "react-icons/ai";
import {Card} from "antd";
import {ImEnter} from "react-icons/im";


export const AvailableRoomsContainer = styled.div`
    overflow: scroll;
    height: 200px;
    border-bottom: 1px solid lightgrey;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    margin-bottom: 100px;

    ::-webkit-scrollbar {
        height: 8px;  
        width: 10px;      
    }
    ::-webkit-scrollbar-track {
          background: white;  
    }
    ::-webkit-scrollbar-thumb {
      background-color: whitesmoke;  
      border-radius: 20px;      
    }
`;

export const PlusIcon = styled(AiFillPlusCircle)`
  font-size: 3em;
  width: 200px;
  color: #504f60;
  cursor: pointer;
`;

export const RoomCard = styled(Card)`
    width: 200px;
    height: 150px;
    text-align: center;
    margin: 10px;
    display: inline-block;
    box-shadow: 3px 3px lightgrey; 
    
    .ant-card-head-title{
        font-weight: bold;
    }
`;


function AvailableRooms({availableRooms, handleJoinRoom, showModal}) {
    return (
        <AvailableRoomsContainer>
            <PlusIcon onClick={() => showModal()}/>
            {availableRooms.map((room) => (
                <RoomCard title={room.roomName}
                          extra={<ImEnter key="enter" onClick={() => handleJoinRoom(room.roomName)}/>}
                          hoverable={true}
                >
                    <span> #{room.roomTag}</span>
                </RoomCard>
            ))}
        </AvailableRoomsContainer>
    );
}

export default AvailableRooms;
