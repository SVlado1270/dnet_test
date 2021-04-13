import React, {useState} from "react";
import styled from "styled-components";
import walletLogo from "../assets/finance.svg";
import { AiOutlineMail, AiOutlineUnlock, AiOutlineUser} from "react-icons/ai";
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
    height: 50%;
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

export const UserIcon = styled(AiOutlineUser)`
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

export const TermsTitle = styled.span`
    color: #504f60;
    font-size: 13px;
`;

export const ErrorMessage = styled.span`
    color: red;
`;

function Register() {
    const [formFields, setFormFields] = useState({fullName: "", password: "", username: ""});
    const [errorMessage, setErrorMessage] = useState("");
    const history = useHistory();

    const handleChange = (event) => {
        if(errorMessage !== ""){
            setErrorMessage("");
        }
        setFormFields({...formFields, [event.target.name]: event.target.value})
    }

    const handleSubmit = () => {
        if (formFields.fullName === "" || formFields.password === "" || formFields.username === "") {
            setErrorMessage("All fields are required");
            return;
        }
        const headers = {
            'Content-Type': 'application/json',
        }
        axios.post(`http://localhost:63920/api/v1/users/Register`, {
            UserName: formFields.username,
            Password: btoa(formFields.password),
            FullName: formFields.fullName
        }, {headers})
            .then((response) => {
                if (response.status === 201) {
                    history.push('/login');
                }
            })
            .catch((error) => {
                setErrorMessage(error.response.data);
            })

    }
    return (
        <PageWrapper>
            <ContentWrapper>
                <PageTitle>Register</PageTitle>
                <SvgWrapper>
                    <img src={walletLogo} alt="auction logo"/>
                </SvgWrapper>
                <FormWrapper>
                    <IconInput>
                        <UserIcon/>
                        <Input
                            type="text"
                            placeholder="Username"
                            value={formFields.username}
                            onChange={handleChange}
                            name="username"
                        />
                    </IconInput>
                    <IconInput>
                        <EmailIcon/>
                        <Input
                            type="text"
                            placeholder="Full Name"
                            value={formFields.fullName}
                            onChange={handleChange}
                            name="fullName"
                        />
                    </IconInput>
                    <IconInput>
                        <PasswordIcon/>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={formFields.password}
                            onChange={handleChange}
                            name="password"
                        />
                    </IconInput>
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                    <TermsTitle>I agree with Terms and Conditions</TermsTitle>
                    <Button onClick={handleSubmit}>
                        Submit
                    </Button>
                </FormWrapper>
                <CreateAccountLink to="/login">
                    Already have an account? Sign in
                </CreateAccountLink>
            </ContentWrapper>
        </PageWrapper>
    )
        ;
}


export default Register;
