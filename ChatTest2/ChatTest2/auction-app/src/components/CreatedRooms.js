import React from "react";
import styled from "styled-components";
import {Card} from "antd";
import {ImEnter} from "react-icons/im";
import {DeleteOutlined} from "@ant-design/icons";


export const CreatedRoomsContainer = styled.div`
    margin-top: 20px;
    overflow: scroll;
    height: 200px;
    border-bottom: 1px solid lightgrey;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;

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

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 35px;
`;


function CreatedRooms({createdRooms, handleJoinRoom, handleDelete}) {
    const actions = (roomName) => {
        return (<ActionsWrapper>
            <ImEnter key="enter" onClick={() => handleJoinRoom(roomName)}/>
            <DeleteOutlined key="delete" onClick={() => handleDelete(roomName)}/>
        </ActionsWrapper>)
    }
    return (
        <CreatedRoomsContainer>
            {createdRooms.map((room) => (
                <RoomCard title={room.roomName}
                          extra={actions(room.roomName)}
                          hoverable={true}
                >
                    <span> #{room.roomTag}</span>
                </RoomCard>
            ))}
        </CreatedRoomsContainer>
    );
}

export default CreatedRooms;
