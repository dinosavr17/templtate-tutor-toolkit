// @ts-ignore
import React, { useEffect, useState } from "react";
import { StarBorder } from "@mui/icons-material";
import {Calendar, CheckSquare, Clock, List, Tag, Type} from "react-feather";
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
// @ts-ignore
import dayjs from "dayjs";

interface CardInfoProps {
    onClose: () => void;
    card?: ICard;
    updateCard?: (boardId: number, cardId: number, card: ICard) => void;
    primaryId: string;
    boardId: string;
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

function SecondaryModal(props: CardInfoProps) {
    const { onClose, card, primaryId, boardId, updateCard, complete} = props;
    const [cardValues, setCardValues] = useState<ICard>({ ...card });
    useEffect(() => {
      if (updateCard) updateCard(boardId, cardValues.id, cardValues);
      if (cardValues.status === 'done') {
          complete();
      }
    }, [cardValues]);

    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
   const [repetitionDate, setRepetitionDate] = useState(dayjs());
    const [error, setError] = useState({
        title: false,
        duration: false,
    })
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
        setMinutes(value);
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
    const handleCompleteTopic = async(duration, repetitionDate) => {
        try {
            const response = await axios.patch(`api/education_plan/card/${cardValues.id}/`,
                JSON.stringify(
                    {
                        result_time: duration,
                        date_end: dayjs(),
                        repetition_date: repetitionDate
                    }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
                    },
                    withCredentials: true
                }
            );

            console.log(response, 'resp');
        } catch (err) {
        }

        setCardValues({ ...cardValues, date_end: dayjs() });
    }
    const handleSubmit = () => {
        const duration = convertToISO8601(hours, minutes);
        if(!error.duration) {
            handleCompleteTopic(duration, repetitionDate);
            onClose();
        }
    }
    useEffect(() => {
         if (hours !== 0 || minutes !== 0) {
            setError(prevState => ({
                ...prevState,
                duration: false
            }));
        } if (hours === 0 && minutes === 0) {
           if (hours === 0 && minutes === 0) {
                setError(prevState => ({
                    ...prevState,
                    duration: true
                }));
            }
        }
    },[hours, minutes])

    return (
        <Modal onClose={onClose}>
            <div className="cardinfo">
                <div className="cardinfo-box">
                    <div className="cardinfo-box-title">
                        <Clock/>
                        <p>Фактическое время на прохождение</p>
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
                                inputProps={{min: 1}}
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
                                inputProps={{min: 1}}
                            />
                        </FormControl>
                    </DurationWrapper>
                    <p style={{
                        color: 'darkred',
                        fontSize: '12px',
                        marginTop: '8px'
                    }}>{error.duration ? 'Длительность не может быть пустой' : ''}</p>
                </div>
                <div className="cardinfo-box">
                    <div className="cardinfo-box-title">
                        <Calendar/>
                        <p>Запланировать дату повторения</p>
                    </div>
                    <input
                        type="date"
                        defaultValue={cardValues.date}
                        min={new Date().toISOString().substr(0, 10)}
                        onChange={(event) => setRepetitionDate(dayjs(event.target.value)) }
                        lang="ru"
                    />
                </div>
                    <Button onClick={() => {
                        handleSubmit()
                    }} variant='contained' color='secondary' sx={{textTransform: 'none'}}>Завершить прохождение</Button>
                </div>
        </Modal>
);
}

export default SecondaryModal;
