// @ts-ignore
import React, { useEffect, useState } from "react";
import { StarBorder } from "@mui/icons-material";
import { Calendar, CheckSquare, List, Tag, Type } from "react-feather";
import styled from "styled-components";
// @ts-ignore
import { ICard, ILabel, SelectChangeEvent } from "../../../Interfaces/EducationPlanFields.ts";
import {Button, Checkbox, FormControl, TextField} from "@mui/material";
// @ts-ignore
import Modal from "../../Modal/Modal.tsx";
// @ts-ignore
import SelectComponent from "./SelectComponent.tsx";
import axios from '../../../api/axios';
import FormControlLabel from "@mui/material/FormControlLabel";

import "./CardInfo.css";
// @ts-ignore
import CustomInput from "../../CustomInput/CustomInput.tsx";

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

function PrimaryModal(props: CardInfoProps) {
  const { onClose, card, primaryId, addCard, boardId} = props;
  const [cardValues, setCardValues] = useState<ICard>({ ...card });

  // useEffect(() => {
  //   if (updateCard) updateCard(boardId, cardValues.id, cardValues);
  // }, [cardValues]);


  const templatesData = {
    selectLabel: 'Мои шаблоны тем',
    difficultyValue: ['topic1', 'topic2', 'topic3', 'topic4'],
    difficultyLabel: ['Тема1', 'Тема2', 'Тема3', 'Тема4'],
  }
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    console.log('заменить');
  };
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
    if(!error.duration && !error.title && duration) {
      addCard(boardId, title, duration);
      onClose();
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
            <FormControlLabel
                label="Использовать шаблон"
                control={
                  <Checkbox
                      checked={checked}
                      onChange={handleConfirm}
                      color="secondary"
                  />
                }
            />
            <SelectComponent data={templatesData} handleChange={handleDifficultyChange} selectValue={''} label='Мои шаблоны'/>
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
