import React, { useState, useEffect } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  List,
  ListItem, ListItemButton, ListItemIcon,
  ListItemText, Switch, TextField, Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import '@fullcalendar/core/locales-all';
import { tokens } from "../../theme";
import ruLocale from '@fullcalendar/core/locales/ru';
import Portal, { createContainer } from "../../eduComponents/Board/Portal.ts";
import axios from "../../api/axios";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import styled from "styled-components";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import Radio from '@mui/material/Radio';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import dayjs from "dayjs";

export const EventContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isMounted, setMounted] = useState(false);
  const MODAL_CONTAINER_ID = 'modal-container-id';
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState('');
  const [availableTopics, setAvailableTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTopicName, setSelectedTopicName] = useState('');

  const handleAddLesson = async () => {
    try {
      const response = await axios.post('api/schedule/',
          JSON.stringify(
              {
                plan_id: studentId,
                date_start: dayjs(),
                date_end: dayjs(),
                card: selectedTopic
              }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
            },
            withCredentials: true
          }
      );

      console.log(response.data, 'ДАННЫЕ ПОСЛЕ СОЗДАНИЯ КАРТОЧКИ');
    } catch (err) {
      console.error('Ошибка при создании занятия', err);
    }
  }

  const getLessons = async () => {
    try {
      const response = await axios.get('api/schedule/', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
        },
        withCredentials: true
      });

      console.log('Все события', response?.data);

      const filteredTopics = response?.data.reduce((acc, topic) => {
        acc.push({
          allDay: false,
          end: topic.date_end,
          start: topic.date_start,
          description: topic.discipline,
          studentData: topic.first_name + ' ' + topic.last_name,
          title: topic.title,
          selectedTopic: topic.card,
          selectedTopicName: availableTopics.find(availableTopic => availableTopic.id === topic.card)
              ?  availableTopics.find(availableTopic => availableTopic.id === topic.card).title
              : '',
          id: topic.id
        })
        return acc;
      }, [])
      setCurrentEvents(filteredTopics);

    } catch (err) {
      console.error('Error fetching lessons', err);
    }
  };

  const handleChange = (event) => {
    setSelectedTopic(event.target.value);
    const topic = availableTopics.find(topic => topic.id === event.target.value);
    if (topic) {
      setSelectedTopicName(topic.title);
    } else {
      setSelectedTopicName('нет');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
  };
  const [openList, setOpenList] = React.useState(true);

  const handleClick = () => {
    setOpenList(!openList);
  };

  useEffect(() => {
    createContainer({ id: MODAL_CONTAINER_ID });
    setMounted(true);
    getUsers();
    getLessons();

  }, []);

  useEffect(() => {
    const studentObject = studentsList.find((item) => item.id === studentId);
    setStudentData(studentObject?.first_name + " " + studentObject?.last_name);
  }, [studentId])

  useEffect(() => {
    getPlanById(studentId);
    console.log(availableTopics, 'доступные темы студента');
  }, [studentId])

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
      console.error('Error fetching users', err);
    }
  };

  const getPlanById = async (id) => {
    try {
      const response = await axios.get(`api/education_plan/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
        },
      });
      console.log(response?.data, 'план по id');
      const modules = response.data.modules;
      const cardsData = modules.reduce((acc, module) => {
        return acc.concat(module.cards);
      }, []);
      console.log(cardsData, 'дата по карточкам');
      setAvailableTopics(cardsData);
    } catch (err) {
      console.error('Error fetching plan by id', err);
    }
  };

  const handleDateClick = (selected) => {
    setSelectedEvent(selected);
    setOpen(true);
  };

  const handleEventData = (event) => {
    event.preventDefault();

    if (title === '') {
      alert('Пожалуйста, введите название события');
      return;
    }

    const calendarApi = selectedEvent.view.calendar;
    calendarApi.unselect();

    const newEvent = {
      id: `${selectedEvent.dateStr}-${title}`,
      title,
      description,
      selectedTopic,
      selectedTopicName,
      studentData,
      start: selectedEvent.startStr,
      end: selectedEvent.endStr,
      allDay: selectedEvent.allDay,
    };

    const isDuplicate = currentEvents.some(event => event.id === newEvent.id);
    if (isDuplicate) {
      alert('Событие с таким названием уже существует на эту дату');
      return;
    }

    setCurrentEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newEvent];
      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
    handleAddLesson();

    handleClose();
  };

  const handleEventClick = (selected) => {
    if (window.confirm(`Вы действительно хотите отменить занятие '${selected.event.title}'`)) {
      selected.event.remove();
      const updatedEvents = currentEvents.filter(event => event.id !== selected.event.id);
      setCurrentEvents(updatedEvents);
      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
    }
  };

  function renderEventContent(eventInfo) {
    return (
        <EventContentWrapper>
          <b>{eventInfo.event.title}</b>
          <i>Студент: {eventInfo.event.extendedProps.studentData}</i>
          <i>Тема: {eventInfo.event.extendedProps.selectedTopicName}</i>
        </EventContentWrapper>
    );
  }

  return (
      <Box m="20px">
        <Header title="Расписание" subtitle="Расписание занятий" />

        <Box display="flex" justifyContent="space-between">
          <Box flex="1 1 20%" bgcolor={colors.primary[400]} p="15px" borderRadius="4px">
            <Typography variant="h5">Список занятий</Typography>
            <List>
              <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                  <SchoolOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Ученики" />
                {openList ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openList} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {studentsList.map((student, index) => (
                      <ListItem key={`${student.id}-${index}`}>
                        <Radio
                            checked={studentId === student.id}
                            onChange={(e) => setStudentId(student.id)}
                            value={student.id}
                            name="radio-buttons"
                            inputProps={{ 'aria-label': student.id }}
                        />
                        <ListItemText primary={`${student.first_name} ${student.last_name}`} />
                      </ListItem>
                  ))}
                </List>
              </Collapse>
            </List>
          </Box>
          <Box width='100%' ml="15px">
            <FullCalendar
                locale={ruLocale}
                height="75vh"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                select={handleDateClick}
                eventClick={handleEventClick}
                events={currentEvents} // updated to use currentEvents state
                eventContent={renderEventContent}
            />
          </Box>
        </Box>
        {isMounted && open &&
        <Portal id={MODAL_CONTAINER_ID}>
          <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                  component: 'form',
                  onSubmit: handleEventData,
                }}
            >
              <DialogTitle>Создать занятие</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Для создания нового события, выбреите студента и название события.
                </DialogContentText>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', marginTop: '14px' }}>
                  <TextField
                      onChange={(event) => { setTitle(event.target.value) }}
                      type='text'
                      id="outlined-basic"
                      label="Название"
                      variant="outlined"
                  />
                </FormControl>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', marginTop: '14px' }}>
                  <TextField
                      onChange={(event) => { setDescription(event.target.value) }}
                      type='text'
                      id="outlined-basic"
                      label="Описание"
                      variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: '14px' }}>
                  <InputLabel id="demo-simple-select-label">Выбрать студента</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={studentId}
                      label="Студент"
                      onChange={(event) => { setStudentId(event.target.value) }}
                  >
                    {studentsList.map((student, index) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.first_name} {student.last_name}
                        </MenuItem>
                    ))}
                  </Select>
                  {availableTopics && availableTopics.length > 0 &&
                  <List>
                    <ListItemButton onClick={handleClick}>
                      <ListItemIcon>
                        <SchoolOutlinedIcon/>
                      </ListItemIcon>
                      <ListItemText primary="Темы студента" />
                      {openList ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openList} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {availableTopics.map((topic) => (
                            <ListItemButton sx={{ pl: 4 }}>
                              <ListItemText primary={topic.title} />
                              <Radio
                                  edge="end"
                                  checked={selectedTopic === topic.id}
                                  onChange={handleChange}
                                  value={topic.id}
                                  name="radio-buttons"
                                  inputProps={{ 'aria-label': 'A' }}
                              />
                            </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </List>

                  }
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button type="submit">Создать событие</Button>
              </DialogActions>
            </Dialog>
          </>
        </Portal>
        }
      </Box>
  );
};

export default Calendar;
