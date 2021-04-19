import React, {useState} from "react";
import {Menu} from 'antd';
import {AiFillHome, AiOutlineHistory} from "react-icons/ai";
import {ImUsers} from "react-icons/im";
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
        <Menu.Item key="users" icon={<ImUsers/>} onClick={() => navigateToPage('/users', 'users')}>
            Users
        </Menu.Item>
        <Menu.Item key="rooms" icon={<BsFillChatDotsFill/>} onClick={() => navigateToPage('/rooms', 'rooms')}>
            Rooms
        </Menu.Item>
        <Menu.Item key="history" icon={<AiOutlineHistory/>} onClick={() => navigateToPage('/history', 'history')}>
            History
        </Menu.Item>
    </Menu>);
}


export default NavMenu;
