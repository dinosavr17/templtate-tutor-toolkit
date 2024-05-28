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
  ListItemText, TextField, Typography,
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
import {ExpandLess, ExpandMore, StarBorder} from "@mui/icons-material";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

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
    const savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setCurrentEvents(savedEvents);
    createContainer({ id: MODAL_CONTAINER_ID });
    setMounted(true);
      getUsers();

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
    }
  };

  const handleDateClick = (selected) => {
    setSelectedEvent(selected);
    setOpen(true);
  };

  // const handleEventData = (event) => {
  //   event.preventDefault();
  //
  //   if (title === '') {
  //     alert('Пожалуйста, введите название события');
  //     return;
  //   }
  //
  //   const calendarApi = selectedEvent.view.calendar;
  //   calendarApi.unselect();
  //
  //   const newEvent = {
  //     id: `${selectedEvent.dateStr}-${title}`,
  //     title,
  //     description,
  //     studentData,
  //     start: selectedEvent.startStr,
  //     end: selectedEvent.endStr,
  //     allDay: selectedEvent.allDay,
  //   };
  //
  //   const isDuplicate = currentEvents.some(event => event.id === newEvent.id);
  //   if (isDuplicate) {
  //     alert('Событие с таким названием уже существует на эту дату');
  //     return;
  //   }
  //
  //   calendarApi.addEvent(newEvent);
  //
  //   const updatedEvents = [...currentEvents, newEvent];
  //   setCurrentEvents(updatedEvents);
  //   localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
  //
  //   handleClose();
  // };
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

    // Directly add event to the calendar
    calendarApi.addEvent(newEvent);

    // Update local state and local storage
    setCurrentEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newEvent];
      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
      return updatedEvents;
    });

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
          <i>{eventInfo.event.extendedProps.studentData}</i>
          <i>{eventInfo.event.extendedProps.description}</i>
        </EventContentWrapper>
    );
  }

  return (
      <Box m="20px">
        <Header title="Календарь занятий" subtitle="При отмене и переносе можно прислать уведомление на почту" />

        <Box display="flex" justifyContent="space-between">
          {/* CALENDAR SIDEBAR */}
          <Box
              flex="1 1 20%"
              backgroundColor={colors.primary[400]}
              p="15px"
              borderRadius="4px"
          >
            <Typography variant="h5">События</Typography>
            <List>
              {currentEvents.map((event) => (
                  <ListItem
                      key={event.id}
                      sx={{
                        backgroundColor: colors.greenAccent[500],
                        margin: "10px 0",
                        borderRadius: "2px",
                      }}
                  >
                    <ListItemText
                        primary={event.title}
                        secondary={
                          <Typography>
                            {formatDate(event.start, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }).toLocaleString('ru')}
                          </Typography>
                        }
                    />
                  </ListItem>
              ))}
            </List>
          </Box>

          {/* CALENDAR */}
          <Box flex="1 1 100%" ml="15px">
            <FullCalendar
                height="75vh"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
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
                // eventsSet={(events) => setCurrentEvents(events)}
                locale={ruLocale}
                weekends={false}
                eventContent={renderEventContent}
                events={currentEvents}
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
                          <ListItemIcon>
                            <StarBorder />
                          </ListItemIcon>
                          <ListItemText primary={topic.title} />
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
