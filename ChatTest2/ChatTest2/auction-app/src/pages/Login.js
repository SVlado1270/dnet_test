import React from "react";
import styled from "styled-components";
import walletLogo from "../assets/wallet.svg";
import { AiOutlineMail, AiOutlineUnlock} from "react-icons/ai";
import {Link, useHistory} from "react-router-dom";

export const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Ubuntu", sans-serif;
  
`;

export const ContentWrapper = styled.div`
  width: 40%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
`;

export const FormWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    width: 80%;
    height: 35%;
`;

export const PageTitle = styled.span`
    font-size: 3em;
    color: #504f60;
`;

export const SvgWrapper = styled.span`
    width: 80%
    border: 1px solid teal;
    height: 30%;
    
    img{
        object-fit: contain;
        height: 100%;
    }
`;

export const IconInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  position: relative;
  border-radius: 30px;
  width: 80%;
  background: whitesmoke;
  border: 1px solid lightgrey;
`;

export const Input = styled.input`
  font-size: 18px;
  outline: none;
  border: none;
  width: 90%;
  background-color: transparent;
  color: #504f60;
`;

export const IconStyle = ` 
  height: 100%;
  width: 1.5em;
  color: #504f60;
`;

export const EmailIcon = styled(AiOutlineMail)`
  ${IconStyle}
`;
export const PasswordIcon = styled(AiOutlineUnlock)`
  ${IconStyle}
`;

export const Button = styled.button`
  font-size: 18px;
  padding: 10px;
  width: 50%;
  margin: 10px;
  background: rgb(80,79,96,1);
  color: whitesmoke;
  border: none;
  outline: none;
  border-radius: 30px;
  cursor: pointer;
  :hover {
    background: rgb(80,79,96,0.9);
  }
`;

export const CreateAccountLink = styled(Link)`
  color: #504f60;
  position: absolute;
  bottom: 10%;
  :hover {
    color: grey;
  }
`;

function Login() {
    const history = useHistory();
    return (
        <PageWrapper>
            <ContentWrapper>
                <PageTitle>Login</PageTitle>
                <SvgWrapper>
                    <img src={walletLogo} alt="auction logo"/>
                </SvgWrapper>
                <FormWrapper>
                    <IconInput>
                        <EmailIcon/>
                        <Input type="email" placeholder="Email"/>
                    </IconInput>
                    <IconInput>
                        <PasswordIcon/>
                        <Input type="password" placeholder="Password"/>
                    </IconInput>
                    <Button onClick={() => history.push('/')}>
                        Submit
                    </Button>
                </FormWrapper>
                <CreateAccountLink to="/register">
                    Create account
                </CreateAccountLink>
            </ContentWrapper>
        </PageWrapper>
    )
        ;
}


export default Login;
