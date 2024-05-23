import React, { useEffect, useState } from 'react';
import EducationalPlan from "./EducationalPlan.tsx";
import axios from "../../api/axios";
import {Box, Button, CircularProgress, IconButton, Select, useTheme} from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Portal, { createContainer } from "../../eduComponents/Board/Portal.ts";
import styled from "styled-components";
import StudentCard from "../../components/StudentCard";
import SchoolIcon from "@mui/icons-material/School";
import { tokens } from "../../theme";
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./Dashboard.css";
import MultipleSelectChip from "../../shared/MultipleSelect";
import Switch from "@mui/material/Switch";
import {IOSSwitch} from "../../shared/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import {ProgressLineGraph} from './ProgressLineGraph'
import {StatusPie} from './StatusPie';

const StatusOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
`;
const StatusContainer = styled.div`
  margin: 0 40px;
`;
const FiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const CardContainer = styled.div`
  margin-right: 10px;
  width: 280px;
`;
const SliderContainer = styled.div`
  margin: 0 20px;
  width: 80%;
  :hover {
    cursor: pointer;
  }
`;

const SliderWrapper = styled.div`
    position: relative;
    overflow: hidden;
    padding: 20px;
    display: flex;
    flex-direction: row;
`;

const SlideContainer = styled.div`
    display: flex;
    transition: transform 0.5s;
    transform: translateX(-${props => props.currentIndex * (100 / 4)}%);
`;

const SlideItem = styled.div`
    flex: 0 0 calc(100% / 4);
`;
const SlideArrow = styled.div`
  border-radius: 50px;
  width: 30px;
  padding: 5px;
  height: 30px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #d7d2d2;
`

export const CustomSlider = ({ children, activeStudentIndex }) => {
    const [currentIndex, setCurrentIndex] = useState(activeStudentIndex);

    useEffect(() => {
        setCurrentIndex(activeStudentIndex);
    }, [activeStudentIndex]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToPrevSlide = () => {
        const index = (currentIndex + children.length - 3) % children.length;
        goToSlide(index);
    };

    const goToNextSlide = () => {
        const index = (currentIndex + 3) % children.length;
        goToSlide(index);
    };

    return (
        <div>
            <SlideArrow onClick={goToPrevSlide}><ArrowBackIosOutlinedIcon/></SlideArrow>
        <SliderWrapper>
            <SlideContainer currentIndex={currentIndex}>
                {React.Children.map(children, (child, index) => (
                    <SlideItem key={index}>
                        {React.cloneElement(child, {
                            active: index === currentIndex % children.length // Проверяем, является ли текущий индекс активным
                        })}
                    </SlideItem>
                ))}
            </SlideContainer>
        </SliderWrapper>
            <SlideArrow onClick={goToNextSlide}><ArrowForwardIosOutlinedIcon/></SlideArrow>
        </div>
    );
};





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
    const [tempPlan, setTempPlan] = useState({});
    const [planData, setPlanData] = useState([]);
    const [resultData, setResultData] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [pieData, setPieData] = useState();
    const [activeStudentIndex, setActiveStudentIndex] = useState(-1);
    useEffect(() => {
        console.log('Данные об уникальном плане', uniquePlan);
        if (tempPlan.modules && tempPlan.modules.length > 0) {
            const modules = tempPlan.modules;
            // Объединение всех карточек в один массив
            const cardsData = modules.reduce((acc, module) => {
                return acc.concat(module.cards);
            }, []);
            console.log(cardsData, 'дата по карточкам');
            //TODO заполнить данные для StatusPie по статусам карточек
            function timeToMinutes(time) {
                if (time) {
                    const [hours, minutes, seconds] = time.split(':').map(Number);
                    return hours + Math.round(minutes/60);
                }
                else return 1
            }

            // Создание массива preparedPlanData
            const preparedPlanData = cardsData.map(card => ({
                x: card.title,
                y: timeToMinutes(card.plan_time)
            }));

            // Создание массива preparedResultData
            const preparedResultData = cardsData.map(card => ({
                x: card.title,
                y: timeToMinutes(card.result_time)
            }));
            setPlanData(preparedPlanData);
            setResultData(preparedResultData);

            console.log('preparedPlanData', preparedPlanData);
            console.log('preparedResultData', preparedResultData);
        }
    }, [tempPlan]);
    useEffect(() => {
        setGraphData([
            {
                "id": "Планируемое время",
                "color": "hsl(42, 70%, 50%)",
                "data": planData
            },
            {
                "id": "Фактическое время",
                "color": "hsl(265, 70%, 50%)",
                "data": resultData
            }
        ])
    }, [planData,resultData])
    // const data = [
    //     {
    //         "id": "Планируемое время",
    //         "color": "hsl(42, 70%, 50%)",
    //         "data": planData
    //     },
    //     {
    //         "id": "Фактическое время",
    //         "color": "hsl(265, 70%, 50%)",
    //         "data": resultData
    //     }
    // ];

    const [currentIndex, setCurrentIndex] = useState(() => {
        const storedIndex = localStorage.getItem('studentIndex');
        return storedIndex !== null ? +storedIndex : -1;
    });

    const handleStudentClick = (id, index) => {
        setUniqueId(id);
        setActiveStudentIndex(index);
        localStorage.setItem('activePlanId', id);
        localStorage.setItem('studentIndex', index.toString());
    };


    const action = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => { setStatusShown(false); }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    );
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
        pauseOnHover: true,
        nextArrow: <SampleNextArrow  />,
        prevArrow: <SamplePrevArrow />
    };


    useEffect(() => {
        const temporaryId = localStorage.getItem('activePlanId');
       if (uniqueId !== '') {
           getPlanById(uniqueId);
       } else if (temporaryId !== '') {
           getPlanById(temporaryId);
       }
       console.log(uniqueId, 'Уникальный id');
    }, [uniqueId]);

    useEffect(() => {
        const index = studentsList.findIndex((item) => item.id === uniqueId);
        setActiveStudentIndex(index);
        localStorage.setItem('studentIndex', index.toString());
    }, [uniqueId, studentsList]);



    useEffect(() => {
        getUsers();
        createContainer({ id: MODAL_CONTAINER_ID });
        setMounted(true);
    }, []);
    useEffect(() => {
        const activePlanId = localStorage.getItem('activePlanId');
        const studentIndex = localStorage.getItem('studentIndex');

        if (activePlanId && studentsList.some(student => student.id === activePlanId)) {
            setUniqueId(activePlanId);
        } else if (studentsList.length > 0) {
            setUniqueId(studentsList[0].id);
        }

        if (studentIndex !== null && !isNaN(studentIndex) && parseInt(studentIndex) >= 0 && parseInt(studentIndex) < studentsList.length) {
            setActiveStudentIndex(parseInt(studentIndex));
        }
    }, [studentsList]);

    useEffect(() => {
        const activePlanId = localStorage.getItem('activePlanId');
        const studentIndex = localStorage.getItem('studentIndex')
        if (activePlanId) {
            setUniqueId(activePlanId);
        }
        if (studentIndex) {
            setActiveStudentIndex(+studentIndex);
        }
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
            console.log('Все юзеры', response?.data?.plans);
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
            console.log(response?.data, 'план по id');
            setLoadingStatus('success');
            setUniquePlan(response?.data);
            setTempPlan(response.data);
            localStorage.setItem('activePlanId', id);
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
                    <div>
                        <Snackbar
                            open={statusShown}
                            autoHideDuration={4000}
                            onClose={() => { setStatusShown(false); }}
                            // message="План загружен"
                            action={action}
                        >
                        <Alert onClose={() => { setStatusShown(false); }} severity="success">
                            <AlertTitle>Образовательный план получен</AlertTitle>
                        </Alert>
                        </Snackbar>
                    </div>
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
            <Box>
                <SliderContainer>
                    <FiltersContainer>
                        <MultipleSelectChip names={studentsList.reduce((acc, student) => {
                            acc.push(student.first_name + ' ' + student.last_name);
                            return acc;
                        }, [])} label='ФИО'/>
                        <MultipleSelectChip names={studentsList.reduce((acc, student) => {
                            acc.push(student.discipline);
                            return acc;
                        }, [])} label='Дисциплина'/>
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1, marginLeft: '40px' }} />}
                            label="Скрыть неактивных студентов"
                        />
                    </FiltersContainer>
                    <div style={{display: 'flex', flexDirection: 'row', marginLeft: '10px'}}>
                    {studentsList.length >= 3 && (
                        <CustomSlider activeStudentIndex={activeStudentIndex} activeClassName="active-card">
                            {studentsList.map((student, index) => (
                                <div key={index}>
                                    <CardContainer>
                                        <Box
                                            backgroundColor={index === activeStudentIndex ? colors.educationalPlan.card : colors.primary[400]}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            onClick={() => handleStudentClick(student?.id, index)}
                                            borderRadius='8px'
                                        >
                                            <StudentCard
                                                personalInfo={student} icon={<SchoolIcon sx={{ color: colors.greenAccent[600], fontSize: "26px", margin: "10px" }} />} />
                                        </Box>
                                    </CardContainer>
                                </div>
                            ))}
                        </CustomSlider>
                    )}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginLeft: '10px'}}>
                    {studentsList.length < 3 && studentsList.map((student, index) => (
                        <div key={index}>
                            <CardContainer>
                                <Box
                                    backgroundColor={index === activeStudentIndex ? colors.educationalPlan.card : colors.primary[400]}
                                    display="flex"
                                    alignItems="center"
                                    flexDirection='row'
                                    justifyContent="center"
                                    onClick={() => setUniqueId(student?.id)}
                                    borderRadius='8px'
                                >
                                    <StudentCard personalInfo={student} icon={<SchoolIcon sx={{ color: colors.greenAccent[600], fontSize: "26px", margin: "10px" }} />} />
                                </Box>
                            </CardContainer>
                        </div>
                    ))}
                    </div>
                </SliderContainer>
                <Box>
                    <div style={{ height: '300px', width: '800px', marginTop: '40px'}}>
                        <ProgressLineGraph data={graphData}/>
                    </div>
                </Box>
            </Box>
            {loadingStatus === 'success' && <EducationalPlan uniquePlan={uniquePlan} getPlan={() => getPlanById(uniqueId)} />}
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
