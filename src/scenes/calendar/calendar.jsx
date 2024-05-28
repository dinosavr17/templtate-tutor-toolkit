import React, { useState, useEffect } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  List,
  ListItem,
  ListItemText, TextField, Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import '@fullcalendar/core/locales-all'
import { tokens } from "../../theme";
import ruLocale from '@fullcalendar/core/locales/ru';
import Portal, { createContainer } from "../../eduComponents/Board/Portal.ts";
import axios from "../../api/axios";
import CustomInput from '../../eduComponents/CustomInput/CustomInput.tsx';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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
  const [student, setStudent] = useState({});

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
  };

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setCurrentEvents(savedEvents);
    createContainer({ id: MODAL_CONTAINER_ID });
    setMounted(true);
    getUsers();
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
      console.error('Error fetching users', err);
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
      student,
      start: selectedEvent.startStr,
      end: selectedEvent.endStr,
      allDay: selectedEvent.allDay,
    };

    calendarApi.addEvent(newEvent);

    const updatedEvents = [...currentEvents, newEvent];
    setCurrentEvents(updatedEvents);
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));

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
  //Разобраться как отображать не только название на событии - добавить выгрузку тем студентов - норм выбор студента, времени

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
                eventsSet={(events) => setCurrentEvents(events)}
                locale={ruLocale}
                weekends={false}
                initialEvents={[]}
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
                <FormControl sx={{display: 'flex', flexDirection: 'column', marginTop: '12px'}}>
                <TextField
                  onChange={(event) => {setTitle(event.target.value)}}
                  type='text'
                  id="outlined-basic"
                  label="Название"
                  variant="outlined"
                  />
              </FormControl>
                <FormControl sx={{display: 'flex', flexDirection: 'column', marginTop: '12px'}}>
                  <TextField
                      onChange={(event) => {setDescription(event.target.value)}}
                      type='text'
                      id="outlined-basic"
                      label="Описание"
                      variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth sx={{marginTop: '12px'}}>
                  <InputLabel id="demo-simple-select-label">Выбрать студента</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={student}
                      label="Студент"
                      onChange={(event) => {setStudent(event.target.value)}}
                  >
                    {studentsList.map((student, index) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.first_name} {student.last_name}
                        </MenuItem>
                    ))}
                  </Select>
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
