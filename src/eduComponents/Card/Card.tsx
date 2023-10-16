// @ts-ignore
import React, { useState } from "react";
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
interface CardProps {
  card: ICard;
  boardId: number;
  removeCard: (boardId: number, cardId: number) => void;
  onDragEnd: (boardId: number, cardId: number) => void;
  onDragEnter: (boardId: number, cardId: number) => void;
  updateCard: (boardId: number, cardId: number, card: ICard) => void;
}
function Card(props: CardProps) {
  const { card, boardId, removeCard, onDragEnd, onDragEnter, updateCard } =
    props;
  const { id, title, desc, date, tasks, labels } = card;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={card}
          boardId={boardId}
          updateCard={updateCard}
        />
      )}
      <div
        className="card"
        key={card.id}
        draggable
        onDragEnd={() => onDragEnd(boardId, id)}
        onDragEnter={() => onDragEnter(boardId, id)}
        onClick={() => setShowModal(true)}
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
        <div className="card-title">{title}</div>
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
      </div>
    </>
  );
}

export default Card;
