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

  const onDragEnd = (boardId: string, cardId: string) => {
    const sourceBoardIndex = boards.findIndex(
      (item: IBoard) => item.id === boardId,
    );
    console.log(sourceBoardIndex, 'Доски1');
    if (sourceBoardIndex < 0) return;

    const sourceCardIndex = boards[sourceBoardIndex]?.cards?.findIndex(
      (item) => item.id === cardId,
    );
    if (sourceCardIndex < 0) return;

    const targetBoardIndex = boards.findIndex(
      (item: IBoard) => item.id === targetCard.boardId,
    );
    if (targetBoardIndex < 0) return;

    const targetCardIndex = boards[targetBoardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cardId,
    );
    if (targetCardIndex < 0) return;

    const tempBoardsList = [...boards];
    const sourceCard = tempBoardsList[sourceBoardIndex].cards[sourceCardIndex];
    tempBoardsList[sourceBoardIndex].cards.splice(sourceCardIndex, 1);
    tempBoardsList[targetBoardIndex].cards.splice(
      targetCardIndex,
      0,
      sourceCard,
    );
    console.log(tempBoardsList, 'Доски');
    setBoards(tempBoardsList);

    setTargetCard({
      boardId: '0',
      cardId: '0',
    });
  };


  //   const sourceCardIndex = boards[sourceBoardIndex]?.cards?.findIndex(
  //     (item) => item.id === cardId,
  //   );
  //   if (sourceCardIndex < 0) return;
  //
  //   const targetBoardIndex = boards.findIndex(
  //     (item: IBoard) => item.id === targetCard.boardId,
  //   );
  //   if (targetBoardIndex < 0) return;
  //
  //   const targetCardIndex = boards[targetBoardIndex]?.cards?.findIndex(
  //     (item) => item.id === targetCard.cardId,
  //   );
  //   if (targetCardIndex < 0) return;
  //
  //   const tempBoardsList = [...boards];
  //   const sourceCard = tempBoardsList[sourceBoardIndex].cards[sourceCardIndex];
  //   tempBoardsList[sourceBoardIndex].cards.splice(sourceCardIndex, 1);
  //   tempBoardsList[targetBoardIndex].cards.splice(
  //     targetCardIndex,
  //     0,
  //     sourceCard,
  //   );
  //   setBoards(tempBoardsList);
  //
  //   setTargetCard({
  //     boardId: 0,
  //     cardId: 0,
  //   });
  // };
  const onDragEnter = (boardId: string, cardId: string) => {
    if (targetCard.cardId === cardId) return;
    setTargetCard({
      boardId: boardId,
      cardId: cardId,
    });
  };

  useEffect(() => {
    updateLocalStorageBoards(boards);
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
                          onDragEnd={onDragEnd}
                          onDragEnter={onDragEnter}
                          updateCard={updateCard}
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
