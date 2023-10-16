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
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import TrafficIcon from "@mui/icons-material/Traffic";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../../theme";

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
    boardId: 0,
    cardId: 0,
  });

  const addboardHandler = (name: string) => {
    const tempBoardsList = [...boards];
    tempBoardsList.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoards(tempBoardsList);
  };

  const removeBoard = (boardId: number) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    tempBoardsList.splice(boardIndex, 1);
    setBoards(tempBoardsList);
  };

  const addCardHandler = (boardId: number, title: string) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    tempBoardsList[boardIndex].cards.push({
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      tasks: [],
      desc: "",
    });
    setBoards(tempBoardsList);
  };

  const removeCard = (boardId: number, cardId: number) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const cards = tempBoardsList[boardIndex].cards;

    const cardIndex = cards.findIndex((item) => item.id === cardId);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoardsList);
  };

  const updateCard = (boardId: number, cardId: number, card: ICard) => {
    const boardIndex = boards.findIndex((item) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const cards = tempBoardsList[boardIndex].cards;

    const cardIndex = cards.findIndex((item) => item.id === cardId);
    if (cardIndex < 0) return;

    tempBoardsList[boardIndex].cards[cardIndex] = card;

    setBoards(tempBoardsList);
  };

  const onDragEnd = (boardId: number, cardId: number) => {
    const sourceBoardIndex = boards.findIndex(
      (item: IBoard) => item.id === boardId,
    );
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
    setBoards(tempBoardsList);

    setTargetCard({
      boardId: 0,
      cardId: 0,
    });
  };

  const onDragEnter = (boardId: number, cardId: number) => {
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
      <div className="app-nav">
        <h1>Образовательный план</h1>
      </div>
      <Box  display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="500px"
            gap="20px">
        <div>
          {boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
              removeCard={removeCard}
              onDragEnd={onDragEnd}
              onDragEnter={onDragEnter}
              updateCard={updateCard}
            />
          ))}
          <div className="app-boards-last">
            <CustomInput
              displayClass="app-boards-add-board"
              editClass="app-boards-add-board-edit"
              placeholder="Enter Board Name"
              text="Add Board"
              buttonText="Add Board"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default EducationalPlan;
