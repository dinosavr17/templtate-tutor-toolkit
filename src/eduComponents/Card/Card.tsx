// @ts-ignore
import React, {useEffect, useState} from "react";
// @ts-ignore
import { AlignLeft, CheckSquare, Clock, MoreHorizontal } from "react-feather";
// @ts-ignore
import { formatDate } from "../../Helper/Util.ts";
import { ICard } from "../../Interfaces/Kanban";
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
interface CardProps {
  card: ICard;
  boardId: string;
  removeCard: (boardId: string, cardId: string) => void;
  onDragEnd: (boardId: string, cardId: string) => void;
  onDragEnter: (boardId: string, cardId: string) => void;
  updateCard: (boardId: string, cardId: string, card: ICard) => void;
  provided: any;
  snapshot: any
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
`

function Card(props: CardProps) {
  const { card, boardId, removeCard, onDragEnd, onDragEnter, updateCard, provided, snapshot } =
    props;
  const { id, title, desc, date, tasks, labels } = card;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setMounted] = useState(false);
  const MODAL_CONTAINER_ID = 'card-details-container-id';

  useEffect(() => {
    createContainer({ id: MODAL_CONTAINER_ID });
    setMounted(true);
  }, []);

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
        onDragEnd={() => onDragEnd(boardId, id)}
        onDragEnter={() => onDragEnter(boardId, id)}
        onClick={() => setShowModal(true)}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          userSelect: "none",
          padding: 16,
          margin: "0 0 8px 0",
          minHeight: "50px",
          backgroundColor: snapshot.isDragging
              ? "#76abda"
              : "#afb8d0",
          color: "white",
          ...provided.draggableProps.style
        }}
      >
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
            <MoreHorizontal />
            {showDropdown && (
              <Dropdown
                class="board-dropdown"
                onClose={() => setShowDropdown(false)}
              >
                <p onClick={() => removeCard(boardId, id)}>Delete Card</p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="card-title" style={{color: 'black'}}>{title}</div>
        <div>
          <p title={desc}>
            <AlignLeft />
          </p>
        </div>
        <div className="card-footer">
          {date && (
            <p className="card-footer-item">
              <Clock className="card-footer-icon" />
              {formatDate(date)}
            </p>
          )}
          {tasks && tasks?.length > 0 && (
            <p className="card-footer-item">
              <CheckSquare className="card-footer-icon" />
              {tasks?.filter((item) => item.completed)?.length}/{tasks?.length}
            </p>
          )}
        </div>
          {provided.placeholder}
      </div>
    </>
  );
}

export default Card;
