import React, {useState} from "react";
import styled from "styled-components";
import walletLogo from "../../assets/finance.svg";
import { AiOutlineMail, AiOutlineUnlock, AiOutlineUser} from "react-icons/ai";
import {Link, useHistory} from "react-router-dom";
import axios from 'axios';
import {
    Button,
    ContentWrapper, CreateAccountLink, ErrorMessage,
    FormWrapper,
    IconInput,
    PageTitle,
    PageWrapper,
    PasswordIcon,
    SvgWrapper, TermsTitle,
    UserIcon,
    Input, RegisterIconInput
} from "./styles";



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
                    <RegisterIconInput>
                        <UserIcon/>
                        <Input
                            type="text"
                            placeholder="Username"
                            value={formFields.username}
                            onChange={handleChange}
                            name="username"
                        />
                    </RegisterIconInput>
                    <RegisterIconInput>
                        <UserIcon/>
                        <Input
                            type="text"
                            placeholder="Full Name"
                            value={formFields.fullName}
                            onChange={handleChange}
                            name="fullName"
                        />
                    </RegisterIconInput>
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
