import React, {useEffect, useState} from 'react';
import EducationalPlan from "./EducationalPlan.tsx";
import axios from "../../api/axios"
import {Box, CircularProgress, useTheme} from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Portal, {createContainer} from "../../eduComponents/Board/Portal.ts";
import styled from "styled-components";
import StudentCard from "../../components/StudentCard";
import SchoolIcon from "@mui/icons-material/School";
import {tokens} from "../../theme";
import StatBox from "../../components/StatBox";
import TrafficIcon from "@mui/icons-material/Traffic";

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


const PlansStorage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loadingStatus, setLoadingStatus] = useState('unset');
    const [isMounted, setMounted] = useState(false);
    const MODAL_CONTAINER_ID = 'modal-container-id';
    const [statusShown, setStatusShown] = useState(false);
    const [uniqueId, setUniqueId] = useState('');
    const [uniquePlan, setUniquePlan] = useState({});
    const studentData = [
        {
            name: 'Павел',
            lastName: 'Дуров',
            age: 9,
            discipline: ['Python'],
            status: 'active',
            parent: null
        },
        {
            name: 'Марк',
            lastName: 'Цукерберг',
            age: 60,
            discipline: ['ЕГЭ Информатика'],
            status: 'inactive',
            parent: null
        },
        {
            name: 'Стив',
            lastName: 'Джобс',
            age: 10,
            discipline: ['ОГЭ Математика', 'ОГЭ Информатика'],
            status: 'inactive',
            parent: {
                name: 'Mum Jobs',
            }
        },
    ]
    useEffect(() => {
        console.log('uniquePlan updated:', uniquePlan);
    }, [uniquePlan]);
    useEffect(() => {
        // getPlans();
        getUsers();
        createContainer({id: MODAL_CONTAINER_ID});
        setMounted(true);
    }, [])
    const getUsers = async (e) => {

        try {
            const response = await axios.get('api/education_plan/get_users_data',
                {

                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:3000',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
                    },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            setUniqueId(response?.data?.plans[1].id);

        } catch (err) {
            if (!err?.response) {
                setLoadingStatus('error');
            }
        }
    };


    const getPlanById = async () => {
        setStatusShown(true);
        setLoadingStatus('loading');
        try {
            const response = await axios.get(`api/education_plan/${uniqueId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
                },
            })
            console.log(response?.data, 'объект с планами');
            // // console.log(response, 'resp');
            // if (response.status === 201) {
            //     setLoadingStatus('success');
            // }
            // else setLoadingStatus('error');
            setLoadingStatus('success');
            setUniquePlan(response?.data);

        } catch (err) {
            setLoadingStatus('error');
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
                        Произошла ошибка во время получения учебных планов
                        — <strong> Попробуйте еще раз!</strong>
                    </Alert>
                },
            };

            return content[loadingStatus]();
        };

    return (
        <div>
            {/*<Box*/}
            {/*    gridColumn="span 3"*/}
            {/*    backgroundColor={colors.primary[400]}*/}
            {/*    display="flex"*/}
            {/*    alignItems="center"*/}
            {/*    justifyContent="center"*/}
            {/*    onClick={getPlanById}*/}
            {/*>*/}
            {/*    <StudentCard personalInfo={studentData[0]} icon={*/}
            {/*        <SchoolIcon*/}
            {/*            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}*/}
            {/*        />*/}
            {/*    }/>*/}
            {/*</Box>*/}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
                margin="20px"
            >
                {/* ROW 1 */}
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={getPlanById}
                >
                    <StudentCard personalInfo={studentData[0]} icon={
                        <SchoolIcon
                            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                        />
                    }/>
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StudentCard personalInfo={studentData[1]} icon={
                        <SchoolIcon
                            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                        />
                    }/>
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StudentCard personalInfo={studentData[2]} icon={
                        <SchoolIcon
                            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                        />
                    }/>
                </Box>
                {/*<Box*/}
                {/*    gridColumn="span 3"*/}
                {/*    backgroundColor={colors.primary[400]}*/}
                {/*    display="flex"*/}
                {/*    alignItems="center"*/}
                {/*    justifyContent="center"*/}
                {/*>*/}
                {/*    <StatBox*/}
                {/*        title="1,325,134"*/}
                {/*        subtitle="Traffic Received"*/}
                {/*        progress="0.80"*/}
                {/*        increase="+43%"*/}
                {/*        icon={*/}
                {/*            <TrafficIcon*/}
                {/*                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}*/}
                {/*            />*/}
                {/*        }*/}
                {/*    />*/}
                {/*</Box>*/}
            </Box>
            {/*<button onClick={getPlanById}>Иванов Петя</button>*/}
            {/*<EducationalPlan uniquePlan={() => {getPlanById()}}/>*/}
            {loadingStatus === 'success' &&
            <EducationalPlan uniquePlan={uniquePlan}/>
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
        </div>
    );
};

export default PlansStorage;
