import React from "react";
import {Comment, Tooltip, Avatar} from 'antd';

function ChatBox({username = "User", messageContent, hasAvatar = false}) {
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
                    {messageContent}
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
