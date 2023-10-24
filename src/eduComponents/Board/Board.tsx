import { useState, useRef, useEffect } from "react";
// @ts-ignore
import React from 'react'


// @ts-ignore
import Card from "../Card/Card.tsx";
// @ts-ignore
import Dropdown from "../Dropdown/Dropdown.tsx";
// @ts-ignore
import CustomInput from "../CustomInput/CustomInput.tsx";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
// @ts-ignore
import Portal, {createContainer} from "./Portal.ts";
import "./Board.css";
import { IBoard, ICard } from "../../Interfaces/Kanban";
import styled from "styled-components";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useTheme} from "@mui/material";
import { tokens } from "../../theme";



interface BoardProps {
  board: IBoard;
  addCard: (boardId: number, title: string) => void;
  removeBoard: (boardId: number) => void;
  removeCard: (boardId: number, cardId: number) => void;
  onDragEnd: (boardId: number, cardId: number) => void;
  onDragEnter: (boardId: number, cardId: number) => void;
  updateCard: (boardId: number, cardId: number, card: ICard) => void;
}

const EducationalModule = styled.div`
  min-width: 270px;
  width: 290px;
  overflow: visible;
  flex-basis: 290px;
  display: flex;
  flex-direction: column;
  margin: 15px;
`;

const ModuleContent = styled.div`
   background-color: rgb(223 227 230 / 55%);
  padding: 15px;
  border-radius: 3px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
`;
const Title = styled.p`
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  width: 100%;
`;

const RemoveIcon = styled.span`
margin: 0 10px;
  display: flex;
  justify-items: center;
  align-items: center;
`;

const CardsQuantity = styled.span`
margin: 0 10px;
`;

const AlertOverlay = styled.div`
  background: rgba(73, 71, 71, 0.4);
  position: fixed;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  z-index: 1030;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;

  :first-child > :first-child {
    font-size: 2em;
  }
`;

const AlertTitle = styled.div`
  font-size: 1.5em;
`;

const AlertButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 30px 0 0 0;
  font-size: 1.5em;
  justify-content: flex-end;
  & > button {
    margin: 10px;
  }
`;

const AlertButton = styled.button`
  display: flex;
  flex-direction: row;
  margin: 10px;
  font-size: 1.5em;
`;

const CardsWrapper = styled.div`
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`


const Board = (props: BoardProps) => {
  const [isMounted, setMounted] = useState(false);
  const MODAL_CONTAINER_ID = 'modal-container-id';

  useEffect(() => {
    createContainer({ id: MODAL_CONTAINER_ID });
    setMounted(true);
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log(theme.palette.mode, 'тема');
  const {
    board,
    addCard,
    removeBoard,
    removeCard,
    onDragEnd,
    onDragEnter,
    updateCard,
  } = props;
  const [alertVisible, setAlertVisible] = useState(false);
  return (
    <EducationalModule>
      <ModuleContent key={board?.id} style={{backgroundColor: colors.blueAccent[100]}}>
        <Header>
          <Title style={{color: colors.blueAccent[900]}}>
            {board?.title}
            <CardsQuantity>{board?.cards?.length || 0}</CardsQuantity>
            <RemoveIcon onClick={() => setAlertVisible(true)}><DeleteOutlineOutlinedIcon/></RemoveIcon>
          </Title>
          {isMounted && (
          <Portal id={MODAL_CONTAINER_ID}>
            {alertVisible &&
          <AlertOverlay
              style={(theme.palette.mode === 'dark')?
                  {backgroundColor: 'rgba(255, 255, 255, 0.4)'} : {backgroundColor:  'rgba(73, 71, 71, 0.4)'}}
          >
              <Alert
                  severity="warning"
                  sx={{
                    width: '50%',
                    height: '20%',
                    zIndex: '1030',
                    flexDirection: 'column',
                    position: 'relative',
                    backgroundColor: colors.alertOrange[100],
                  }}>
                <AlertTitle>
                Вы действительно хотите удалить модуль?
                  <br/>
                  Это необратимое действие
                </AlertTitle>
                  <AlertButtonWrapper>
                    <Button
                        variant="outlined"
                        color="warning"
                        sx={{
                         borderColor: colors.alertOrange[200],
                          fontWeight: 400,
                        }}
                    onClick={() => {
                  removeBoard(board?.id);
                  setAlertVisible(false);
                }}>
                      Да
                    </Button>
                <Button
                    variant="outlined" color="success"
                    onClick={() => setAlertVisible(false)}
                    sx={{
                      borderColor: colors.greenAccent[1000],
                      fontWeight: 400,
                    }}
                >
                  Нет
                </Button>
                  </AlertButtonWrapper>
              </Alert>
          </AlertOverlay>
            }
          </Portal>
              )}
        </Header>
        <CardsWrapper className="custom-scroll">
          {board?.cards?.map((item) => (
            <Card
              key={item.id}
              card={item}
              boardId={board.id}
              removeCard={removeCard}
              onDragEnter={onDragEnter}
              onDragEnd={onDragEnd}
              updateCard={updateCard}
            />
          ))}
          <CustomInput
            text="+ Add Card"
            placeholder="Enter Card Title"
            displayClass="board-add-card"
            editClass="board-add-card-edit"
            onSubmit={(value: string) => addCard(board?.id, value)}
          />
        </CardsWrapper>
      </ModuleContent>
    </EducationalModule>
  );
}

export default Board;
