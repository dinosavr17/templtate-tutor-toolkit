// @ts-ignore
import React, { useEffect, useState } from "react";
// @ts-ignore
import Board from "../../eduComponents/Board/Board.tsx";
import "./Dashboard.css";
// @ts-ignore
import CustomInput from "../../eduComponents/CustomInput/CustomInput.tsx";
// @ts-ignore
import {ICard, IBoard, StatusColors} from "../../Interfaces/EducationPlanFields.ts";
// @ts-ignore
import { fetchBoardList, updateLocalStorageBoards } from "../../Helper/APILayers.ts";
import {Box, colors, IconButton, Typography, useTheme} from "@mui/material";
// @ts-ignore
import styled from "styled-components";
import { tokens } from "../../theme";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import axios from '../../api/axios'
// @ts-ignore
import dayjs from 'dayjs';
// @ts-ignore
import Portal, { createContainer } from "../../eduComponents/Board/Portal.ts";
import CloseIcon from '@mui/icons-material/Close';
// @ts-ignore
import {DifficultyMarker} from "../../eduComponents/Card/Card.tsx";
import FormControlLabel from "@mui/material/FormControlLabel";
import {IOSSwitch} from "../../shared/Switch";
import {ProgressLineGraph} from './ProgressLineGraph'

export const PageTitle = styled.div`
  padding: 5px 0px;
  box-shadow: 0 1px 20px rgba(56, 40, 40, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  background: transparent;
  box-shadow: none;
  display: flex;
  align-items: center;
  flex-direction: row;
  font-size: 15px;
  margin-left: 15px;
  line-height: 36px;
  margin-right: 8px;
`;

const ModulesContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 80vw;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px;
  height: 70vh;
`
const AddModuleButton = styled.div`
  flex-basis: 290px;
  min-width: 290px;
`;
const DifficultyBlock = styled.div`
    display: flex;
  flex-direction: row;
  margin-left: 20px;
  & > p {
    margin-right: 8px;
    font-size: 16px;
    font-weight: 500;
  }
  & > div {
    margin: 0 28px;
    min-height: 10px;
    height: 50px;
    width: 10px;
    transform: rotate(90deg);
  }
`
const StatusBlock = styled.div`
    display: flex;
  flex-direction: row;
  margin-left: 20px;
  & > p {
    margin-right: 12px;
    font-size: 16px;
    font-weight: 500;
  }
`;

const AnnotationBlock = styled.div `
  display: flex;
  flex-direction: row;
  & > div {
    margin-right: 20px;
  }
`;

export const EducationalPlan = ({uniquePlan, getPlan}) => {
  const theme = useTheme();
   const colors = tokens(theme.palette.mode);
  const MODAL_CONTAINER_ID = 'modal-container-id';
  const [isMounted, setMounted] = useState(false);
  const [cardModalActive, setCardModalActive] = useState<boolean>(false);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [type, setType] = useState('');
  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [uniquePlan]);

  async function fetchData() {
    const boards: IBoard[] = uniquePlan?.modules;
    // const boards: IBoard[] = await fetchBoardList();
    setBoards(boards);
  }
  const [targetCard, setTargetCard] = useState({
    boardId: '0',
    cardId: '0',
  });

  const handleAddBoard = async (name: string) => {
      try {
        const response = await axios.post('api/education_plan/module/',
          JSON.stringify(
            {
              title: name,
              plan_id: uniquePlan.id
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
            },
            withCredentials: true
          }
        );
        console.log('СОЗДАНИЕ МОДУЛЯ', response.data)
        setBoards((prevBoards) => {
          const tempBoardsList = [...prevBoards];
          tempBoardsList.push({
            id: response.data?.id,
            title: response.data?.title,
            index: response.data?.index,
            cards: [],
          });
          return tempBoardsList;
        });
        getPlan();
      } catch (err) {
      }
  };


  const removeBoard = async (moduleId: string) => {
    try {
      const response = await axios.delete(`api/education_plan/module/${moduleId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
            },
            withCredentials: true
          }
      );
      const boards: IBoard[] = uniquePlan?.modules;
      setBoards(boards);
      getPlan();
    } catch (err) {
    }
    setBoards((prevBoards) => {
      const filteredBoards = prevBoards.filter((item: IBoard) => item.id !== moduleId);
      return filteredBoards;
    });
  };

  const addCardHandler = async (boardId: string, title: string, duration: string) => {
    try {
      const response = await axios.post('api/education_plan/card/',
        JSON.stringify(
          {
            title: title,
            module_id: boardId,
            plan_time: duration,
            index: 0,
            labels: [],
          }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
          },
          withCredentials: true
        }
      );
      // const boards: IBoard[] = uniquePlan?.modules;
      // setBoards(boards);

      console.log(response.data, 'ДАННЫЕ ПОСЛЕ СОЗДАНИЯ КАРТОЧКИ');
      const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
      if (boardIndex < 0) return;
      const tempBoardsList = [...boards];
      tempBoardsList[boardIndex].cards.push({
        difficulty: "",
        id: response.data?.id,
        title,
        labels: [],
        date: "",
        desc: "",
        index: response.data.index,
        status: "not_started",
        plan_time: response.data?.plan_time,
        result: {
          draggableId: response.data.id,
          source: {
            boardId: boardId,
            index: response.data?.index,
          },
          destination: {
            boardId:  null,
            index: null,
          },
        }
      });
      setBoards(tempBoardsList);
      getPlan();
    } catch (err) {
    }

  };

  const removeCard = async (boardId: string, cardId: string) => {
    try {
      const response = await axios.delete(`api/education_plan/card/${cardId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
            },
            withCredentials: true
          }
      );
      console.log(response.data, 'ДАННЫЕ ПОСЛЕ УДАЛЕНИЯ КАРТОЧКИ');
      const boards: IBoard[] = uniquePlan?.modules;
      setBoards(boards);
      getPlan();
    } catch (err) {
    }

    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const cards = tempBoardsList[boardIndex].cards;

    const cardIndex = cards.findIndex((item) => item.id === cardId);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoardsList);
  };

  const updateCard = (boardId: string, cardId: string, card: ICard) => {
    const boardIndex = boards.findIndex((item) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const cards = tempBoardsList[boardIndex].cards;

    const cardIndex = cards.findIndex((item) => item.id === cardId);
    if (cardIndex < 0) return;

    tempBoardsList[boardIndex].cards[cardIndex] = card;

    setBoards(tempBoardsList);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }

    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
      return;
    }
      const tempBoardsList = [...boards];
      const targetBoard = tempBoardsList.find((board) => board.id === source.droppableId);
    if (type === 'task') {
      const targetCard = targetBoard?.cards.find((card) => card.id === draggableId);
      if ((source.index !== destination.index) && (destination.droppableId === source.droppableId)) {
        const switchingCard = targetBoard.cards[destination.index];
        targetBoard.cards[destination.index] = targetCard;
        targetBoard.cards[source.index] = switchingCard;
        setBoards(tempBoardsList);
      } else if (destination.droppableId !== source.droppableId) {
        const switchingBoard = tempBoardsList.find((board) => board.id === destination.droppableId);
        const shiftArrayFromIndex = (arr, startIndex) => {
          if (startIndex < 0 || startIndex > arr.length) {
            return arr;
          }
          arr.splice(destination.index, 0, targetCard);
          targetBoard.cards.splice(source.index, 1);
        };
        shiftArrayFromIndex(switchingBoard.cards, destination.index);
      }
    } else if (type === 'column') {
      if (source.index !== destination.index) {
        const activeBoard = tempBoardsList.find((board) => tempBoardsList.indexOf(board) === source.index);
        const switchingBoard = tempBoardsList[destination.index];
        tempBoardsList[destination.index] = activeBoard;
        tempBoardsList[source.index] = switchingBoard;
       setBoards(tempBoardsList);
      }
    }
    updateLocalStorageBoards(boards);
    const updatePosition = async () => {
      try {
        const response = await axios.post('api/education_plan/move_element',
            JSON.stringify(
                {
                  element_type: type === 'column'? 'board' : 'task' ,
                  element_id: draggableId,
                  destination_index: destination.index,
                  destination_id: destination.droppableId
                }),
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
              },
              withCredentials: true
            }
        );
        console.log(response.data, 'перенос карточки/модуля');
        // if (type === 'column') {
        //   tempBoardsList[destination.index] = activeBoard;
        //   tempBoardsList[source.index] = switchingBoard;
        //   setBoards(tempBoardsList);
        // }
        getPlan();
      } catch (err) {
      }
    };
    updatePosition();
    }



  const onDragEnter = (boardId: string, cardId: string) => {
  };

  useEffect(() => {
    updateLocalStorageBoards(boards);
    console.log('update', uniquePlan);
  }, [boards]);
  const difficultySample = ['easy', 'medium', 'hard'];
  const statusSample = ['not_started', 'in_progress', 'done', 'to_repeat']
  const statusColors: StatusColors = {
    'not_started': { dark: '#7F8C8D', light: '#BDC3C7' }, // Серый
    'in_progress': { dark: '#2ECC71', light: '#1bcd2a' }, // Зеленый
    'done': { dark: '#F1C40F', light: '#ecb529' }, // Желтый
    'to_repeat': { dark: '#3498DB', light: '#4496d9' } // Голубой
  };

  return (
      <Box style={{margin: '10px 40px'}}>
        <PageTitle style={{ color: colors.blueAccent[100] }}>
          <h1>Образовательный план</h1>
        </PageTitle>
        <AnnotationBlock>
          <DifficultyBlock>
            <p>Сложность тем:</p>
            {difficultySample.map((item, index) => (
                <DifficultyMarker key={index} style={{
                  backgroundColor: item === 'easy'? '#86ED26' : item === 'medium'? '#FEDD00' : '#B30018'
                }}>
                  <p>{
                    item === 'easy'
                      ? 'Легкий'
                      : item === 'medium'
                          ? 'Средний'
                          : 'Сложный'
                  }</p>
                </DifficultyMarker>
            ))}
          </DifficultyBlock>
        <StatusBlock>
          <p>Статус тем:</p>
          {statusSample.map((status, index) => (
              <FormControlLabel
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  control={<IOSSwitch
                      sx={{ m: 1, marginLeft: '10px' }}
                      status={status}
                      lightColor={statusColors[status]?.light}
                      darkColour={statusColors[status]?.dark}
                      checked={status !== 'not started'}
                  />}
                  label={
                    status === 'not_started'
                        ? 'Не\u00A0начата'
                        : status === 'in_progress'
                            ? 'В\u00A0процессе'
                            : status === 'done'
                                ? 'Завершена'
                                : 'Повторение'
                  }
              />
          ))}
        </StatusBlock>
        </AnnotationBlock>
        <Box display="grid" gridTemplateColumns="repeat(12, 0.5fr)">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided, snapshot) => (
                  <ModulesContainer
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{backgroundColor: snapshot.isDraggingOver? colors.educationalPlan.boardsWrapper : 'initial'}}>
                    {boards && boards.length > 0 && boards.sort((a, b) => a.index - b.index).map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                              <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                              >
                                <Droppable droppableId={item.id} key={item.id} type="task">
                                  {(provided, snapshot) => (
                                      <Board
                                          getPlan={getPlan}
                                          provided={provided}
                                          snapshot={snapshot}
                                          key={item.id}
                                          board={item}
                                          addCard={addCardHandler}
                                          removeBoard={() => removeBoard(item.id)}
                                          removeCard={removeCard}
                                          onDragEnter={onDragEnter}
                                          updateCard={updateCard}
                                          droppableId={item.id}
                                          index={index}
                                      />
                                  )}
                                </Droppable>
                              </div>
                          )}
                        </Draggable>
                          /*{provided.placeholder}*/
                    ))}
                    {provided.placeholder}
                    <AddModuleButton>
                      <CustomInput
                          displayClass="app-boards-add-board"
                          editClass="app-boards-add-board-edit"
                          placeholder="Введите название модуля"
                          text="+ Добавить модуль"
                          buttonText="+ Добавить модуль"
                          onSubmit={handleAddBoard}
                      />
                    </AddModuleButton>
                  </ModulesContainer>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
        {isMounted &&
            <Portal id={MODAL_CONTAINER_ID}>
              {cardModalActive &&
                  // <StatusOverlay>
                  //     <StatusContainer style={{ display: 'flex' }}>
                  //       {renderStatusContent()}
                  //     </StatusContainer>
                  // </StatusOverlay>
                <div></div>
              }
            </Portal>
        }
      </Box>
  );
};
export default EducationalPlan;
