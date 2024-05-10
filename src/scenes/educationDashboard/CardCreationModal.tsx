// @ts-ignore
import React, { useEffect, useState } from "react";
import { Calendar, CheckSquare, List, Tag, Trash, Type } from "react-feather";
// @ts-ignore
import { colorsList } from "../../../Helper/Util.ts";
// @ts-ignore
import Modal from "../../Modal/Modal.tsx";
// @ts-ignore
import CustomInput from "../../CustomInput/CustomInput.tsx";

import "./CardInfo.css";
// @ts-ignore
import { ICard, ILabel, ITask } from "../../../Interfaces/EducationPlanFields.ts";
// @ts-ignore
import Chip from "../../Common/Chip.tsx";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import styled from "styled-components";
// @ts-ignore
import SelectComponent from "./SelectComponent.tsx";

interface CardCreationProps {
    onClose: () => void;
    card: ICard;
    boardId: number;
    updateCard: (boardId: number, cardId: number, card: ICard) => void;
}
const ModuleContent = styled.div`
  padding: 15px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  height: fit-content;
`;
function CardCreationModal(props: CardCreationProps) {
    const { onClose, card, boardId, updateCard } = props;
    const [selectedColor, setSelectedColor] = useState("");
    const [cardValues, setCardValues] = useState<ICard>({
        ...card,
    });
    //Initial модальное окно - которое открывается при создании новой темы
    //Обязательные поля:

    const updateTitle = (value: string) => {
        setCardValues({ ...cardValues, title: value });
    };

    const updateDesc = (value: string) => {
        setCardValues({ ...cardValues, desc: value });
    };

    const addLabel = async (label: ILabel) => {
        const index = cardValues.labels.findIndex(
            (item) => item.text === label.text,
        );
        if (index > -1) return;

        setSelectedColor("");
        setCardValues({
            ...cardValues,
            labels: [...cardValues.labels, label],
        });
    };

    const removeLabel = (label: ILabel) => {
        const tempLabels = cardValues.labels.filter(
            (item) => item.text !== label.text,
        );

        setCardValues({
            ...cardValues,
            labels: tempLabels,
        });
    };

    const addTask = (value: string) => {
        const task: ITask = {
            id: Date.now() + Math.random() * 2,
            completed: false,
            text: value,
        };
        setCardValues({
            ...cardValues,
            tasks: [...cardValues.tasks, task],
        });
    };

    const removeTask = (id: number) => {
        const tasks = [...cardValues.tasks];

        const tempTasks = tasks.filter((item) => item.id !== id);
        setCardValues({
            ...cardValues,
            tasks: tempTasks,
        });
    };

    const updateTask = (id: number, value: boolean) => {
        const tasks = [...cardValues.tasks];

        const index = tasks.findIndex((item) => item.id === id);
        if (index < 0) return;

        tasks[index].completed = Boolean(value);

        setCardValues({
            ...cardValues,
            tasks,
        });
    };

    const calculatePercent = () => {
        if (!cardValues.tasks?.length) return 0;
        const completed = cardValues.tasks?.filter(
            (item) => item.completed,
        )?.length;
        return (completed / cardValues.tasks?.length) * 100;
    };

    const updateDate = (date: string) => {
        if (!date) return;

        setCardValues({
            ...cardValues,
            date,
        });
    };

    useEffect(() => {
        if (updateCard) updateCard(boardId, cardValues.id, cardValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardValues]);

    const calculatedPercent = calculatePercent();

    return (
        <Modal onClose={onClose}>
            <div className="cardinfo">
                <div className="cardinfo-box">
                    <div className="cardinfo-box-title">
                        <Type />
                        <p>Название темы</p>
                    </div>
                    <CustomInput
                        defaultValue={cardValues.title}
                        text={cardValues.title}
                        placeholder="Enter Title"
                        onSubmit={updateTitle}
                    />
                </div>

                <div className="cardinfo-box">
                    <div className="cardinfo-box-title">
                        <ContentPasteOutlinedIcon/>
                        <p>Статус</p>
                    </div>
                </div>

                <div className="cardinfo-box">
                    <div className="cardinfo-box-title">
                        <StarBorderIcon />
                        <p>Сложность</p>
                    </div>
                    <SelectComponent/>
                </div>

                <div className="cardinfo-box">
                    <div className="cardinfo-box-title">
                        <List />
                        <p>Описание</p>
                    </div>
                    <CustomInput
                        defaultValue={cardValues.desc}
                        text={cardValues.desc || "Add a Description"}
                        placeholder="Enter description"
                        onSubmit={updateDesc}
                    />
                </div>

                <div className="cardinfo-box">
                    <div className="cardinfo-box-title">
                        <Calendar />
                        <p>Длительность</p>
                    </div>
                    <input
                        type="date"
                        defaultValue={cardValues.date}
                        min={new Date().toISOString().substr(0, 10)}
                        onChange={(event) => updateDate(event.target.value)}
                        lang="ru"
                    />
                </div>

                <div className="cardinfo-box">
                    <div className="cardinfo-box-title">
                        <Tag />
                        <p>Категории</p>
                    </div>
                    <div className="cardinfo-box-labels">
                        {cardValues.labels?.map((item, index) => (
                            <Chip key={index} item={item} removeLabel={removeLabel} />
                        ))}
                    </div>
                    <ul>
                        {colorsList.map((item, index) => (
                            <li
                                key={index}
                                style={{ backgroundColor: item }}
                                className={selectedColor === item ? "li-active" : ""}
                                onClick={() => setSelectedColor(item)}
                            />
                        ))}
                    </ul>
                    <CustomInput
                        text="Добавить категорию"
                        placeholder="Введите название категории"
                        onSubmit={(value: string) =>
                            addLabel({ color: selectedColor, text: value })
                        }
                    />
                </div>
            </div>
        </Modal>
    );
}

export default CardCreationModal;
