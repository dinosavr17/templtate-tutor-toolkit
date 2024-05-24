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
// @ts-ignore
import Chip from "../../Common/Chip.tsx";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import styled from "styled-components";
// @ts-ignore
import dayjs from 'dayjs';
// @ts-ignore
import SelectComponent, {MultipleSelectChip} from "./SelectComponent.tsx";
import axios from '../../../api/axios';
import FormControlLabel from "@mui/material/FormControlLabel";
import {IOSSwitch} from "../../../shared/Switch";
import {SelectChangeEvent} from "@mui/material/Select";
import {Topic} from "@mui/icons-material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Button from '@mui/material/Button';
import {Box, Divider, FormControl, Stack, Typography} from "@mui/material";
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import {StyledButton} from "../../Board/Board.tsx";

interface CardInfoProps {
  onClose: () => void;
  card: ICard;
  boardId: string;
  updateCard: (boardId: string, cardId: string, card: ICard) => void;
}
const LabelsBlock = styled.div`
  display: flex;
  border-radius: 6px;
  border: solid black 1px;
  flex-direction: column;
  justify-content: center;
`;
function CardInfo(props: CardInfoProps) {
  const { onClose, card, boardId, updateCard } = props;
  const [selectedColor, setSelectedColor] = useState("");
  const [cardValues, setCardValues] = useState<ICard>({
    ...card,
  });
  const [teacherLabels, setTeacherLabels] = useState([]);
  const statusColors: StatusColors = {
    'not_started': { dark: '#7F8C8D', light: '#BDC3C7' }, // Серый
    'in_progress': { dark: '#2ECC71', light: '#1bcd2a' }, // Зеленый
    'done': { dark: '#F1C40F', light: '#ecb529' }, // Желтый
    'to_repeat': { dark: '#3498DB', light: '#4496d9' } // Голубой
  };
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  useEffect(() => {
    const getAllLabels = async () => {
      try {
        const response = await axios.get(`api/education_plan/label`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
              },
              withCredentials: true
            }
        );

        console.log(response, 'resp');
        setTeacherLabels(response.data);
      } catch (err) {
      }
    }
    getAllLabels();
  }, []);
  const handleSetStartDate = async() => {
      try {
        const response = await axios.patch(`api/education_plan/card/${cardValues.id}/`,
            JSON.stringify(
                {
                  date_start: dayjs(),
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

      setCardValues({ ...cardValues, date_start: dayjs() });
  }
  const handleSetFinishDate = async() => {
    try {
      const response = await axios.patch(`api/education_plan/card/${cardValues.id}/`,
          JSON.stringify(
              {
                date_end: dayjs(),
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

  useEffect(() => {
    if (cardValues.status === 'in_progress') {
      handleSetStartDate();
    }
    if (cardValues.status === 'done') {
      handleSetFinishDate();
    }
  }, [cardValues.status])

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


  const difficultyData = {
    selectLabel: 'Сложность',
    difficultyValue: ['easy', 'medium', 'hard', 'not_selected'] as TopicDifficulty[],
    difficultyLabel: ['Легкая', 'Средняя', 'Сложная', 'Не выбрана'] as TopicDifficultyText[],
  }
  const [currentDifficulty, setCurrentDifficulty] = React.useState(cardValues.difficulty? cardValues.difficulty : difficultyData.difficultyValue[3]);
  const [existedLables, setExistedLabeles] = useState([]);
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setCurrentDifficulty(event.target.value as string);
    const updateDifficulty = async(value: string) => {
      try {
        const response = await axios.patch(`api/education_plan/card/${cardValues.id}/`,
            JSON.stringify(
                {
                  difficulty: value,
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
      setCardValues({ ...cardValues, difficulty: value });
    };
    updateDifficulty(event.target.value);
  };
  const addExistedLabels = async () => {
    try {
      const response = await axios.patch(`api/education_plan/card/${cardValues.id}/`,
          JSON.stringify(
              {
                labels: existedLables, //Нужно складывать с существующими
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
    setCardValues({ ...cardValues, labels: value });
  }

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
             handleStatusChange();
            }}
            control={<IOSSwitch sx={{marginLeft: '10px'}} lightColor={statusColors[cardValues.status].light} darkColour={statusColors[cardValues.status].dark} status={cardValues.status} />}
            label={''}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <StarBorderIcon />
            <p>Сложность</p>
          </div>
          <SelectComponent data={difficultyData} handleChange={handleDifficultyChange} selectValue={currentDifficulty} label='Сложность'/>
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <AttachFileIcon/>
            <p>Материалы темы</p>
          </div>
          <FormControl sx={{width: '200px'}}>
          <Button
              onClick={() =>  {
                localStorage.setItem('currentCard', card.id);
                navigate("/topic-data", { state: { from: location.pathname } })
              }}
              sx={{padding: '6px 12px', textTransform: 'none', textAlign: 'left'}} variant="outlined" endIcon={<VerticalAlignBottomOutlinedIcon />}>
            Загрузить материалы
          </Button>
          </FormControl>
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
          <LabelsBlock>
            <Box sx={{ p: 2 }}>
              <Typography gutterBottom variant="h5" component="div">
                Выбрать из существующих
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary" variant="body2">
                  <MultipleSelectChip data={teacherLabels} setExistedLabels={(value) => setExistedLabeles(value)}/>
                </Typography>
                <Button sx={{textTransform: 'none', backgroundColor: '#eee', fontSize: '14px'}} type='filled' onClick={() => addExistedLabels()}>Прикрепить к карточке</Button>
              </Stack>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
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
                  text="Добавить новую категорию"
                  placeholder="Введите название категории"
                  onSubmit={(value: string) =>
                      addLabel({ color: selectedColor, title: value })
                  }
              />
            </Box>
          </LabelsBlock>
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
