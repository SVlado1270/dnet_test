import React, {useState} from "react";
import styled from "styled-components";
import walletLogo from "../assets/wallet.svg";
import {AiOutlineUser, AiOutlineUnlock} from "react-icons/ai";
import {Link, useHistory} from "react-router-dom";
import axios from 'axios';

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

export const UserIcon = styled(AiOutlineUser)`
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

export const ErrorMessage = styled.span`
    color: red;
`;

function Login() {
    const [formFields, setFormFields] = useState({username: "", password: ""});
    const [errorMessage, setErrorMessage] = useState("");
    const history = useHistory();

    const handleChange = (event) => {
        if(errorMessage !== ""){
            setErrorMessage("");
        }
        setFormFields({...formFields, [event.target.name]: event.target.value})
    }

    const handleSubmit = () => {
        if (formFields.password === "" || formFields.username === "") {
            setErrorMessage("All fields are required");
            return;
        }
        const headers = {
            'Content-Type': 'application/json',
        }
        axios.post(`http://localhost:63920/api/v1/users/Login`, {
            UserName: formFields.username,
            Password: btoa(formFields.password)
        }, {headers})
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("expireDate", response.data.expiration);
                    localStorage.setItem("userId", response.data.userid);
                    localStorage.setItem("username", response.data.username);
                    history.push('/');
                }
            })
            .catch((error) => {
                setErrorMessage(error.response.data);
            })
    }

    return (
        <PageWrapper>
            <ContentWrapper>
                <PageTitle>Login</PageTitle>
                <SvgWrapper>
                    <img src={walletLogo} alt="auction logo"/>
                </SvgWrapper>
                <FormWrapper>
                    <IconInput>
                        <UserIcon/>
                        <Input type="email" placeholder="Username" value={formFields.username} name="username"
                               onChange={handleChange}/>
                    </IconInput>
                    <IconInput>
                        <PasswordIcon/>
                        <Input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formFields.password}
                            onChange={handleChange}
                        />
                    </IconInput>
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                    <Button onClick={handleSubmit}>
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
