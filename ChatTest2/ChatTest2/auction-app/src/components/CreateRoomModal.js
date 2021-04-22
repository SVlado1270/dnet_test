import React from "react";
import {Button, Form, Input, Modal, Select} from "antd";

const {Option} = Select;
const options = ["Design", "Jewelry", "Books", "Cars", "Coins", "Art"];

function CreateRoomModal({isModalVisible, handleOk, handleCancel, newRoom, handleInputChange, handleSelectChange}) {
    return (
        <Modal title="Create room"
               visible={isModalVisible}
               onOk={handleOk}
               onCancel={handleCancel}
               footer={[
                   <Button key="back" onClick={handleCancel}>
                       Cancel
                   </Button>,
                   <Button key="submit" disabled={newRoom.roomName.length < 5} type="primary" onClick={handleOk}>
                       Submit
                   </Button>
               ]}
        >
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
    );
}

export default CreateRoomModal;
