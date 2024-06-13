import React, { useEffect, useState, useRef } from "react";
import { AlignLeft, CheckSquare, Clock, MoreHorizontal } from "react-feather";
import { formatDate } from "../../Helper/Util.ts";
import {IBoard, ICard, StatusColors} from "../../Interfaces/EducationPlanFields";
import Chip from "../Common/Chip.tsx";
import Dropdown from "../Dropdown/Dropdown.tsx";

import "./Card.css";
import CardInfo from "./CardInfo/CardInfo.tsx";
import Portal, { createContainer } from "../Board/Portal.ts";
import styled from "styled-components";
import { Popover, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { IOSSwitch } from "../../shared/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import SecondaryModal from "./CardInfo/SecondaryModal.tsx";
import axios from '../../api/axios'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ContentPasteGoRoundedIcon from '@mui/icons-material/ContentPasteGoRounded';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

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

export const CardBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: flex-start;
`;

export const DifficultyMarker = styled.div`
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
  background-image: linear-gradient(
    45deg,
    rgb(255, 255, 255) 25%,
    transparent 25%,
    transparent 50%,
    rgb(255, 255, 255) 50%,
    rgb(255, 255, 255) 75%,
    transparent 75%
  );
  background-size: 8px 8px; /* Уменьшаем размер штриха */
`;
const StyledDropdown = styled.div `
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 8px;
  & > p {
    display: flex;
    align-items: center;
    background-color: lightblue;
    text-align: left;
    margin-top: 4px;
    margin-bottom: 4px;
    padding: 2px 8px;
    border-radius: 8px;
    cursor: pointer;
  }
  
`

function Card(props: CardProps) {
    const {
        card,
        boardId,
        removeCard,
        onDragEnd,
        onDragEnter,
        updateCard,
        provided,
        snapshot,
        setCardHeight,
        getPlan
    } = props;
    const {
        id,
        title,
        description,
        date,
        labels,
        status,
        result_time,
        difficulty,
        plan_time,
    } = card;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isMounted, setMounted] = useState(false);
    const [isCompleteCard, setIsCompleted] = useState(false);
    const MODAL_CONTAINER_ID = "card-details-container-id";
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        createContainer({ id: MODAL_CONTAINER_ID });
        setMounted(true);
    }, []);

    useEffect(() => {
        if (status === "done" && showModal) {
            setIsCompleted(true);
        }
    }, [status]);

    const activeCardRef = useRef<HTMLDivElement>(null);

    const setRef = (ref) => {
        if (isMounted) {
            activeCardRef.current = ref;
            if (activeCardRef.current) {
                setCardHeight(activeCardRef.current.offsetHeight);
            }
        }
        provided.innerRef(ref);
    };

    const statusColors: StatusColors = {
        not_started: { dark: "#7F8C8D", light: "#BDC3C7" }, // Серый
        in_progress: { dark: "#2ECC71", light: "#1bcd2a" }, // Зеленый
        done: { dark: "#F1C40F", light: "#ecb529" }, // Желтый
        to_repeat: { dark: "#3498DB", light: "#4496d9" }, // Голубой
    };

    const displayEstimatedTime = (time) => {
        const timeArray = time.split(":");
        return `${timeArray[0]} ч. ` + `${timeArray[1]} мин.`;
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleShow = (event) => {
        setAnchorEl(event.currentTarget);
        setShowDropdown(!showDropdown);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setShowDropdown(false);
    };
    const saveTemplate = async (cardId) => {
        try {
            const response = await axios.post(`api/education_plan/card/${cardId}/create_template/`,
                JSON.stringify(
                    {
                        id: cardId,
                    }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
                    },
                    withCredentials: true
                }
            );
        } catch (err) {
        }
    }

    return (
        <>
            {isMounted && (
                <Portal id={MODAL_CONTAINER_ID}>
                    {showModal && (
                        <ModalOverlay>
                            <CardInfo
                                onClose={() => {setShowModal(false); getPlan()}}
                                card={card}
                                boardId={boardId}
                                updateCard={updateCard}
                            />
                        </ModalOverlay>
                    )}
                    {isCompleteCard && (
                        <ModalOverlay>
                            <SecondaryModal
                                onClose={() => setIsCompleted(false)}
                                card={card}
                                boardId={boardId}
                                updateCard={updateCard}
                                complete={() => setIsCompleted(true)}
                            />
                        </ModalOverlay>
                    )}
                </Portal>
            )}
            <div
                className="card"
                key={card.id}
                draggable
                onDragEnd={onDragEnd}
                onClick={() => setShowModal(true)}
                ref={(node) => {
                    setRef(node);
                }}
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
                    ...provided.draggableProps.style,
                }}
            >
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {difficulty !== "not_selected" && difficulty !== "" && (
                        <DifficultyMarker
                            style={{
                                backgroundColor:
                                    difficulty === "easy"
                                        ? "#86ED26"
                                        : difficulty === "medium"
                                            ? "#FEDD00"
                                            : difficulty === "hard"
                                                ? "#B30018"
                                                : "",
                            }}
                        />
                    )}
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
                                    handleShow(event);
                                }}
                            >
                                <ExpandMoreRoundedIcon style={{ color: 'black' }} />
                                {showDropdown && (
                                    <Popover
                                        id={id}
                                        open={showDropdown}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "left",
                                        }}
                                    >
                                        <StyledDropdown>
                                        <p onClick={() => {removeCard(boardId, id)}}>
                                            Удалить тему
                                            <span style={{marginLeft: '4px'}}>
                                                <DeleteOutlinedIcon/>
                                            </span>
                                        </p>
                                        <p onClick={() => {saveTemplate(id)}}>
                                            Сохранить тему как шаблон<span style={{marginLeft: '4px'}}><ContentPasteGoRoundedIcon/></span></p>
                                        </StyledDropdown>
                                    </Popover>
                                )}
                            </div>
                        </div>
                        <div className="card-title" style={{ color: "black" }}>
                            {title}
                        </div>
                        <CardBody>
                            <p style={{ color: "black" }} title={description}>
                                {description}
                            </p>
                            <FormControlLabel
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                                control={
                                    <IOSSwitch
                                        status={status}
                                        sx={{ m: 1, marginLeft: "40px" }}
                                        lightColor={statusColors[status]?.light}
                                        darkColour={statusColors[status]?.dark}
                                    />
                                }
                                label={""}
                            />
                        </CardBody>
                        <div className="card-footer">
                            {plan_time && (
                                <p className="card-footer-item">
                                    <Clock className="card-footer-icon" />
                                    {displayEstimatedTime(plan_time)}
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
