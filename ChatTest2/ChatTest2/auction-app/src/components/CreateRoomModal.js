import React, {useState} from "react";
import {Button, Form, Input, Modal, Select, message, Upload} from "antd";
import {ErrorMessage} from "../pages/auth/styles";
import {InboxOutlined} from "@ant-design/icons";
import axios from "axios";

const {Dragger} = Upload;

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
    },]
}

const imageLink = "https://ourfunnylittlesite.com/wp-content/uploads/2018/07/1-4-696x696.jpg";

function CreateRoomModal({isModalVisible, handleCancel, categories, hubConnection}) {
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState("");
    const [formState, setFormState] = useState({fileList: []});
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

    const props = {
        onRemove: (file) => {
            setFormState({...formState, fileList: []});
        },
        beforeUpload: (file) => {
            setFormState({
                ...formState,
                fileList: [file],
            });
            return false;
        },
        fileList: formState.fileList,
    };

    const onFinish = (values) => {
        const roomDetails = {
            RoomName: values.roomName,
            Username: localStorage.getItem("username"),
            Category: values.category
        }
        const itemDetails = {
            Name: values.itemName,
            URL: imageLink,
            Description: values.itemDescription,
            Category: values.category
        }
        if (formState.fileList.length === 0) {
            message.error("You must add an item photo", 2);
            return;
        }
        const formData = new FormData();
        if (formState.fileList.length === 1) {
            formData.append("image", formState.fileList[0]);
        }
        // axios
        //     .post(`https://api.imgur.com/3/upload`, formData, {
        //         headers: {
        //             Authorization: "Client-ID 7f7d4ec2d9894e3",
        //         },
        //     })
        //     .then((response) => {
        //        console.log(response.data)
        //             // message.success("Post added successfully", 1);
        //             // setFormState({ caption: "", fileList: [] });
        //             // form.resetFields();
        //             // setIsModalVisible(false);
        //
        //     })
        //     .catch((error) => {
        //         message.error("There was an error. Post couldn't be added", 1);
        //     });
        createRoom(roomDetails, itemDetails)
    };

    const handleModalCancel = () => {
        form.resetFields();
        setFormState({fileList: []})
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
                    <Select defaultValue={categories[0]} style={{width: "100%"}}>
                        {categories.map((option) => <Option value={option} key={option}>{option}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Item name" rules={validationRules["itemName"]} name="itemName">
                    <Input type="text"/>
                </Form.Item>
                <Form.Item label="Item description" rules={validationRules["description"]} name="itemDescription">
                    <Input type="text" maxLength={150}/>
                </Form.Item>
                <Form.Item>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">Support for a single upload</p>
                    </Dragger>
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
