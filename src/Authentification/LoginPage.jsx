import React, { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios'

import {Link, useNavigate, useLocation, Navigate} from 'react-router-dom';
import {
    Box, CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput, Pagination,
    Select,
    Step,
    StepLabel
} from "@mui/material";
import tutor from "../asserts/images/teacher_login.png";
import student from "../asserts/images/student_login.png";
import login_img from "../asserts/images/login.png";
import lottie from "lottie-web";
import appLogo from "../asserts/images/Logo.png";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Portal from "../../src/eduComponents/Board/Portal.ts";
import {
    MainWrapper,
    PaginationWrapper,
    StyledStepper,
    MainHeader,
    AuthorizationWrapper,
    LogoWrapper,
    RegistrationCard,
    RegistrationImageBlock,
    RegistrationFormWrapper,
    RegistrationLabel,
    RegistrationForm,
    RegisterButton,
    StatusOverlay,
    StatusContainer,
} from './Register';
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// Now you can use these styled components in your code.


const Login = () => {
    const {setAuth,login} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [isMounted, setMounted] = useState(false);
    const MODAL_CONTAINER_ID = 'modal-container-id';
    const [statusShown, setStatusShown] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('unset');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [domain, setDomain] = useState('@gmail.com');


    const handleSubmit = async (e) => {

        try {
            const response = await axios.post('api/account/token/',
                JSON.stringify({ email: email+domain, password: password, }),
                {

                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:3000',
                    },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            console.log(JSON.stringify(response));
            const accessToken = response?.data?.access;
            console.log('token', accessToken);
            localStorage.setItem("userData", JSON.stringify({
                accessToken: accessToken
            }))
            setAuth({email,password, accessToken});
            // login(accessToken,username)
            // setUsername('');
            // setPassword('');
            // navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                // setErrMsg('No Server Response');
                console.log(err);
            } else if (err.response?.status === 400) {
                // setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                // setErrMsg('Unauthorized');
            } else {
                // setErrMsg('Login Failed');
            }
        }
    }
    const renderStatusContent = () => {
        const content = {
            unset: () => {
                return;
            },
            loading: () => {
                return <CircularProgress
                    sx={{height: '100px !important', width: '100px !important'}}
                    color='secondary'/>
            },
            success: () => {
                return <Alert
                    onClose={() => {
                        setStatusShown(false);
                    }}
                    severity="success">
                    <AlertTitle>Успешно</AlertTitle>
                    Вы  — <strong>успешно зарегистрированы!</strong>
                </Alert>
            },
            error: () => {
                return <Alert
                    onClose={() => {
                        setStatusShown(false);
                    }}
                    severity="error"
                >
                    <AlertTitle>Ошибка</AlertTitle>
                    Произошла ошибка во время регистрации
                    — <strong> Попробуйте еще раз!</strong>
                </Alert>
            },
        };

        return content[loadingStatus]();
    };

    return (
        <AuthorizationWrapper>
            <MainWrapper>
                <RegistrationCard>
                    <RegistrationImageBlock>
                        <img src={login_img}/>
                    </RegistrationImageBlock>
                    <RegistrationFormWrapper className='card'>
                        <RegistrationLabel>
                            <LogoWrapper>
                                <img src={appLogo}/>
                                <span style={{fontSize: '16px'}}>Войти</span>
                            </LogoWrapper>
                        </RegistrationLabel>
                        <RegistrationForm onSubmit={handleSubmit}>
                            <FormControl sx={{m: 1}} variant="outlined" color='secondary'>
                                <InputLabel htmlFor="outlined-adornment-email"
                                            sx={{paddingRight: '0'}}>Email</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-email"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: 'black',
                                            padding: '0',
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            paddingRight: '0',
                                        },
                                        "& .MuiInputAdornment-root": {
                                            padding: '0',
                                        },
                                        paddingRight: '0 !important'
                                    }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    inputProps={{style: {color: 'black'}}}
                                    label="Email"
                                    endAdornment={
                                        <InputAdornment position="end" sx={{padding: 0}}>
                                            <Select
                                                label="Domain"
                                                value={domain}
                                                onChange={(e) => setDomain(e.target.value)}
                                                color='secondary'
                                            >
                                                <MenuItem value="@gmail.com">@gmail.com</MenuItem>
                                                <MenuItem value="@mail.ru">@mail.ru</MenuItem>
                                                <MenuItem value="@yandex.ru">@yandex.ru</MenuItem>
                                            </Select>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <FormControl sx={{m: 1}} variant="outlined" color='secondary'>
                                <InputLabel htmlFor="outlined-adornment-password"
                                            sx={{color: 'black'}}>Пароль</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: 'black',
                                        },
                                    }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    inputProps={{style: {color: 'black'}}}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Пароль"
                                />
                            </FormControl>
                        </RegistrationForm>
                        <div>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 auto' }} />
                                    <RegisterButton onClick={() => {
                                        handleSubmit();
                                    }}>Войти
                                    </RegisterButton>
                            </Box>
                            <p>
                                    Еще не зарегистрированы?<br/>
                                    <span className="line">
                                <a href="register">Зарегистрироваться</a>
                        </span>
                            </p>
                        </div>
                        {isMounted &&
                        <Portal id={MODAL_CONTAINER_ID}>
                            {statusShown &&
                            <StatusOverlay>
                                <StatusContainer style={{display: 'flex'}}>
                                    {renderStatusContent()}
                                </StatusContainer>
                            </StatusOverlay>
                            }
                        </Portal>
                        }
                    </RegistrationFormWrapper>
                </RegistrationCard>
            </MainWrapper>
        </AuthorizationWrapper>

    )
}

export default Login