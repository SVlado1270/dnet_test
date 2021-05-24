import React from "react";
import {Avatar, Col, Row, Space} from 'antd';
import styled from "styled-components";
import {CheckCircleTwoTone} from "@ant-design/icons";

const UserRow = styled(Row)`
    margin-bottom: 10px;
    
    span{
        font-size: 15px;
    }
`;

function ConnectedUserBox({username = "John Doe", fullName = "messageContent", hasAvatar = false}) {
    return (
        <UserRow>
            <Space>
                <CheckCircleTwoTone twoToneColor="#52c41a"/>
                <span>
                {username}
            </span>
            </Space>
        </UserRow>
    );
}

export default ConnectedUserBox;
