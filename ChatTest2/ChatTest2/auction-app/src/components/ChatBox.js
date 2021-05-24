import React from "react";
import {Comment, Avatar} from 'antd';
import {UserOutlined} from "@ant-design/icons";

const commentStyle = {
    border: "1px solid whitesmoke",
    marginBottom: "15px",
    borderRadius: "20px",
    padding: "10px"
}

function ChatBox({username = "User", messageContent, hasAvatar = false}) {
    return (
        <Comment
            author={username}
            avatar={
                hasAvatar ?
                    <Avatar
                        alt="User"
                        style={{color: "red"}}
                    >
                        <UserOutlined/>
                    </Avatar> : <Avatar
                        alt="User"
                        style={{color: "green"}}
                    >
                        <UserOutlined/>
                    </Avatar>
            }
            content={
                <p>
                    {messageContent}
                </p>
            }
            style={commentStyle}
        />

    );
}

export default ChatBox;
