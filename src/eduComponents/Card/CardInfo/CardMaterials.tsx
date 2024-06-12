// @ts-ignore
import React, { useEffect, useState } from "react";
import { Calendar, CheckSquare, Tag, Type } from "react-feather";
// @ts-ignore
import { colorsList } from "../../../Helper/Util.ts";
// @ts-ignore
import Modal from "../../Modal/Modal.tsx";
// @ts-ignore
import CustomInput from "../../CustomInput/CustomInput.tsx";
import AddLinkIcon from '@mui/icons-material/AddLink';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import "./CardInfo.css";
// @ts-ignore
// @ts-ignore
import {
    IBoard,
    ICard,
    ILabel,
    ITask,
    StatusColors, TopicDestination, TopicDestinationText,
    TopicDifficulty,
    TopicDifficultyText, TopicStatus
} from "../../../Interfaces/EducationPlanFields.ts";
// @ts-ignore
import Chip from "../../Common/Chip.tsx";
// @ts-ignore
import dayjs from 'dayjs';
// @ts-ignore
import axios from '../../../api/axios';
import {
    Box, colors, FormControl, useTheme, Typography, Menu, MenuItem, Accordion,
    AccordionSummary, IconButton,
    AccordionDetails, Button, TextField, InputAdornment, CircularProgress, Select
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
// @ts-ignore
import {PageTitle} from "../../../scenes/educationDashboard/EducationalPlan.tsx";
import { tokens } from "../../../theme";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import styled from "styled-components";
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import {AddRounded, DeleteOutlined, UploadOutlined} from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
// @ts-ignore
import Portal, {createContainer} from "../../Board/Portal.ts";
import './CardMaterials.css';
import ContentTabs from './ContentTabs'
import SelectComponent from "./SelectComponent.tsx";
import {SelectChangeEvent} from "@mui/material/Select";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";

export const AccordionWrapper = styled.div`
  margin-top: 20px;
  & > div {
    margin: 10px 0;
    border-radius: 10px;
    border: none !important;
  }
`;
export const FilesTableWrapper = styled.div`
  margin-top: 20px;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  border-radius: 8px;
  & > div {
    border-radius: 8px;
    margin: 10px 0;
  }
`;

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.log(event.target.value);
    console.info('You clicked a breadcrumb.');
}

export const BasicBreadcrumbs = ({title}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    return (
        <div role="presentation" onClick={() => handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    onClick={() =>  {
                        localStorage.setItem('currentCard', '');
                        navigate("/edu", { state: { from: location.pathname } })
                    }}
                    underline="hover" color="inherit" href="/edu">
                    Образовательный план
                </Link>
                <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>
        </div>
    );
}
const FilePreviewContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '10px',
    width: "fit-content",
    textAlign: 'center',
    '&:first-child': {
        // ваши стили для первого дочернего элемента
     alignItems: 'flex-end'
    },
    '&:nth-child(2)': {
        alignItems: 'flex-start'
    },
});
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
export const AdditionalFieldWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '8px',
});

const FilePreviewIcon = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5px',
});

const FileInput = styled('input')({
    display: 'none',
});

const FilePreviewList = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
});

// @ts-ignore
const DropZone = styled(Box)(({ isDragActive }) => ({
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: isDragActive ? '#f0f0f0' : '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
}));

const getFileTypeIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
        return <ImageIcon fontSize="large" />;
    }
    if (fileType.startsWith('video/')) {
        return <VideoLibraryIcon fontSize="large" />;
    }
    return <InsertDriveFileIcon fontSize="large" />;
};

export const FileUploadPreview = ({cardMaterials}) => {
    const [files, setFiles] = useState([]);
    const [isMounted, setMounted] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('unset');
    const [statusShown, setStatusShown] = useState(false);
    const MODAL_CONTAINER_ID = 'modal-container-id';
    useEffect(() => {
        createContainer({ id: MODAL_CONTAINER_ID });
        setMounted(true);
    }, [])

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const handleFileRemove = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragActive(false);
        const selectedFiles = Array.from(event.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
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
                                <AlertTitle>Файлы загружены</AlertTitle>
                            </Alert>
                        </Snackbar>
                    </div>
                );
            },
            error: () => {
                return (
                    <Snackbar
                        open={statusShown}
                        autoHideDuration={4000}
                        onClose={() => { setStatusShown(false); }}
                        // message="План загружен"
                        action={action}
                    >
                    <Alert onClose={() => { setStatusShown(false); }} severity="error">
                        <AlertTitle>Ошибка</AlertTitle>
                        Произошла ошибка во время загрузки файлов — <strong> Попробуйте еще раз!</strong>
                    </Alert>
                    </Snackbar>
                );
            },
        };

        return content[loadingStatus]();
    };
    const attachToCard = async (fileIds) => {
        // setStatusShown(true);
        // setLoadingStatus('loading');
        // const validationResult = validateFetchData();
        console.log(cardMaterials, 'Материалы уже существующие для карточки');
        try {
            await Promise.allSettled(files.map(async (file, index) => {
                console.log('file', file);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('name', file.name);
                const fileDestination = localStorage.getItem('fileDestination');
                const currentCard = localStorage.getItem('currentCard');

                try {
                    const response = await axios.patch(`api/education_plan/card_content/${currentCard}/update-section/${fileDestination}/`,
                        {
                           files: [...fileIds],
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")!).accessToken}`,
                            },
                            withCredentials: true
                        });

                    if (response.status === 201) {
                        console.log(`File ${index + 1} (${file.name}) uploaded successfully!`);
                        console.log(response, 'response with files');

                        setLoadingStatus('success');
                    }
                    // } else {
                    //     console.log(response.status, 'errr 1');
                    //     throw new Error(`Failed to upload file ${index + 1}`);
                    // }
                } catch (error) {
                    // console.log(error, 'errr 2');
                    // console.error(`Error during file upload ${index + 1} (${files[index].name}):`, error);
                    // throw new Error(`${files[index].name}`);
                }
            })).then((res) => {
                let isLoadingError = false;
                // res — массив результатов выполнения промисов
                res.forEach(item => {
                    console.log(item, 'Результаты выполнения промисов');
                    if (item.status === 'rejected') {
                        // const rejectedFile = (item.reason).toString().replace('Error:', '')
                        // rejectedFiles.push(rejectedFile.toString());
                        // console.log(rejectedFiles, 'Отклоненные файлы', typeof rejectedFiles);
                        // setRejectedFiles(rejectedFiles);
                        // isLoadingError = true;
                        // // console.log(item.reason.replace('Error:', ''), 'файл был отклонен');
                        // // setLoadingStatus('error');
                        // setUploadedFiles([]);
                    }
                    else if (!isLoadingError)  {
                        // setLoadingStatus('success');
                        setFiles([]);
                    }
                })
            });
        } catch (error) {
            console.error('Error during file uploads:', error);
            setLoadingStatus('error');
        }
    }
    const uploadFile = async (files: File[], field) => {
        // const rejectedFiles: string[] = [];
        setStatusShown(true);
        setLoadingStatus('loading');
        const fileIds = [];
        // const validationResult = validateFetchData();
            try {
                await Promise.allSettled(files.map(async (file, index) => {
                    console.log('file', file);

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('name', file.name);

                    try {
                        const response = await axios.post(`api/education_plan/files`,
                               formData,
                            {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")!).accessToken}`,
                            },
                            withCredentials: true
                        });

                        if (response.status === 201) {
                            console.log(`File ${index + 1} (${file.name}) uploaded successfully!`);
                            console.log(response, 'response with files');
                            fileIds.push(response?.data.id);

                            setLoadingStatus('success');
                        }
                        // } else {
                        //     console.log(response.status, 'errr 1');
                        //     throw new Error(`Failed to upload file ${index + 1}`);
                        // }
                    } catch (error) {
                        // console.log(error, 'errr 2');
                        // console.error(`Error during file upload ${index + 1} (${files[index].name}):`, error);
                        // throw new Error(`${files[index].name}`);
                    }
                })).then((res) => {
                    let isLoadingError = false;
                    // res — массив результатов выполнения промисов
                    res.forEach(item => {
                        console.log(item, 'Результаты выполнения промисов');
                        if (item.status === 'rejected') {
                            // const rejectedFile = (item.reason).toString().replace('Error:', '')
                            // rejectedFiles.push(rejectedFile.toString());
                            // console.log(rejectedFiles, 'Отклоненные файлы', typeof rejectedFiles);
                            // setRejectedFiles(rejectedFiles);
                            // isLoadingError = true;
                            // // console.log(item.reason.replace('Error:', ''), 'файл был отклонен');
                            // // setLoadingStatus('error');
                            // setUploadedFiles([]);
                        }
                        else if (!isLoadingError)  {
                            attachToCard(fileIds);
                            setLoadingStatus('success');
                            // setFiles([]);
                        }
                    })
                });
            } catch (error) {
                console.error('Error during file uploads:', error);
                setLoadingStatus('error');
            }
        };

    return (
        <Box>
            <DropZone
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                isDragActive={isDragActive}
            >
                <label htmlFor="file-upload">
                    <FileInput
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                    <Button variant="contained" component="span" endIcon={<FileUploadOutlinedIcon />}>
                        Добавьте файлы
                    </Button>
                    <Typography variant="body2" color="textSecondary">
                        или перетащите файлы сюда
                    </Typography>
                </label>
                <FilePreviewList>
                    {files.map((file, index) => (
                        <FilePreviewContainer key={index}>
                            <IconButton
                                size="small"
                                onClick={() => handleFileRemove(index)}
                            >
                                <CloseIcon />
                            </IconButton>
                            <div>
                            <FilePreviewIcon>{getFileTypeIcon(file.type)}</FilePreviewIcon>
                            <Typography variant="body2">{file.name}</Typography>
                            </div>
                        </FilePreviewContainer>
                    ))}
                </FilePreviewList>
            </DropZone>
            <Button color='secondary' variant="contained" component="span" onClick={() => {
                uploadFile(files, 'lesson');
            }} endIcon={<CloudUploadOutlinedIcon />}>
                Выгрузить на сервер
            </Button>
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
        </Box>
    );
};

export const AccordionList = ({setDestination, destination, cardMaterials }) => {
    const formatDate = (date) => dayjs(date).format('D MMMM YYYY года, HH:mm');
    const handleDestinationChange = (event: SelectChangeEvent) => {
        setDestination(event.target.value as string);
    }
    const [activeGroup, setActiveGroup] = useState('homework');

    const destinationData = {
        selectLabel: 'Раздел',
        difficultyValue: ['homework', 'lesson', 'repetition'] as TopicDestination[],
        difficultyLabel: ['Домашняя работа', 'Урок', 'Повторение'] as TopicDestinationText[],
    }
    console.log(cardMaterials, 'Материалы в аккордеоне');
    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_self';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // @ts-ignore
    return (
        <AccordionWrapper>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Добавить материалы</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={{marginBottom: '10px'}}>
                        Загрузка материалов для урока
                    </Typography>
                    <div style={{margin: '16px 0'}}>
                    <SelectComponent data={destinationData} handleChange={handleDestinationChange} selectValue={destination}/>
                    </div>
                    <FileUploadPreview cardMaterials={cardMaterials}/>
                    <AdditionalFieldWrapper>
                    <FormControl sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField
                        label="Ссылка"
                        id="filled-start-adornment"
                        sx={{ m: 1, width: '200px' }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><AddLinkIcon/></InputAdornment>,
                        }}
                        variant="outlined"
                    />
                    <Button sx={{width: '120px', height: '40px'}} variant="contained" component="span" endIcon={<AddRounded/>}>
                        Прикрепить
                    </Button>
                    </FormControl>
                    </AdditionalFieldWrapper>
                    <AdditionalFieldWrapper>
                    <FormControl sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField
                        label="Комментарий"
                        id="filled-start-adornment"
                        sx={{ m: 1, width: '200px' }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><ChatBubbleOutlineRoundedIcon/></InputAdornment>,
                        }}
                        variant="outlined"
                    />
                        <Button sx={{width: '120px', height: '40px'}}  variant="contained" component="span" endIcon={<AddRounded/>}>
                           Добавить
                        </Button>
                    </FormControl>
                    </AdditionalFieldWrapper>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>Просмотреть материалы</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ContentTabs onChange={(value) => setActiveGroup(value)} activeTab={activeGroup} />
                    <FilesTableWrapper>
                        <List>
                            {cardMaterials[activeGroup].files.map((file) => (
                                <ListItem secondaryAction={
                                    <div>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDownload(file.file)}>
                                            <UploadOutlined/>
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteOutlined />
                                        </IconButton>
                                    </div>
                                }>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ImageIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={file.name} secondary={formatDate(file.upload_date)} />
                                </ListItem>
                            ))}
                        </List>
                    </FilesTableWrapper>
                </AccordionDetails>
            </Accordion>
        </AccordionWrapper>
    );
}
export interface CardContentProps {
    classworkContent: {};
    homeworkContent: {};
    repetitionContent: {}
}

function CardMaterials() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [cardMaterials, setCardMaterials] = useState(null);
    const [destination, setDestination] = useState('');
    const [currentTopicId, setCurrentTopicId] = useState('');
    const getCardMaterials = async () => {
        try {
            const response = await axios.get(`api/education_plan/card_content/${currentTopicId}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
                },
            });
            console.log(response?.data, 'данные темы');
           setCardMaterials(response?.data);
        } catch (err) {
        }
    };
    useEffect(() => {
        setCurrentTopicId(localStorage.getItem('currentCard'));
    }, []);
    useEffect(() => {
        if (currentTopicId !== '') {
            getCardMaterials();
        }
    }, [currentTopicId])
    useEffect(() => {
        console.log(cardMaterials, 'материалы');
    }, [cardMaterials])
    useEffect(() => {
        if (destination !== '') {
            localStorage.setItem('fileDestination', destination);
        }
    }, [destination])
    return (
        <Box style={{margin: '10px 40px'}}>
            {cardMaterials &&
            <BasicBreadcrumbs title={cardMaterials?.card_title}/>
            }
        <PageTitle style={{ color: colors.blueAccent[100] }}>
            <h1>Материалы темы</h1>
            <FolderCopyOutlinedIcon sx={{fontSize: '22px', marginLeft: '20px'}}/>
        </PageTitle>
            {cardMaterials &&
            <AccordionList setDestination={(value) => setDestination(value)} destination={destination}
                           cardMaterials={cardMaterials}/>
            }
        </Box>
    );
}

export default CardMaterials;
