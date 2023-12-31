import React, {useEffect, useState} from 'react';
import EducationalPlan from "./EducationalPlan.tsx";
import axios from "../../api/axios"
import {CircularProgress} from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Portal, {createContainer} from "../../eduComponents/Board/Portal.ts";
import styled from "styled-components";

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
    const [loadingStatus, setLoadingStatus] = useState('unset');
    const [isMounted, setMounted] = useState(false);
    const MODAL_CONTAINER_ID = 'modal-container-id';
    const [statusShown, setStatusShown] = useState(false);
    useEffect(() => {
        getPlans();
        createContainer({id: MODAL_CONTAINER_ID});
        setMounted(true);
    }, [])
    const getPlans = async () => {
        setStatusShown(true);
        setLoadingStatus('loading');
        try {
            const response = await axios.get('api/educational_plan/',
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
            // // if (!err?.response) {
            // //     setErrMsg('No Server Response');
            // // } else if (err.response?.status === 409) {
            // //     setErrMsg('Username Taken');
            // // } else {
            // //     setErrMsg('Registration Failed')
            // // }
            // // errRef.current.focus();
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
        <div>
            <EducationalPlan/>
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