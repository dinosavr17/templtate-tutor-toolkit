import React, { useEffect, useState } from 'react';
import EducationalPlan from "./EducationalPlan.tsx";
import axios from "../../api/axios";
import { Box, CircularProgress, Grid, useTheme } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Portal, { createContainer } from "../../eduComponents/Board/Portal.ts";
import styled from "styled-components";
import StudentCard from "../../components/StudentCard";
import SchoolIcon from "@mui/icons-material/School";
import { tokens } from "../../theme";
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./Dashboard.css";



const StatusOverlay = styled.div`
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
const StatusContainer = styled.div`
  margin: 0 40px;
`;
const CardContainer = styled.div`
  margin-right: 20px;
`;
const SliderContainer = styled.div`
  margin: 0 30px;
  width: 70%;
  :hover {
    cursor: pointer;
  }
`;

const PlansStorage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loadingStatus, setLoadingStatus] = useState('unset');
    const [isMounted, setMounted] = useState(false);
    const MODAL_CONTAINER_ID = 'modal-container-id';
    const [statusShown, setStatusShown] = useState(false);
    const [studentsList, setStudentsList] = useState([]);
    const [uniqueId, setUniqueId] = useState('');
    const [uniquePlan, setUniquePlan] = useState({});
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                onClick={onClick}
            />
        );
    }
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        nextArrow: <SampleNextArrow  />,
        prevArrow: <SamplePrevArrow />
    };


    useEffect(() => {
       if (uniqueId !== '') {
           getPlanById(uniqueId)
       }
    }, [uniqueId]);

    useEffect(() => {
        getUsers();
        createContainer({ id: MODAL_CONTAINER_ID });
        setMounted(true);
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get('api/education_plan/get_users_data', {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
                },
                withCredentials: true
            });
            setStudentsList(response?.data?.plans);
            setUniqueId(response?.data?.plans[0].id);
        } catch (err) {
            if (!err?.response) {
                setLoadingStatus('error');
            }
        }
    };

    const getPlanById = async (id) => {
        setStatusShown(true);
        setLoadingStatus('loading');
        try {
            const response = await axios.get(`api/education_plan/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
                },
            });
            console.log(response?.data, 'объект с планами');
            setLoadingStatus('success');
            setUniquePlan(response?.data);
        } catch (err) {
            setLoadingStatus('error');
        }
    };

    const renderStatusContent = () => {
        const content = {
            unset: () => {
                return;
            },
            loading: () => {
                return <CircularProgress sx={{ height: '100px !important', width: '100px !important' }} color='secondary' />;
            },
            success: () => {
                return (
                    <Alert onClose={() => { setStatusShown(false); }} severity="success">
                        <AlertTitle>Успешно</AlertTitle>
                    </Alert>
                );
            },
            error: () => {
                return (
                    <Alert onClose={() => { setStatusShown(false); }} severity="error">
                        <AlertTitle>Ошибка</AlertTitle>
                        Произошла ошибка во время получения учебных планов — <strong> Попробуйте еще раз!</strong>
                    </Alert>
                );
            },
        };

        return content[loadingStatus]();
    };

    return (
        <div>
            <Box margin="20px">
               <SliderContainer>
                <Slider {...settings}>
                    {studentsList.map((student, index) => (
                        <div key={index}>
                            <CardContainer>
                                    <Box
                                        backgroundColor={colors.primary[400]}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        onClick={() => setUniqueId(student?.id)}
                                    >
                                        <StudentCard personalInfo={student} icon={<SchoolIcon sx={{ color: colors.greenAccent[600], fontSize: "26px", margin: "10px" }} />} />
                                    </Box>
                            </CardContainer>
                        </div>
                    ))}
                </Slider>
               </SliderContainer>
            </Box>
            {loadingStatus === 'success' && <EducationalPlan uniquePlan={uniquePlan} />}
            {isMounted &&
                <Portal id={MODAL_CONTAINER_ID}>
                    {statusShown &&
                        <StatusOverlay>
                            <StatusContainer style={{ display: 'flex' }}>
                                {renderStatusContent()}
                            </StatusContainer>
                        </StatusOverlay>
                    }
                </Portal>
            }
        </div>
    );
};

export default PlansStorage;
