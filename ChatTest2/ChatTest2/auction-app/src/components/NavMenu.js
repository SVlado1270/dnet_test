import React, {useState} from "react";
import {Menu} from 'antd';
import {AiFillHome} from "react-icons/ai";
import {BsFillChatDotsFill} from "react-icons/bs";
import {useHistory} from "react-router";

function NavMenu() {
    const history = useHistory();
    const [selectedKey, setSelectedKey] = useState('home');

    const navigateToPage = (link, key) => {
        history.push(link);
        setSelectedKey(key);
    }
    return (<Menu theme="dark" defaultSelectedKeys={[selectedKey]} mode="inline">
        <Menu.Item key="home" icon={<AiFillHome/>} onClick={() => navigateToPage('/', 'home')}>
            Home
        </Menu.Item>
        <Menu.Item key="rooms" icon={<BsFillChatDotsFill/>} onClick={() => navigateToPage('/rooms', 'rooms')}>
            Rooms
        </Menu.Item>
    </Menu>);
}


export default NavMenu;
