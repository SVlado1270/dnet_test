import React, {useState} from "react";
import {Layout} from 'antd';
import styled from "styled-components";
import {RiAuctionFill} from "react-icons/ri";
import NavMenu from "../NavMenu";

const {Content, Sider} = Layout;


export const AuctionIcon = styled(RiAuctionFill)`
    font-size: 1.4em;
    color: whitesmoke;
`;

export const TopHeader = styled.div`
    height: 32px;
    margin: 16px;
    display: flex;
    justify-content: space-evenly;
`;

const ContentWrapper = styled.div`
    background-color: #fff;
`;

function HomeLayout({children}) {
    const [collapsed, setIsCollapsed] = useState(true);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => setIsCollapsed(!collapsed)}>
                <TopHeader>
                    <AuctionIcon/>
                </TopHeader>
                <NavMenu/>
            </Sider>
            <Layout className="site-layout">
                <Content style={{
                    margin: '24px 16px',
                }}>
                    <ContentWrapper style={{padding: 24, height: "100%"}}>
                        {children}
                    </ContentWrapper>
                </Content>
            </Layout>
        </Layout>
    );
}


export default HomeLayout;
