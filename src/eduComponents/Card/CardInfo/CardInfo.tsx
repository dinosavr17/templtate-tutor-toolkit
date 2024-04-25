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
import {IBoard, ICard, ILabel, ITask, StatusColors} from "../../../Interfaces/Kanban.ts";
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

interface CardInfoProps {
  onClose: () => void;
  card: ICard;
  boardId: number;
  updateCard: (boardId: number, cardId: number, card: ICard) => void;
}
const ModuleContent = styled.div`
  padding: 15px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  height: fit-content;
`;
function CardInfo(props: CardInfoProps) {
  const { onClose, card, boardId, updateCard } = props;
  const [selectedColor, setSelectedColor] = useState("");
  const [cardValues, setCardValues] = useState<ICard>({
    ...card,
  });
  const statusColors: StatusColors = {
    'not_started': { dark: '#7F8C8D', light: '#BDC3C7' }, // Серый
    'in_progress': { dark: '#2ECC71', light: '#1bcd2a' }, // Зеленый
    'done': { dark: '#F1C40F', light: '#ecb529' }, // Желтый
    'to_repeat': { dark: '#3498DB', light: '#4496d9' } // Голубой
  };
  //Поля которые нужно добавить в карточку сложность, длительность по оценке репетитора (Дни часы минуты)
  // статус:  не начато, пройдено, повторение

  // data   {title
  //   description
  //   date_start
  //   date_end
  //   plan_time
  //   result_time
  //   status
  // }

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

  const addTask = (value: string) => {
    const task: ITask = {
      id: Date.now() + Math.random() * 2,
      completed: false,
      text: value,
    };
    setCardValues({
      ...cardValues,
      tasks: [...cardValues.tasks, task],
    });
  };

  const removeTask = (id: number) => {
    const tasks = [...cardValues.tasks];

    const tempTasks = tasks.filter((item) => item.id !== id);
    setCardValues({
      ...cardValues,
      tasks: tempTasks,
    });
  };

  // const updateTask = (id: number, value: boolean) => {
  //   const tasks = [...cardValues.tasks];
  //
  //   const index = tasks.findIndex((item) => item.id === id);
  //   if (index < 0) return;
  //
  //   tasks[index].completed = Boolean(value);
  //
  //   setCardValues({
  //     ...cardValues,
  //     tasks,
  //   });
  // };

  const calculatePercent = () => {
    if (!cardValues.tasks?.length) return 0;
    const completed = cardValues.tasks?.filter(
      (item) => item.completed,
    )?.length;
    return (completed / cardValues.tasks?.length) * 100;
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

  const calculatedPercent = calculatePercent();

  return (
    <Modal onClose={onClose}>
      <div className="cardinfo">
        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Type />
            <p>Название темы</p>
          </div>
          <CustomInput
            defaultValue={cardValues.title}
            text={cardValues.title}
            placeholder="Введите название"
            onSubmit={updateTitle}
          />
        </div>
        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <List />
            <p>Описание</p>
          </div>
          <CustomInput
            defaultValue={cardValues.desc}
            text={cardValues.description || "Добавьте описание"}
            placeholder="Добавьте описание"
            onSubmit={updateDesc}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <ContentPasteOutlinedIcon/>
            <p>Статус</p>
          </div>
          <FormControlLabel
            onClick={(event) => {
              event.stopPropagation();
            }}
            control={<IOSSwitch sx={{marginLeft: '10px'}} lightColor={statusColors[cardValues.status].light} darkColour={statusColors[cardValues.status].dark}  />}
            label={''}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <StarBorderIcon />
            <p>Сложность</p>
          </div>
          <SelectComponent/>
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Calendar />
            <p>Дата начала</p>
          </div>
          <input
            type="date"
            defaultValue={cardValues.date}
            min={new Date().toISOString().substr(0, 10)}
            onChange={(event) => updateDate(event.target.value)}
            lang="ru"
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Tag />
            <p>Категории</p>
          </div>
          <div className="cardinfo-box-labels">
            {cardValues.labels?.map((item, index) => (
              <Chip key={index} item={item} removeLabel={removeLabel} />
            ))}
          </div>
          <ul>
            {colorsList.map((item, index) => (
              <li
                key={index}
                style={{ backgroundColor: item }}
                className={selectedColor === item ? "li-active" : ""}
                onClick={() => setSelectedColor(item)}
              />
            ))}
          </ul>
          <CustomInput
            text="Добавить категорию"
            placeholder="Введите название категории"
            onSubmit={(value: string) =>
              addLabel({ color: selectedColor, title: value })
            }
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <CheckSquare />
            <p>Tasks</p>
          </div>
          <div className="cardinfo-box-progress-bar">
            <div
              className="cardinfo-box-progress"
              style={{
                width: `${calculatedPercent}%`,
                backgroundColor: calculatedPercent === 100 ? "limegreen" : "",
              }}
            />
          </div>
          {/*<div className="cardinfo-box-task-list">*/}
          {/*  {cardValues.tasks?.map((item) => (*/}
          {/*    <div key={item.id} className="cardinfo-box-task-checkbox">*/}
          {/*      <input*/}
          {/*        type="checkbox"*/}
          {/*        defaultChecked={item.completed}*/}
          {/*        onChange={(event) =>*/}
          {/*          updateTask(item.id, event.target.checked)*/}
          {/*        }*/}
          {/*      />*/}
          {/*      <p className={item.completed ? "completed" : ""}>{item.text}</p>*/}
          {/*      <Trash onClick={() => removeTask(item.id)} />*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</div>*/}
          <CustomInput
            text={"Add a Task"}
            placeholder="Enter task"
            onSubmit={addTask}
          />
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
