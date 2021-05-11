import React from "react";
import {Comment, Tooltip, Avatar} from 'antd';

function ChatBox({username = "User", messageContent = "messageContent", hasAvatar = false}) {
    return (
        <Comment
            author={username}
            avatar={
                hasAvatar ?
                    <Avatar
                        alt="User"
                    >{username}</Avatar> : null
            }
            content={
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book. It has survived not only five centuries
                </p>
            }
            datetime={
                <Tooltip title={'YYYY-MM-DD HH:mm:ss'}>
                    <span>{"few seconds ago"}</span>
                </Tooltip>
            }
        />

    );
}

export default ChatBox;
