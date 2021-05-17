import React from "react";
import {Avatar, Col, Row} from 'antd';
import styled  from "styled-components";

const UserRow = styled(Row)`
    margin-bottom: 10px;
`;

function ConnectedUserBox({username = "John Doe", fullName = "messageContent", hasAvatar = false}) {
    return (
        <UserRow align="center">
            <Col span={4}>
                <Avatar
                    alt="User"
                >{username}</Avatar>
            </Col>
            <Col span={20}>
                {fullName}
            </Col>
        </UserRow>
    );
}

export default ConnectedUserBox;
