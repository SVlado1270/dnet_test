import React from "react";
import styled from "styled-components";
import {RiAuctionFill} from "react-icons/ri";
import {AiFillHome, AiFillPlusCircle, AiOutlineHistory} from "react-icons/ai";
import { BsFillChatDotsFill} from 'react-icons/bs';
import {ImUsers} from "react-icons/im";
import {Avatar} from "antd";
import {LogoutOutlined, UserOutlined} from '@ant-design/icons';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {Link} from "react-router-dom";
import {useHistory} from "react-router";

export const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  font-family: "Ubuntu", sans-serif;
`;

export const DashboardHeader = styled.div`
    height: 100%;
    width: 15%;
    display: flex;
    position: relative;
    flex-direction: column;
    box-shadow: 5px 0 2px -2px lightgray;
`;

export const TopHeader = styled.div`
    width: 100%;
    height: 5%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    
`;

export const ContentWrapper = styled.div`
    height: 100%;
    width: 85%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 2%;
`;

export const AuctionIcon = styled(RiAuctionFill)`
    color: #504f60;
    font-size: 1.4em;
`;

export const HeaderTitle = styled.span`
    font-size: 1.3em;
    color: #504f60;
`;

export const HeaderProfileWrapper = styled.span`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 6%;
    border-top: 1px solid lightgray;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;

export const NavLinksWrapper = styled.div`
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 10%;
`;

export const NavLinkTitle = styled(Link)`
    color: #504f60;
    
    :hover{
        color: #504f60;
    }
`;

export const NavLink = styled.div`
  width: 80%;
  color:  rgb(80,79,96);
  height: 30%;
  position: relative;
  border-radius: 7px;
  flex-direction: column;
  padding: 2% 0 2% 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 5px;
  
  :hover {
    cursor: pointer;
    background-color: rgb(80,79,96,0.5);
  }
`;

export const iconStyle = `
  color: #846482;
  font-size: 25px;
  position: absolute;
  left: 5%;
`;

export const LogoutIcon = styled(LogoutOutlined)`
  color: #846482;
  font-size: 25px;
  position: absolute;
  cursor: pointer;
  right: 5%;
  
  :hover{ 
    color: rgb(80,79,96, 0.8);
  }
`;
export const HomeIcon = styled(AiFillHome)`
  ${iconStyle}
`;

export const UsersIcon = styled(ImUsers)`
  ${iconStyle}
`;

export const PlusIcon = styled(AiFillPlusCircle)`
  ${iconStyle}
`;

export const HistoryIcon = styled(AiOutlineHistory)`${iconStyle}`;

export const ChatIcon = styled(BsFillChatDotsFill)`${iconStyle}`;

export const AvatarIcon = styled(UserOutlined)`color: #846482;`;

export const ProfileAvatar = styled(Avatar)`left: 5%; position: absolute;`;

export const ProfileName = styled.span`color: rgb(80,79,96);`;

export const PageTitle = styled.h1`
    align-text: center;
`;
function AppLayout({children}) {
    const history = useHistory();
    const handleLogOut = () => {
        localStorage.clear();
        history.push('/login');
    }
    return (
        <PageWrapper>
            <DashboardHeader>
                <TopHeader>
                    <AuctionIcon/>
                    <HeaderTitle>Going, Going, Gone</HeaderTitle>
                </TopHeader>
                <NavLinksWrapper>
                    <NavLink>
                        <HomeIcon/>
                        <NavLinkTitle to="/">Home</NavLinkTitle>
                    </NavLink>
                    <NavLink>
                        <UsersIcon/>
                        <NavLinkTitle>Users</NavLinkTitle>
                    </NavLink>
                    <NavLink>
                        <ChatIcon/>
                        <NavLinkTitle to="/rooms">Rooms</NavLinkTitle>
                    </NavLink>
                    <NavLink>
                        <HistoryIcon/>
                        <NavLinkTitle>History</NavLinkTitle>
                    </NavLink>
                </NavLinksWrapper>
                <HeaderProfileWrapper>
                    <ProfileAvatar icon={<AvatarIcon />} />
                    <ProfileName>{localStorage.getItem("username")}</ProfileName>
                    <LogoutIcon onClick={handleLogOut}/>
                </HeaderProfileWrapper>
            </DashboardHeader>
            <ContentWrapper>
                {children}
            </ContentWrapper>
        </PageWrapper>
    )
        ;
}


export default AppLayout;
