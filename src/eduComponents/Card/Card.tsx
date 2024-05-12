// @ts-ignore
import React, {useEffect, useState, useRef} from "react";
// @ts-ignore
import { AlignLeft, CheckSquare, Clock, MoreHorizontal } from "react-feather";
// @ts-ignore
import { formatDate } from "../../Helper/Util.ts";
import {ICard, StatusColors} from "../../Interfaces/EducationPlanFields";
// @ts-ignore
import Chip from "../Common/Chip.tsx";
// @ts-ignore
import Dropdown from "../Dropdown/Dropdown.tsx";

import "./Card.css";
// @ts-ignore
import CardInfo from "./CardInfo/CardInfo.tsx";
// @ts-ignore
import Portal, {createContainer} from "../Board/Portal.ts";
import styled from "styled-components";
import {Switch, useTheme} from "@mui/material";
import { tokens } from "../../theme";
import {IOSSwitch} from "../../shared/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
interface CardProps {
  card: ICard;
  boardId: string;
  removeCard: (boardId: string, cardId: string) => void;
  onDragEnd: (
      boardId: string,
      cardId: string,
  ) => void;

  onDragEnter: (boardId: string, cardId: string) => void;
  updateCard: (boardId: string, cardId: string, card: ICard) => void;
  provided: any;
  snapshot: any;
  setCardHeight: any;
}
const ModalOverlay = styled.div`
  background: rgba(255, 255, 255, 0.4);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1030;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CardBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: flex-start;
  
`
export const DifficultyMarker = styled.div `
  width: 15px;
  min-height: 80px;
  margin-right: 16px;
  margin-left: -16px;
  margin-top: -16px;
  margin-bottom: -16px;
  //background-color: #4774d5;
  & > p {
    transform: rotate(270deg);
    margin-left: 20px;
    margin-top: 40px;
    font-size: 14px;
  }

  border-radius: 8px;
  background-image: linear-gradient(45deg, rgb(255, 255, 255) 25%, transparent 25%, transparent 50%, rgb(255, 255, 255) 50%, rgb(255, 255, 255) 75%, transparent 75%);
  background-size: 8px 8px; /* Уменьшаем размер штриха */
`

function Card(props: CardProps) {
  const { card,
      boardId,
      removeCard,
      onDragEnd,
      onDragEnter,
      updateCard,
      provided,
      snapshot,
      setCardHeight
  } =
    props;
  const { id, title, description, date, labels, status, result_time, difficulty } = card;
  console.log(card, 'данные карточки');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setMounted] = useState(false);
  const MODAL_CONTAINER_ID = 'card-details-container-id';
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  useEffect(() => {
    createContainer({ id: MODAL_CONTAINER_ID });
    setMounted(true);
  }, []);
    const activeCardRef = useRef<HTMLDivElement>(null)
  const setRef = (ref) => {
        if (isMounted) {
            activeCardRef.current = ref;
            if (activeCardRef.current) {
                setCardHeight(activeCardRef.current.offsetHeight);
            }
        }
      provided.innerRef(ref);
  }
  const statusColors: StatusColors = {
    'not_started': { dark: '#7F8C8D', light: '#BDC3C7' }, // Серый
    'in_progress': { dark: '#2ECC71', light: '#1bcd2a' }, // Зеленый
    'done': { dark: '#F1C40F', light: '#ecb529' }, // Желтый
    'to_repeat': { dark: '#3498DB', light: '#4496d9' } // Голубой
  };
    console.log(result_time, 'result');
    const displayEstimatedTime = (time) => {
        const timeArray = time.split(':');
        return `${timeArray[0]} ч. ` + `${timeArray[1]} мин.`
    }
  return (
    <>
      {isMounted && (
          <Portal id={MODAL_CONTAINER_ID}>
      {showModal && (
          <ModalOverlay>
        <CardInfo
          onClose={() => setShowModal(false)}
          card={card}
          boardId={boardId}
          updateCard={updateCard}
        />
          </ModalOverlay>
      )}
          </Portal>
          )}
      <div
        className="card"
        key={card.id}
        draggable
        // ref={activeCardRef}
        onDragEnd={onDragEnd}
        // onDragEnter={onDragEnter(boardId, card?.id)}
        onClick={() => setShowModal(true)}
        // ref={setRef(this)}
        ref={(node) => {setRef(node)}}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          userSelect: "none",
          padding: 16,
          margin: "0 0 8px 0",
          minHeight: "50px",
          backgroundColor: snapshot.isDragging
              ? `${colors.educationalPlan.activeCard}`
              : `${colors.educationalPlan.card}`,
          color: "white",
          ...provided.draggableProps.style
        }}
      >
          <div style={{display: 'flex', flexDirection: "row"}}>
              {(difficulty !== 'not_selected' && difficulty !== '')  &&
                  <DifficultyMarker
                      style={{backgroundColor: difficulty === 'easy' ? '#86ED26' : difficulty === 'medium' ? '#FEDD00' : difficulty === 'hard' ? '#B30018' : ''}}/>
              }
              <main>
        <div className="card-top">
          <div className="card-top-labels">
            {labels?.map((item, index) => (
              <Chip key={index} item={item} />
            ))}
          </div>
          <div
            className="card-top-more"
            onClick={(event) => {
              event.stopPropagation();
              setShowDropdown(true);
            }}
          >
            <MoreHorizontal style={{color: colors.blueAccent[500]}}/>
            {showDropdown && (
              <Dropdown
                class="board-dropdown"
                onClose={() => setShowDropdown(false)}
                style={{zIndex: 999}}
              >
                <p style={{color: 'black'}} onClick={() => removeCard(boardId, id)}>Удалить тему</p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="card-title" style={{color: 'black'}}>{title}</div>
        {/*<AlignLeft />*/}
        <CardBody>
          <p style={{color: 'black'}} title={description}>
            {description}
          </p>
          <FormControlLabel
            onClick={(event) => {
              event.stopPropagation();
            }}
            control={<IOSSwitch status={status} sx={{ m: 1, marginLeft: '40px' }} lightColor={statusColors[status]?.light} darkColour={statusColors[status]?.dark}  />}
            label={''}
          />
        </CardBody>
        <div className="card-footer">
          {result_time && (
            <p className="card-footer-item">
              <Clock className="card-footer-icon" />
              {displayEstimatedTime(result_time)}
            </p>
          )}
        </div>
              </main>
          </div>
          {provided.placeholder}
      </div>
    </>
  );
}

export default Card;
