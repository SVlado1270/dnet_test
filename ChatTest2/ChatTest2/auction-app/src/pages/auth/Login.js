import React, {useState} from "react";
import walletLogo from "../../assets/wallet.svg";
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {
    Button,
    ContentWrapper, CreateAccountLink, ErrorMessage,
    FormWrapper,
    IconInput, Input,
    PageTitle,
    PageWrapper,
    PasswordIcon,
    SvgWrapper,
    UserIcon
} from "./styles";


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
