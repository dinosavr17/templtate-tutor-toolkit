// @ts-ignore
import React, { useEffect, useState } from "react";
// @ts-ignore
import Board from "../../eduComponents/Board/Board.tsx";
import "./Dashboard.css";
// @ts-ignore
import CustomInput from "../../eduComponents/CustomInput/CustomInput.tsx";
// @ts-ignore
import { ICard, IBoard } from "../../Interfaces/Kanban.ts";
// @ts-ignore
import { fetchBoardList, updateLocalStorageBoards } from "../../Helper/APILayers.ts";
import {Box, colors, IconButton, Typography, useTheme} from "@mui/material";
// @ts-ignore
import styled from "styled-components";
import { tokens } from "../../theme";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const PageTitle = styled.div`
  padding: 5px 0px;
  box-shadow: 0 1px 20px rgba(56, 40, 40, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  background: transparent;
  box-shadow: none;
  display: inline-block;
  font-size: 15px;
  margin-left: 15px;
  line-height: 36px;
  margin-right: 8px;
`;

const ModulesContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  width: 80vw;
  flex-wrap: wrap;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 80vw;
  gap: 10px;
  padding: 0 40px;
  padding: 40px 40px;
  height: 70vh;
`
const AddModuleButton = styled.div`
  flex-basis: 290px;
  min-width: 290px;
`;

export const EducationalPlan = ({uniquePlan}) => {
  const theme = useTheme();
   const colors = tokens(theme.palette.mode);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [type, setType] = useState('');
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const boards: IBoard[] = uniquePlan?.modules;
    // const boards: IBoard[] = await fetchBoardList();
    setBoards(boards);
  }
  const [targetCard, setTargetCard] = useState({
    boardId: '0',
    cardId: '0',
  });

  const handleAddBoard = (name: string) => {
    setBoards((prevBoards) => {
      const tempBoardsList = [...prevBoards];
      tempBoardsList.push({
        id: (Date.now() + Math.random() * 2).toString(),
        title: name,
        cards: [],
      });
      return tempBoardsList;
    });
  };


  const removeBoard = (moduleId: string) => {
    setBoards((prevBoards) => {
      const filteredBoards = prevBoards.filter((item: IBoard) => item.id !== moduleId);
      return filteredBoards;
    });
  };

  const addCardHandler = (boardId: string, title: string) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    tempBoardsList[boardIndex].cards.push({
      difficulty: "",
      id: (Date.now() + Math.random() * 2).toString(),
      title,
      labels: [],
      date: "",
      tasks: [],
      desc: "",
      result: {
      draggableId: (Date.now() + Math.random() * 2).toString(),
          source: {
        boardId: boardId,
            index: boardIndex,
      },
      destination: {
        boardId:  null,
        index: null,
      },
    }
    });
    setBoards(tempBoardsList);
  };

  const removeCard = (boardId: string, cardId: string) => {
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
    console.log(type, 'resultType')
    console.log(result, 'result');
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
        console.log('not equal');
        const activeBoard = tempBoardsList.find((board) => tempBoardsList.indexOf(board) === source.index);
        console.log(activeBoard, 'activeBoard');
        const switchingBoard = tempBoardsList[destination.index];
        tempBoardsList[destination.index] = activeBoard;
        tempBoardsList[source.index] = switchingBoard;
        console.log( tempBoardsList[destination.index], tempBoardsList[source.index], tempBoardsList);
       setBoards(tempBoardsList);
      }
    }
    updateLocalStorageBoards(boards);
    // } else if (type === 'column') {
    //   if (source.index !== destination.index) {
    //   const activeBoard = tempBoardsList.find((board) => tempBoardsList.indexOf(board) === source.index);
    //   console.log(activeBoard, 'activeBoard');
    //   const switchingBoard = tempBoardsList[destination.index];
    //   tempBoardsList[destination.index] = activeBoard;
    //   tempBoardsList[source.index] = switchingBoard;
    //   }
    //   updateLocalStorageBoards(tempBoardsList);
    }



  const onDragEnter = (boardId: string, cardId: string) => {
  };

  useEffect(() => {
    updateLocalStorageBoards(boards);
    console.log('update', uniquePlan);
  }, [boards]);

  return (
      <Box m="20px">
        <PageTitle style={{ color: colors.blueAccent[100] }}>
          <h1>Образовательный план</h1>
        </PageTitle>

        <Box display="grid" gridTemplateColumns="repeat(12, 0.5fr)">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided, snapshot) => (
                  <ModulesContainer
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{backgroundColor: snapshot.isDraggingOver? colors.educationalPlan.boardsWrapper : 'initial'}}>
                    {boards.map((item, index) => (
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
                          text="Добавить модуль"
                          buttonText="Добавить модуль"
                          onSubmit={handleAddBoard}
                      />
                    </AddModuleButton>
                  </ModulesContainer>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>
  );
};
export default EducationalPlan;
