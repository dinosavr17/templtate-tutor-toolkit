// @ts-ignore
import React, { useEffect, useState } from "react";
import { Calendar, CheckSquare, List, Tag, Type } from "react-feather";
// @ts-ignore
import { colorsList } from "../../../Helper/Util.ts";
// @ts-ignore
import Modal from "../../Modal/Modal.tsx";
// @ts-ignore
import CustomInput from "../../CustomInput/CustomInput.tsx";

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
import {CheckBox} from "@mui/icons-material";
// @ts-ignore
import Chip from "../../Common/Chip.tsx";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import styled from "styled-components";
// @ts-ignore
import SelectComponent from "./SelectComponent.tsx";
import axios from '../../../api/axios';
import FormControlLabel from "@mui/material/FormControlLabel";
import {IOSSwitch} from "../../../shared/Switch";
import {SelectChangeEvent} from "@mui/material/Select";
import {Topic} from "@mui/icons-material";
import {Button, Checkbox} from "@mui/material";
interface CardInfoProps {
  onClose: () => void;
  card?: ICard;
  boardId: string;
  updateCard?: (boardId: number, cardId: number, card: ICard) => void;
}
const ModuleContent = styled.div`
  padding: 15px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  height: fit-content;
`;
function PrimaryModal(props: CardInfoProps) {
  const { onClose, card, boardId, updateCard } = props;
  const [selectedColor, setSelectedColor] = useState("");
  const [cardValues, setCardValues] = useState<ICard>({
    ...card,
  });

  const updateTitle = async(value: string) => {
    try {
      const response = await axios.patch(`api/education_plan/card/${cardValues.id}/`,
        JSON.stringify(
          {
            title: value,
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

    setCardValues({ ...cardValues, title: value });
  };

  const updateDesc = async(value: string) => {
    try {
      const response = await axios.patch(`api/education_plan/card/${cardValues.id}/`,
        JSON.stringify(
          {
            description: value,
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
    setCardValues({ ...cardValues, description: value });
  };
  const handleStatusChange = async () => {
    let newStatus: TopicStatus;

    // Определяем следующий статус в зависимости от текущего
    switch (cardValues.status) {
      case 'not_started':
        newStatus = 'in_progress';
        break;
      case 'in_progress':
        newStatus = 'done';
        break;
      case 'done':
        newStatus = 'to_repeat';
        break;
      case 'to_repeat':
        newStatus = 'not_started';
        break;
      default:
        newStatus = 'not_started'; // Если текущий статус неизвестен, возвращаем статус "не начато"
    }

    try {
      const response = await axios.patch(
          `api/education_plan/card/${cardValues.id}/`,
          JSON.stringify({
            status: newStatus,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
            },
            withCredentials: true,
          }
      );

      console.log(response, 'resp');

      setCardValues({
        ...cardValues,
        status: newStatus,
      });
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
    }
  };


  const addLabel = async(label: ILabel) => {
    const index = cardValues.labels.findIndex(
      (item) => item.title === label.title,
    );
    if (index > -1) return;
    try {
      const response = await axios.post('api/education_plan/label/',
        JSON.stringify(
          {
            title: label.title,
            card_id: card.id,
            color: label.color
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


    setSelectedColor("");
    setCardValues({
      ...cardValues,
      labels: [...cardValues.labels, label],
    });
  };

  const removeLabel = (label: ILabel) => {
    const tempLabels = cardValues.labels.filter(
      (item) => item.text !== label.text,
    );

    setCardValues({
      ...cardValues,
      labels: tempLabels,
    });
  };

  const updateDate = (date: string) => {
    if (!date) return;

    setCardValues({
      ...cardValues,
      date,
    });
  };

  useEffect(() => {
    if (updateCard) updateCard(boardId, cardValues.id, cardValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardValues]);
  

  const templatesData = {
    selectLabel: 'Мои шаблоны тем',
    difficultyValue: ['topic1', 'topic2', 'topic3', 'topic4'] as TopicDifficulty[],
    difficultyLabel: ['Тема1', 'Тема2', 'Тема3', 'Тема4'] as TopicDifficultyText[],
  }
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    console.log('заменить');
  };
  const [checked, setChecked] = React.useState(false);

  const handleConfirm = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Modal onClose={onClose}>
      <div className="cardinfo">


        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <StarBorderIcon />
            <p>Использовать шаблон</p>
          </div>
          <FormControlLabel
              label="Использовать шаблон"
              control={
                <Checkbox
                    checked={checked}
                    onChange={handleConfirm}
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
          <input
            type="date"
            defaultValue={cardValues.date}
            min={new Date().toISOString().substr(0, 10)}
            onChange={(event) => updateDate(event.target.value)}
            lang="ru"
          />
        </div>
        <Button>Создать тему</Button>
      </div>
    </Modal>
  );
}

export default PrimaryModal;
