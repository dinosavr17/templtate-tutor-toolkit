// @ts-ignore
import React, { useEffect, useState } from "react";
// @ts-ignore
import Board from "../../eduComponents/Board/Board.tsx";
import "./Dashboard.css";
// @ts-ignore
import CustomInput from "../../eduComponents/CustomInput/CustomInput.tsx";
import { ICard, IBoard } from "../../Interfaces/Kanban";
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
`
const ModulesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 85vw;
  gap: 10px;
`
const AddModuleButton = styled.div`
  flex-basis: 290px;
  min-width: 290px;
`
export const EducationalPlan = () => {
  const theme = useTheme();
   const colors = tokens(theme.palette.mode);
  const [boards, setBoards] = useState<IBoard[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const boards: IBoard[] = await fetchBoardList();
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
    const { destination, source, draggableId } = result;
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
    const targetBoard = tempBoardsList.find((board) => board.id === source.droppableId );
      const targetCard = targetBoard?.cards.find((card) => card.id === draggableId);
   if ((source.index !== destination.index) && (destination.droppableId === source.droppableId)) {
     const switchingCard = targetBoard.cards[destination.index];
     targetBoard.cards[destination.index] = targetCard;
     targetBoard.cards[source.index] = switchingCard;
     updateLocalStorageBoards(tempBoardsList);
   } else if (destination.droppableId !== source.droppableId) {
     const switchingBoard = tempBoardsList.find((board) => board.id === destination.droppableId );
     const shiftArrayFromIndex = (arr, startIndex) => {
       if (startIndex < 0 || startIndex > arr.length) {
         return arr;
       }
      arr.splice(destination.index, 0, targetCard);
       targetBoard.cards.splice(source.index, 1);
     };
     shiftArrayFromIndex(switchingBoard.cards, destination.index);
     updateLocalStorageBoards(tempBoardsList);

   }
  }



  const onDragEnter = (boardId: string, cardId: string) => {
  };

  useEffect(() => {
    updateLocalStorageBoards(boards);
    console.log('update');
  }, [boards]);

  return (
    <Box m="20px">
      <PageTitle style={{color: colors.blueAccent[100]}}>
        <h1>Образовательный план</h1>
      </PageTitle>

      <Box  display="grid"
            gridTemplateColumns="repeat(12, 0.5fr)">
        <DragDropContext
            onDragEnd={onDragEnd}
        >
        <ModulesContainer>
            {boards.map((item, index) => (
                <Droppable droppableId={item.id} key={item.id}>
                  {(provided, snapshot) => (
                      <Board
                          provided={provided}
                          snapshot={snapshot}
                          key={item.id}
                          board={item}
                          addCard={addCardHandler}
                          removeBoard={() => removeBoard(item.id)}
                          removeCard={removeCard}
                          // onDragEnd={onDragEnd}
                          onDragEnter={onDragEnter}
                          updateCard={updateCard}
                          droppableId={item.id}
                      />
                  )}
                </Droppable>
            ))}

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
        </DragDropContext>
      </Box>
    </Box>
  );
}
export default EducationalPlan;
