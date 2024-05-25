import { useState, useEffect, useRef } from "react";
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
import {IBoard, ICard, ICardCompleted} from "../../Interfaces/EducationPlanFields";
import styled from "styled-components";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useTheme} from "@mui/material";
import { tokens } from "../../theme";
import { Draggable } from "react-beautiful-dnd";
// @ts-ignore
import PrimaryModal from "../Card/CardInfo/PrimaryModal.tsx";



interface BoardProps {
  board: IBoard;
  addCard: (boardId: string, title: string, duration: string) => void;
  removeBoard: (boardId: string) => void;
  removeCard: (boardId: string, cardId: string) => void;
  onDragEnd: (boardId: string, cardId: string) => void;
  onDragEnter: (boardId: string, cardId: string) => void;
  updateCard: (boardId: string, cardId: string, card: ICard) => void;
  provided: any;
  snapshot: any;
  droppableId: any;
}

const EducationalModule = styled.div`
  min-width: 270px;
  width: 290px;
  overflow: visible;
  //flex-basis: 290px;
  display: flex;
  flex-direction: column;
  overflow: visible;
`;

const ModuleContent = styled.div`
   //background-color: rgb(223 227 230 / 55%);
  padding: 15px;
  border-radius: 3px;
  //flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: fit-content;
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

export const AlertTitle = styled.div`
  font-size: 1.5em;
`;
export const StatusOverlay = styled.div`
  background: rgba(73, 71, 71, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  z-index: 10001;
`;

export const AlertButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 30px 0 0 0;
  font-size: 1.5em;
  justify-content: flex-end;
  & > button {
    margin: 10px;
  }
`;

export const CardsWrapper = styled.div`
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
  //overflow-y: auto;
  //overflow: visible;
`
export const StyledButton = styled.button`
  background-color: #fff;
  font-size: 14px;
  color: #000;
  border-radius: 10px;
  box-shadow: 1px 1px 0 1px rgba(0, 0, 0, 0.12);
  width: 100%;
  text-align: center;
  border: none;
  cursor: pointer;
  padding: 8px;

  :hover {
    background-color: #767373;
  }
`;


const Board = (props: BoardProps) => {
  const [isMounted, setMounted] = useState(false);
  const MODAL_CONTAINER_ID = 'modal-container-id';
  const [cardHeight, setCardHeight] = useState(0);
  const [boardHeight, setBoardHeight] = useState(0);
  const [openPrimaryModal, setOpenPrimaryModal] = useState(false);
  const activeBoard = useRef<HTMLDivElement>(null)
  useEffect(() => {
    createContainer({ id: MODAL_CONTAINER_ID });
    setMounted(true);
    console.log(provided.snapshot, 'someprops');
  }, []);
  useEffect(() => {
    console.log(cardHeight);
  }, [cardHeight]);
  useEffect(() => {
   setBoardHeight(activeBoard?.current?.offsetHeight);

  }, [activeBoard]);

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
      snapshot,
   provided
  } = props;
  const [alertVisible, setAlertVisible] = useState(false);
  // const handleAddPrimaryProps = (value) => {
  //   setOpenPrimaryModal(true);
  //   addCard(board?.id, value);
  // }
  return (
    <EducationalModule key={board?.id} {...props} ref={provided?.innerRef} {...provided?.droppableProps} style={{
      backgroundColor: colors.educationalPlan.educationalModule,
         height: snapshot.isDraggingOver? `${boardHeight}` + `${cardHeight}`
          : 'inherit'
    }}>

      <ModuleContent key={board?.id} >
        <Header>
          <Title style={{color: colors.educationalPlan.textColor}}>
            {board?.title}
            <CardsQuantity>{board?.cards?.length || 0}</CardsQuantity>
            <RemoveIcon onClick={() => setAlertVisible(true)}><DeleteOutlineOutlinedIcon/></RemoveIcon>
          </Title>
          {isMounted && (
          <Portal id={MODAL_CONTAINER_ID}>
            {alertVisible &&
          <StatusOverlay
              style={(theme.palette.mode === 'dark')?
                  {backgroundColor: 'rgba(255, 255, 255, 0.4)'} : {backgroundColor:  'rgba(73, 71, 71, 0.4)'}}
          >
              <Alert
                  severity="warning"
                  sx={{
                    zIndex: '1030',
                    flexDirection: 'column',
                    // position: 'relative',
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
                  removeBoard(board?.id.toString());
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
          </StatusOverlay>
            }
            {openPrimaryModal && <PrimaryModal addCard={addCard} onClose={() => setOpenPrimaryModal(false)} boardId={board.id}/>}
          </Portal>
              )}
        </Header>
        <CardsWrapper className="custom-scroll" ref={activeBoard} style={{
          backgroundColor: snapshot.isDraggingOver? `${colors.educationalPlan.cardsWrapper}` : 'inherit',
          flexGrow: snapshot.isDraggingOver? '3' : 'inherit',
          height: snapshot.isDraggingOver? `${boardHeight}` + `${cardHeight}` : 'initial'
        }}>
          {board?.cards?.sort((a, b) => a.index - b.index).map((item, index) => (
              <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
              >
                {(provided, snapshot) => {
                  return (
            <Card
               provided={provided}
               snapshot={snapshot}
              key={item.id}
              card={item}
              boardId={board.id}
              removeCard={removeCard}
              updateCard={updateCard}
               setCardHeight={setCardHeight}
            />
                      )}}
              </Draggable>
          ))}
          {provided.placeholder}
          <StyledButton onClick={() => setOpenPrimaryModal(true)}>+ Добавить Тему</StyledButton>
        </CardsWrapper>
      </ModuleContent>
    </EducationalModule>
  );
}

export default Board;
