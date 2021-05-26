import React, {useState} from "react";
import {Button, Form, Input, Modal, Select, message, Upload, DatePicker} from "antd";
import {ErrorMessage} from "../pages/auth/styles";

const { RangePicker } = DatePicker;

const {Option} = Select;

const validationRules = {
    roomName: [{
        required: true,
        message: 'Room Name is a required field',
    }, {
        min: 5,
        message: 'Room Name must have at least 5 characters',
    }],
    itemName: [{
        required: true,
        message: 'Item Name is a required field',
    }, {
        min: 5,
        message: 'Room Name must have at least 5 characters',
    }
    ],
    category: [{
        required: true,
        message: 'Category is a required field',
    }],
    description: [{
        required: true,
        message: 'Description is a required field',
    }, {
        min: 5,
        message: 'Description must have at least 5 characters',
    },],
    url: [{
        required: true,
        message: 'Image Url is a required field',
    }],
    startTime:  [{
        required: true,
        message: 'Start time is a required field',
    }],
}

const imageLink = "https://ourfunnylittlesite.com/wp-content/uploads/2018/07/1-4-696x696.jpg";

function CreateRoomModal({isModalVisible, handleCancel, categories, hubConnection}) {
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState("");
    const createRoom = async (roomDetails, itemDetails) => {
        hubConnection.on("onCreateRoomError", (error) => {
            setErrorMessage(error);
        })
        hubConnection.on("onCreateRoomSuccess", (resp) => {
            message.destroy()
            message.success(resp, 1)
            handleModalCancel();
            setErrorMessage("");
        })
        await hubConnection.invoke("CreateRoom", roomDetails, itemDetails)
    }

    const onFinish = (values) => {
        if(values.startTime == null){
            message.error("You must pick a date");
            return;
        }
        const roomDetails = {
            RoomName: values.roomName,
            Username: localStorage.getItem("username"),
            Category: values.category,
            StartTime: `${values.startTime._d.getTime()}`
        }
        const itemDetails = {
            Name: values.itemName,
            URL: values.itemUrl,
            Description: values.itemDescription,
            Category: values.category,
        }
        createRoom(roomDetails, itemDetails)
    };

    const handleModalCancel = () => {
        form.resetFields();
        handleCancel();
    }
    return (
        <Modal title="Create room"
               visible={isModalVisible}
               onCancel={handleModalCancel}
               footer={null}
        >
            <ErrorMessage>{errorMessage}</ErrorMessage>
            <Form layout="vertical" onFinish={onFinish} form={form}>
                <Form.Item label="Room name" rules={validationRules["roomName"]} name="roomName">
                    <Input type="text"/>
                </Form.Item>
                <Form.Item label="Category" rules={validationRules["category"]} name="category">
                    <Select style={{width: "100%"}}>
                        {categories.map((option) => <Option value={option} key={option}>{option}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Item name" rules={validationRules["itemName"]} name="itemName">
                    <Input type="text"/>
                </Form.Item>
                <Form.Item label="Item description" rules={validationRules["description"]} name="itemDescription">
                    <Input type="text" maxLength={150}/>
                </Form.Item>
                <Form.Item label="Item url" rules={validationRules["url"]} name="itemUrl">
                    <Input type="text"/>
                </Form.Item>
                <Form.Item label="Auction start time" name="startTime">
                    <DatePicker showTime/>
                </Form.Item>
                <Form.Item>
                    <Button key="submit" type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateRoomModal;
