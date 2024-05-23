import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  IconButton, InputAdornment, TextField,
  Typography,
  useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import StudentCard from "../../components/StudentCard";
import {
  AddRounded,
  DeleteForever,
  DeleteOutlined,
  FolderOutlined,
  UploadOutlined,
  VerifiedUser
} from "@mui/icons-material";
import Caption from "../../components/Caption";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddLinkIcon from "@mui/icons-material/AddLink";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import React, {useEffect, useState} from "react";
import {
  AccordionWrapper,
  AdditionalFieldWrapper,
  FileUploadPreview
} from "../../eduComponents/Card/CardInfo/CardMaterials.tsx";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import styled from "styled-components";
import {PageTitle} from "../educationDashboard/EducationalPlan.tsx";
import axios from "../../api/axios";
import dayjs from "dayjs";
require('dayjs/locale/ru');
dayjs.locale('ru');
export const FilesTableWrapper = styled.div`
  margin-top: 20px;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  border-radius: 8px;
  & > div {
    border-radius: 8px;
    margin: 10px 0;
  }
`;
export function FolderList() {
  const [personalFiles, setPersonalFiles] = useState([])
  const getFilesData = async (e) => {

    try {
      const response = await axios.get('api/education_plan/files',
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
      setPersonalFiles(response?.data);

    } catch (err) {
      if (!err?.response) {
      }
    }
  };
  useEffect(() => {
    getFilesData()
  }, []);
  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_self';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const formatDate = (date) => dayjs(date).format('D MMMM YYYY года, HH:mm');
  return (
      <FilesTableWrapper>
      <List sx={{bgcolor: 'background.paper' }}>
        {personalFiles.map((file) => (
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
  );
}

const StorageMainPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);




    return (
    <Box m="20px">
      <PageTitle style={{ color: colors.blueAccent[100] }}>
        <h1>Мои материалы</h1>
      </PageTitle>
      <AccordionWrapper>
      <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
          <Typography>Загрузить материалы</Typography>
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
      </AccordionWrapper>
      <Box>
      <FolderList/>
      </Box>
    </Box>
  );
};

export default StorageMainPage;
