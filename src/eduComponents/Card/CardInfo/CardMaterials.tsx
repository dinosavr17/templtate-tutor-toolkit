// @ts-ignore
import React, { useEffect, useState } from "react";
import { Calendar, CheckSquare, List, Tag, Type } from "react-feather";
// @ts-ignore
import { colorsList } from "../../../Helper/Util.ts";
// @ts-ignore
import Modal from "../../Modal/Modal.tsx";
// @ts-ignore
import CustomInput from "../../CustomInput/CustomInput.tsx";
import AddLinkIcon from '@mui/icons-material/AddLink';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import "./CardInfo.css";
// @ts-ignore
// @ts-ignore
import {
    IBoard,
    ICard,
    ILabel,
    ITask,
    StatusColors,
    TopicDifficulty,
    TopicDifficultyText, TopicStatus
} from "../../../Interfaces/EducationPlanFields.ts";
// @ts-ignore
import Chip from "../../Common/Chip.tsx";
// @ts-ignore
import dayjs from 'dayjs';
// @ts-ignore
import SelectComponent from "./SelectComponent.tsx";
import axios from '../../../api/axios';
import {
    Box, colors, FormControl, useTheme, Typography, Menu, MenuItem, Accordion,
    AccordionSummary, IconButton,
    AccordionDetails, Button, TextField, InputAdornment
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
import {AddRounded} from "@mui/icons-material";

const AccordionWrapper = styled.div`
  margin-top: 20px;
  & > div {
    margin: 10px 0;
    border-radius: 10px;
    border: none !important;
  }
`;

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.log(event.target.value);
    console.info('You clicked a breadcrumb.');
}

export const BasicBreadcrumbs = () => {
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
                <Typography color="text.primary">Материалы темы: Имя темы</Typography>
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
});
const AdditionalFieldWrapper = styled(Box)({
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

const FileUploadPreview = () => {
    const [files, setFiles] = useState([]);
    const [isDragActive, setIsDragActive] = useState(false);

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
    const uploadFile = async (files: File[]) => {
        // const rejectedFiles: string[] = [];
        // setStatusShown(true);
        // setLoadingStatus('loading');
        //
        // const validationResult = validateFetchData();
            try {
                await Promise.allSettled(files.map(async (file, index) => {
                    console.log('file', file);

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('name', file.name);

                    try {
                        const response = await axios.post(`api/education_plan/card/files/`,
                               formData,
                            {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")!).accessToken}`,
                            },
                            withCredentials: true
                        });

                        // // if (response.ok) {
                        //     console.log(`File ${index + 1} (${file.name}) uploaded successfully!`);
                        //     console.log(response, 'response with files');
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
                // setLoadingStatus('error');
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
                        Загрузить
                    </Button>
                    <Typography variant="body2" color="textSecondary">
                        или перетащите файлы сюда
                    </Typography>
                </label>
            </DropZone>
            <FilePreviewList>
                {files.map((file, index) => (
                    <FilePreviewContainer key={index}>
                        <IconButton
                            size="small"
                            onClick={() => handleFileRemove(index)}
                        >
                            <CloseIcon />
                        </IconButton>
                        <FilePreviewIcon>{getFileTypeIcon(file.type)}</FilePreviewIcon>
                        <Typography variant="body2">{file.name}</Typography>
                    </FilePreviewContainer>
                ))}
            </FilePreviewList>
            <Button variant="contained" component="span" onClick={() => {uploadFile(files)}} endIcon={<FileUploadOutlinedIcon />}>
                Выгрузить на сервер
            </Button>
        </Box>
    );
};

export const AccordionList = ({props: CardContentProps}) => {
    // const uploadFile = async (files: File[]) => {
    //     const rejectedFiles: string[] = [];
    //     setStatusShown(true);
    //     setLoadingStatus('loading');
    //
    //     const validationResult = validateFetchData();
    //
    //     if (validationResult !== 'warning') {
    //         try {
    //             await Promise.allSettled(files.map(async (file, index) => {
    //
    //                 const formData = new FormData();
    //                 formData.append('file', file);
    //
    //                 try {
    //                     const response = await fetch(BackendRoutes.ADD_FILES, {
    //                         method: 'POST',
    //                         body: formData,
    //                         headers: {
    //                         },
    //                     });
    //
    //                     if (response.ok) {
    //                         console.log(`File ${index + 1} (${file.name}) uploaded successfully!`);
    //                         console.log(response, 'response with files');
    //                     } else {
    //                         console.log(response.status, 'errr 1');
    //                         throw new Error(`Failed to upload file ${index + 1}`);
    //                     }
    //                 } catch (error) {
    //                     console.log(error, 'errr 2');
    //                     console.error(`Error during file upload ${index + 1} (${files[index].name}):`, error);
    //                     throw new Error(`${files[index].name}`);
    //                 }
    //             })).then((res) => {
    //                 let isLoadingError = false;
    //                 // res — массив результатов выполнения промисов
    //                 res.forEach(item => {
    //                     console.log(item, 'Результаты выполнения промисов');
    //                     if (item.status === 'rejected') {
    //                         const rejectedFile = (item.reason).toString().replace('Error:', '')
    //                         rejectedFiles.push(rejectedFile.toString());
    //                         console.log(rejectedFiles, 'Отклоненные файлы', typeof rejectedFiles);
    //                         setRejectedFiles(rejectedFiles);
    //                         isLoadingError = true;
    //                         // console.log(item.reason.replace('Error:', ''), 'файл был отклонен');
    //                         setLoadingStatus('error');
    //                         setUploadedFiles([]);
    //                     }
    //                     else if (!isLoadingError)  {
    //                         setLoadingStatus('success');
    //                         setUploadedFiles([]);
    //                     }
    //                 })
    //             });
    //         } catch (error) {
    //             console.error('Error during file uploads:', error);
    //             setLoadingStatus('error');
    //         }
    //     } else {
    //         setLoadingStatus('warning');
    //     }
    // };
    return (
        <AccordionWrapper>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Материалы урока</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={{marginBottom: '10px'}}>
                        Загрузка материалов для урока
                    </Typography>
                    <FileUploadPreview/>
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
                    <Typography>Домашняя работа</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Content for section 2.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>Повторение</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Content for section 3.
                    </Typography>
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
    const [cardData, setCardData] = useState({});
useEffect(() => {
    const cardId = localStorage.getItem('currentCard')
    const getCardData = async () => {
        try {
            const response = await axios.get(`api/education_plan/card/${cardId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")!).accessToken}`,
                },
                withCredentials: true
            });

            console.log(response.data, 'resp');
            setCardData(response.data);
        } catch (err) {
            console.error(err); // Обработка ошибок
        }
    };
getCardData();
}, [])

    // const uploadFile = async (files: File[]) => {
    //     const rejectedFiles: string[] = [];
    //     setStatusShown(true);
    //     setLoadingStatus('loading');
    //
    //     const validationResult = validateFetchData();
    //
    //     if (validationResult !== 'warning') {
    //         try {
    //             await Promise.allSettled(files.map(async (file, index) => {
    //
    //                 const formData = new FormData();
    //                 formData.append('file', file);
    //
    //                 try {
    //                     const response = await fetch(BackendRoutes.ADD_FILES, {
    //                         method: 'POST',
    //                         body: formData,
    //                         headers: {
    //                         },
    //                     });
    //
    //                     if (response.ok) {
    //                         console.log(`File ${index + 1} (${file.name}) uploaded successfully!`);
    //                         console.log(response, 'response with files');
    //                     } else {
    //                         console.log(response.status, 'errr 1');
    //                         throw new Error(`Failed to upload file ${index + 1}`);
    //                     }
    //                 } catch (error) {
    //                     console.log(error, 'errr 2');
    //                     console.error(`Error during file upload ${index + 1} (${files[index].name}):`, error);
    //                     throw new Error(`${files[index].name}`);
    //                 }
    //             })).then((res) => {
    //                 let isLoadingError = false;
    //                 // res — массив результатов выполнения промисов
    //                 res.forEach(item => {
    //                     console.log(item, 'Результаты выполнения промисов');
    //                     if (item.status === 'rejected') {
    //                         const rejectedFile = (item.reason).toString().replace('Error:', '')
    //                         rejectedFiles.push(rejectedFile.toString());
    //                         console.log(rejectedFiles, 'Отклоненные файлы', typeof rejectedFiles);
    //                         setRejectedFiles(rejectedFiles);
    //                         isLoadingError = true;
    //                         // console.log(item.reason.replace('Error:', ''), 'файл был отклонен');
    //                         setLoadingStatus('error');
    //                         setUploadedFiles([]);
    //                     }
    //                     else if (!isLoadingError)  {
    //                         setLoadingStatus('success');
    //                         setUploadedFiles([]);
    //                     }
    //                 })
    //             });
    //         } catch (error) {
    //             console.error('Error during file uploads:', error);
    //             setLoadingStatus('error');
    //         }
    //     } else {
    //         setLoadingStatus('warning');
    //     }
    // };
    return (
        <Box style={{margin: '10px 40px'}}>
            <BasicBreadcrumbs/>
        <PageTitle style={{ color: colors.blueAccent[100] }}>
            <h1>Материалы темы</h1>
            <FolderCopyOutlinedIcon sx={{fontSize: '22px', marginLeft: '20px'}}/>
        </PageTitle>
            <AccordionList classworkContent={''} homeworkContent={''} repetitionContent={''}/>
        </Box>
    );
}

export default CardMaterials;
