import React, { useRef, useState, useEffect, } from "react";
import axios from "../api/axios";
import styled from 'styled-components'
import  lottie from "lottie-web";
import kanban from "../lotties/kanban.json";

import {
    Box, Button, CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel, makeStyles, MenuItem,
    OutlinedInput, Pagination, Select,
    Step, StepButton,
    StepLabel,
    Stepper,
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import tutor from '../asserts/images/tutor.png';
import student_login from '../asserts/images/student_login.png';
import appLogo from '../asserts/images/Logo.png'
import Portal, {createContainer} from "../eduComponents/Board/Portal.ts";
import Alert from "@mui/material/Alert";
import AlertTitle from '@mui/material/AlertTitle';
import {useAuth} from "../context/AuthContext";

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(218deg,  #151632, #304080, #4774d5, #4ab8f3);
  height: 100vh;
  @media (min-width: 320px) {
    justify-content: flex-start;
    margin-top: 0;
  }
  @media (min-width: 768px) {
    justify-content: center;
  }
`;
export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  height: 200px;
  margin: 40px;
  align-items: center;
`

export const StyledStepper = styled(Stepper)`
  .MuiStepIcon-root {
    color: #151632;
  }
  .MuiStepIcon-text {
    font-size: 16px;
  }

  .MuiStepIcon-root.Mui-completed {
    color: #36d025;
  }

  .MuiStepIcon-root.Mui-active {
    color: #40a5d5;
  }

  .MuiStepLabel-label {
    color: #ebdcdc;
    @media (min-width: 320px) {
      font-size: 12px;
    }
    @media (min-width: 400px) {
      font-size: 16px;
    }
  }

  .MuiStepLabel-label.Mui-active {
    color: #ebdcdc;
  }

  .MuiStepLabel-label.Mui-completed {
    color: #ebdcdc;
  }
`;
export const MainHeader = styled.div `
display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 10px;
  color: white;
  text-align: center;
  font-family: Bryndan Write;
  font-size: 30px;
  font-style: normal;
  font-weight: 100;
  line-height: 80%; /* 94.15px */
  text-transform: uppercase;
  box-shadow: #555555;
  margin-top: 40px;
  & > span {
    margin: 5px;
  }
`
export const AuthorizationWrapper = styled.div`
  width: 100vw;
  height: 100%;
`;
export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  & > img {
    width: 50px;
  }
  & > span {
    margin-left: 10px;
    color: #151632;
    text-align: center;
    //font-family: Bryndan Write;
    @media (min-width: 320px) {
      font-size: 20px;
    }
    font-size: 20px;
    font-style: normal;
    font-weight: 300;
    //line-height: 80%; /* 94.15px */
  }
`;
export const RegistrationCard = styled.div`
  display: grid;
  //grid-template-columns: 0.45fr 1fr;
  flex-direction: row;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 9%) 0px 9px 12px, rgb(0 0 0 / 6%) 0px 6px 6px;
  cursor: pointer;
  margin: 80px;
  max-width: 100%;
  overflow: hidden;
  @media (min-width: 320px) {
    margin: 20px 40px 60px 40px;
    grid-template-columns: 0fr 1fr;
  }
  @media (min-width: 768px) {
    margin: 0px 80px 20px 80px;
    grid-template-columns: 0.75fr 1fr;
  }
  //@media (min-width: 1024px) {
  //  margin: 20px 120px 100px 120px;
  //}
  //@media (min-width: 1440px) {
  //  margin: 20px 160px 100px 120px;
  //}
`;

export const RegistrationImageBlock = styled.div`
  @media (min-width: 320px) {
    & > img {
      display: none;
    }
  }
  @media (min-width: 660px) {
    & > img, div {
      width: 350px;
      display: block;
      margin-top: 50px;
    }
    }
    @media (min-width: 1024px) {
      & > img, div {
        width: 450px;
      }
  }
`;

export const RegistrationFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: visible;
  background-color: white;
`;
export const TutorInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 300;
  justify-content: center;
  text-align: center;
  font-style: italic;
  & > p {
    margin: 5px 0;
  }
`;
export const TutorVitalInfo = styled.span`
  font-weight: bold;
  color: #304080;
`;
export const RegistrationLabel= styled.div`
  font-weight: bold;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const RegistrationForm = styled.form`
  display: flex;
  flex-direction: column;
  overflow: visible;
`;

export const RegisterButton = styled(Button)`
  && {
    &.Mui-disabled {
      color: #fff4e8;
      cursor: not-allowed;
      background-color: #818181;
    }

    margin: 0 8px;
    background-color: #151632;
    color: white;
    //border-radius: 10px;
    padding: 5px 10px;

    &:hover {
      background-color: #40a5d5;
    }
  }
`;

export const StatusOverlay = styled.div`
  background: rgba(73, 71, 71, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  z-index: 10001;
`;

export const StatusContainer = styled.div`
  margin: 0 40px;
`;

const USER_REGEX = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const Register = () => {
    const { user, login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('tutor');
    const [tutorData, setTutorData] = useState({});
    const [individualCode, setIndividualCode] = useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        // event.preventDefault();
    };
    const [isMounted, setMounted] = useState(false);
    const MODAL_CONTAINER_ID = 'modal-container-id';
    const [statusShown, setStatusShown] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('unset');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [domain, setDomain] = useState('@gmail.com');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };



    useEffect(() => {
        const params = new URLSearchParams(document.location.search);
        const inviteCode = params.get('inviteCode');
        setIndividualCode(inviteCode);
        if (inviteCode) {
            setRole('student');
        } else {
            setRole('tutor');
        }
        createContainer({id: MODAL_CONTAINER_ID});
        setMounted(true);
    }, []);

    useEffect(() => {
        console.log(role);

        const getTutorData = async () => {
            try {
                const response = await axios.get(`api/education_plan/invite_info/${individualCode}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:3000',
                    },
                });
                console.log(response?.data, 'данные учителя');
                setTutorData(response?.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    alert('Ссылка приглашение неверна');
                } else if (err.response?.status === 404) {
                    alert('Ссылка приглашение уже использована');
                }
            }
        };
        if (role === 'student') {
            getTutorData();
        }
    }, [role])


    React.useEffect(() => {
        lottie.loadAnimation({
            container: document.querySelector("#kanban"),
            animationData: kanban,
            name:"animationOne",
            autoplay: false,
            loop: true,
        });



    }, []);


    const handleSubmit = async () => {
        setStatusShown(true);
        setLoadingStatus('loading');
        try {
            const response = await axios.post('api/account/register/',
                JSON.stringify({ email: email+domain, password: password, role: 'tutor',
                    first_name: firstName, last_name: lastName}),
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            console.log(response, 'resp');
            if (response.status === 201) {
                setLoadingStatus('success');
            }
            else setLoadingStatus('error');
        } catch (err) {
            setLoadingStatus('error');
        }
    }
    const handleStudentConnect = async () => {
        console.log('подключение студента');
        setStatusShown(true);
        setLoadingStatus('loading');
        try {
            const response = await axios.post('api/account/register/',
                JSON.stringify({
                    email: email+domain,
                    password: password,
                    role: 'student',
                    invite_code: individualCode
                }),
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            console.log(response, 'resp');
            if (response.status === 201) {
                const handleLoginStudent = async () => {
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
                        login({ email, password, accessToken });
                        setLoadingStatus('success');
                        window.location.href = '/edu';
                    } catch (err) {
                        setLoadingStatus('error');
                        if (!err?.response) {
                            console.log(err);
                        }
                    }
                }
                handleLoginStudent();
            }
            else setLoadingStatus('error');
        } catch (err) {
            setLoadingStatus('error');
        }
    }
    const steps = [
        'Старт',
        'Персональные данные',
        'Финал',
    ];
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
                if (role === 'tutor') {
                    return <Alert
                        onClose={() => {
                            setStatusShown(false);
                        }}
                        severity="success">
                        <AlertTitle>Успешно</AlertTitle>
                        Вы — <strong>успешно зарегистрированы!</strong>
                    </Alert>
                } else {
                    return <Alert
                        onClose={() => {
                            setStatusShown(false);
                        }}
                        severity="success">
                        <AlertTitle>Успешно</AlertTitle>
                        Вы — <strong>успешно подкючены к преподавателю!</strong>
                    </Alert>
                }
            },
            error: () => {
                if (role === 'tutor') {
                    return <Alert
                        onClose={() => {
                            setStatusShown(false);
                            setActiveStep(0);
                        }}
                        severity="error"
                    >
                        <AlertTitle>Ошибка</AlertTitle>
                        Произошла ошибка во время регистрации
                        — <strong> Попробуйте еще раз!</strong>
                    </Alert>
                } else {
                    return <Alert
                        onClose={() => {
                            setStatusShown(false);
                            setActiveStep(0);
                        }}
                        severity="error"
                    >
                        <AlertTitle>Ошибка</AlertTitle>
                        Произошла ошибка при подключении к преподавателю
                        — <strong> Попробуйте еще раз!</strong>
                    </Alert>
                }
            },
        };

        return content[loadingStatus]();
    };


    return (
        <AuthorizationWrapper>
                <MainWrapper>
                    {role === 'tutor' && activeStep === 2 &&
                    <PaginationWrapper>
                        <Alert severity="info">
                            <AlertTitle>Ваш запрос на регистрацию отправлен!</AlertTitle>
                            {`Проверьте почту - ${email + domain}, вам придет письмо с ссылкой на активацию аккаунта.`}
                        </Alert>
                    </PaginationWrapper>
}
<>
                    {activeStep !== 2 &&
                    <RegistrationCard>
                        <RegistrationImageBlock>
                            {(activeStep !== 2 && role === 'tutor') &&
                            <img src={tutor}/>
                            }
                            {(activeStep !== 2 && role === 'student') &&
                            <img src={student_login}/>
                            }
                        </RegistrationImageBlock>
                        <RegistrationFormWrapper className='card'>
                            <RegistrationLabel>
                                {(activeStep !== 2 && role === 'tutor') &&
                                <LogoWrapper>
                                    <img src={appLogo}/>
                                    <span>Зарегистрироваться</span>
                                </LogoWrapper>
                                }
                                {(activeStep !== 2 && role === 'student') &&
                                <div>
                                    <LogoWrapper
                                        style={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
                                        <img src={appLogo}/>
                                        <span>Tutor Toolkit</span>
                                    </LogoWrapper>
                                    {tutorData &&
                                    <TutorInfoWrapper>
                                        <p>Преподаватель&#160;
                                            <TutorVitalInfo>{tutorData.first_name}&#160;{tutorData.last_name}</TutorVitalInfo><br/>
                                            приглашает вас присоединиться</p>
                                        <p>К курсу:&#160;
                                            <TutorVitalInfo>{tutorData.discipline}</TutorVitalInfo></p>
                                    </TutorInfoWrapper>
                                    }
                                </div>
                                }
                            </RegistrationLabel>
                            <RegistrationForm onSubmit={handleSubmit}>
                                {activeStep === 0 &&
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
                                }
                                {activeStep === 0 &&
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
                                }
                                {(activeStep === 1 && role === 'tutor') &&
                                <FormControl sx={{m: 1}} variant="outlined" color='secondary'>
                                    <InputLabel htmlFor="outlined-adornment-password"
                                                sx={{color: 'black'}}>Имя</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type="text"
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: 'black',
                                            },
                                        }}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        value={firstName}
                                        inputProps={{style: {color: 'black'}}}
                                        label="Имя"
                                    />
                                </FormControl>
                                }
                                {(activeStep === 1 && role === 'tutor') &&
                                <FormControl sx={{m: 1}} variant="outlined" color='secondary'>
                                    <InputLabel htmlFor="outlined-adornment-password"
                                                sx={{color: 'black'}}>Фамилия</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type="text"
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: 'black',
                                            },
                                        }}
                                        onChange={(e) => setLastName(e.target.value)}
                                        value={lastName}
                                        inputProps={{style: {color: 'black'}}}
                                        label="Фамилия"
                                    />
                                </FormControl>
                                }
                            </RegistrationForm>
                            {activeStep !== 2 &&
                            <div>
                                <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                                    {role === 'tutor' &&
                                    <RegisterButton
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                    >
                                        Назад
                                    </RegisterButton>
                                    }
                                    <Box sx={{flex: '1 1 auto'}}/>
                                    {(activeStep === 1 || role === 'student')
                                        ? <RegisterButton onClick={() => {
                                            if (role === 'tutor') {
                                                handleNext();
                                                handleSubmit();
                                            } else {
                                                handleStudentConnect();
                                            }
                                        }}>Зарегистрироваться</RegisterButton>
                                        : <RegisterButton onClick={handleNext}>Далее</RegisterButton>
                                    }
                                </Box>
                                <p>
                                    Уже зарегистрированы?<br/>
                                    <span className="line">
                                <a href="login">Войти</a>
                        </span>
                                </p>
                            </div>
                            }
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
                    }
                    </>
                </MainWrapper>
        </AuthorizationWrapper>

    )
}

export default Register
