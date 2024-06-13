// @ts-ignore
import React, { useEffect, useState } from "react";
import { StarBorder } from "@mui/icons-material";
import {Calendar, CheckSquare, Clock, List, MoreHorizontal, Tag, Type} from "react-feather";
import styled from "styled-components";
// @ts-ignore
import {ICard, ILabel, SelectChangeEvent, StatusColors} from "../../../Interfaces/EducationPlanFields.ts";
import {Alert, AlertTitle, Button, Checkbox, FormControl, Popover, TextField, useTheme} from "@mui/material";
// @ts-ignore
import Modal from "../../Modal/Modal.tsx";
// @ts-ignore
import SelectComponent from "./SelectComponent.tsx";
import axios from '../../../api/axios';
import FormControlLabel from "@mui/material/FormControlLabel";

import "./CardInfo.css";
// @ts-ignore
import CustomInput from "../../CustomInput/CustomInput.tsx";
import Chip from "../../Common/Chip.tsx";
import { IOSSwitch } from "../../../shared/Switch";
import {CardBody, DifficultyMarker} from "../Card.tsx";
import { tokens } from "../../../theme";

interface CardInfoProps {
  onClose: () => void;
  card?: ICard;
  updateCard?: (boardId: number, cardId: number, card: ICard) => void;
  primaryId: string;
  addCard: (boardId: string, title: string, duration: string) => void;
}

const ModuleContent = styled.div`
  padding: 15px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  height: fit-content;
`;
const DurationWrapper = styled.div`
 display: flex;
  flex-direction: row;
  width: 200px;
  :first-child {
    margin-right: 15px;
  }
`;

const CustomFormControlLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

function PrimaryModal(props: CardInfoProps) {
  const { onClose, card, primaryId, addCard, boardId, getPlan} = props;
  const [cardValues, setCardValues] = useState<ICard>({ ...card });
  const [templateData, setTemplateData] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [displayPrimaryCard, setDisplayPrimaryCard] = useState(true);
  const [primaryCard, setPrimaryCard] = useState({});
  console.log(boardId, 'айди доски');

  // useEffect(() => {
  //   if (updateCard) updateCard(boardId, cardValues.id, cardValues);
  // }, [cardValues]);


  const templatesData = {
    selectLabel: 'Мои шаблоны тем',
    difficultyValue: ['topic1', 'topic2', 'topic3', 'topic4'],
    difficultyLabel: ['Тема1', 'Тема2', 'Тема3', 'Тема4'],
  }
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    console.log(event.target.value, 'значение селекта');
    setSelectedTemplate(event.target.value);
  };
  useEffect(() => {
    setDisplayPrimaryCard(true);
    const dataForPrimaryCard = templateData.find((template) => template.id === selectedTemplate)
    console.log(dataForPrimaryCard, 'Данные превью карточки');
    setPrimaryCard(dataForPrimaryCard);
  }, [selectedTemplate])
  const [checked, setChecked] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  // const [duration, setDuration] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState({
    title: false,
    duration: false,
  })

  const handleConfirm = (event) => {
    setChecked(event.target.checked);
  };
  const handleHoursChange = (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value <= 0) {
      setError(prevState => ({
        ...prevState,
        duration: true
      }));
    }
      setHours(value); // Преобразуем в число перед установкой
  };

  const handleMinutesChange = (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value <= 0) {
      setError(prevState => ({
        ...prevState,
        duration: true
      }));
    }
      setMinutes(value); // Преобразуем в число перед установкой
  };

  const convertToISO8601 = (inputHours: number, inputMinutes: number) => {
    // Переводим значения часов и минут в минуты
    const totalMinutes = inputHours * 60 + inputMinutes;

    // Вычисляем количество дней, часов и минут
    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutes = totalMinutes % (24 * 60);
    const hours = Math.floor(remainingMinutes / 60);
    const remainingMinutes2 = remainingMinutes % 60;

    // Формируем строку в формате ISO 8601
    const isoString = `P${days}DT${hours}H${remainingMinutes2}M`;

    // Устанавливаем значение строки в состояние компонента
    // setDuration(isoString);
    return isoString;
  };
  const handleSubmit = () => {
    const duration = convertToISO8601(hours, minutes);
    if (!checked) {
      if (!error.duration && !error.title && duration) {
        addCard(boardId, title, duration);
        onClose();
      }
    } else {
      addCardWithTemplate(selectedTemplate,duration)
    }
  }
  useEffect(() => {
    if(title !== '') {
      setError(prevState => ({
        ...prevState,
        title: false
      }));
    } if (hours !== 0 || minutes !== 0) {
      setError(prevState => ({
        ...prevState,
        duration: false
      }));
    } if ((title === '') || (hours === 0 && minutes === 0)) {
      if (title === '') {
        setError(prevState => ({
          ...prevState,
          title: true
        }));
      } if (hours === 0 && minutes === 0) {
        setError(prevState => ({
          ...prevState,
          duration: true
        }));
      }
    }
  },[hours, minutes, title])
  const getTemplatesData = async () => {
    try {
      const response = await axios.get('api/education_plan/card/templates', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
        },
        withCredentials: true
      });
      console.log(response.data, 'шаблоны препода');
      setTemplateData(response.data);
    } catch (err) {
      if (!err?.response) {
      }
    }
  };
  const addCardWithTemplate = async (cardId, duration) => {
    try {
      const response = await axios.post(`api/education_plan/card/${cardId}/create_card_from_template/`,
          JSON.stringify(
              {
                module_id: boardId,
                plan_time: duration
              }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
            },
            withCredentials: true
          }
      );
      console.log(response.data,'Создание карточки по шаблону');
      getPlan();
    } catch (err) {
    }
  }
  useEffect(() => {
    getTemplatesData();
  }, [checked])
  useEffect(() => {
    // const templatesData = {
    //   selectLabel: 'Мои шаблоны тем',
    //   difficultyValue: ['topic1', 'topic2', 'topic3', 'topic4'],
    //   difficultyLabel: ['Тема1', 'Тема2', 'Тема3', 'Тема4'],
    // }
    const difficultyValue = [];
    const difficultyLabel = [];
    const dataForSelect = templateData.reduce((acc, template) => {
      difficultyValue.push(template.id);
      difficultyLabel.push(template.title);
      acc = {selectLabel: 'Мои шаблоны тем', difficultyValue: difficultyValue, difficultyLabel: difficultyLabel}
      return acc
    },{});
    setSelectData(dataForSelect);
  }, [templateData])
  const statusColors: StatusColors = {
    not_started: { dark: "#7F8C8D", light: "#BDC3C7" }, // Серый
    in_progress: { dark: "#2ECC71", light: "#1bcd2a" }, // Зеленый
    done: { dark: "#F1C40F", light: "#ecb529" }, // Желтый
    to_repeat: { dark: "#3498DB", light: "#4496d9" }, // Голубой
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
      <Modal onClose={onClose}>
        <div className="cardinfo">
          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <Type />
              <p>Название темы</p>
            </div>
            <FormControl error={error.title}>
            <TextField
                onChange={(event) => {setTitle(event.target.value)}}
                type='text'
                id="outlined-basic"
                label="Название"
                variant="outlined"

                // helperText={error.title? 'Название не может быть пустым' : ''}
            />
            </FormControl>
            <p style={{color: 'darkred', fontSize: '12px', marginTop: '8px'}}>{error.title? 'Название не может быть пустым' : ''}</p>
            {/*<CustomInput*/}
            {/*    text="+ Добавить Тему"*/}
            {/*    placeholder="Введите название темы"*/}
            {/*    displayClass="board-add-card"*/}
            {/*    editClass="board-add-card-edit"*/}
            {/*    onSubmit={(value: string) => setTitle(value)}*/}
            {/*/>*/}
          </div>


          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <StarBorder />
              <p>Использовать шаблон</p>
            </div>
            <CustomFormControlLabel>
                  <Checkbox
                      checked={checked}
                      onChange={handleConfirm}
                      color="secondary"
                  />
              <span>Использовать шаблон</span>
            </CustomFormControlLabel>
            {selectData && checked &&
            <SelectComponent data={selectData} handleChange={handleDifficultyChange} selectValue={selectedTemplate} label='Мои шаблоны'/>
            }
            {displayPrimaryCard && primaryCard && checked && (
                <div>
                  <div style={{marginBottom: '8px'}}>
                  <Alert severity="info">
                    <AlertTitle>Так будет выглядеть тема, созданная по шаблону:</AlertTitle>
                    Все файлы из темы шаблона - будут продублированы в новой теме
                  </Alert>
                  </div>
                <div
                    className="card"
                    style={{
                      userSelect: "none",
                      width: '240px',
                      padding: 16,
                      margin: "0 0 8px 0",
                      minHeight: "50px",
                      backgroundColor: `${colors.educationalPlan.card}`,
                      color: "white",
                    }}
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <main>
                      <div className="card-top">
                        <div className="card-top-labels">
                          {primaryCard.labels?.map((item, index) => (
                              <Chip key={index} item={item} />
                          ))}
                        </div>
                      </div>
                      <div className="card-title" style={{ color: "black" }}>
                        {primaryCard?.title}
                      </div>
                      <CardBody>
                        <p style={{ color: "black" }} title={'Описание'}>
                          {primaryCard?.description? primaryCard?.description : 'Описание' }
                        </p>
                      </CardBody>
                    </main>
                  </div>
                </div>
                </div>
            )}
          </div>

          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <Calendar />
              <p>Время на прохождение</p>
            </div>
            <DurationWrapper>
              <FormControl error={error.duration}>
            <TextField
                value={hours}
                onChange={handleHoursChange}
                type='number'
                id="outlined-basic"
                label="часы"
                variant="outlined"
                inputProps={{ min: 1 }}
                // helperText={error.duration? 'Длительность не может быть пустой' : ''}
            />
              </FormControl>
              <FormControl error={error.duration}>
            <TextField
                value={minutes}
                onChange={handleMinutesChange}
                type='number'
                id="outlined-basic"
                label="минуты"
                variant="outlined"
                inputProps={{ min: 1 }}
                // helperText={error.duration? 'Длительность не может быть пустой' : ''}
            />
              </FormControl>
            </DurationWrapper>
              <p style={{color: 'darkred', fontSize: '12px', marginTop: '8px'}}>{error.duration? 'Длительность не может быть пустой' : ''}</p>
          </div>
          <Button onClick={() => {handleSubmit()}} variant='contained' color='secondary' sx={{textTransform: 'none'}}>Создать тему</Button>
        </div>
      </Modal>
  );
}

export default PrimaryModal;
