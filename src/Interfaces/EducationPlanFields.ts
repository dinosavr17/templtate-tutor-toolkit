import {dark, light} from "@mui/material/styles/createPalette";

export interface ILabel {
  color: string;
  title: string;
}

export interface ITask {
  id: string;
  completed: boolean;
  text: string;
}
export type TopicStatus = 'not_started' | 'in_progress' | 'done' | 'to_repeat';
export type StatusColors = {
  [key in TopicStatus]: {
    dark: string;
    light: string;
}
};
export type TopicDifficulty = 'easy' | 'medium' | 'hard' | 'not_selected';
export type TopicDestination = 'homework' | 'lesson' | 'repetition';
export type TopicDestinationText = 'Домашняя работа' | 'Урок' | 'Повторение';
export type TopicDifficultyText = 'легкая' | 'средняя' | 'сложная' | 'не выбрана';

export interface ICard {
  id: string;
  index: number;
  title: string;
  type?: string;
  status: TopicStatus;
  labels: ILabel[];
  date: string;
  description?: string;
  difficulty: string;
  result_time: string;
  date_start: Date;
  date_end: Date;
  result: {
    draggableId: string,
    source: {
      boardId: string,
      index: number,
    },
    destination: {
      boardId: string | null,
      index: number | null,
    },
  }
}
export interface ICardCompleted {
  id: string;
  result_time: string;
  date_start: Date;
  date_end: Date;
  repetition_date: Date;
}

export interface IBoard {
  id: string;
  index: number;
  title: string;
  cards: ICard[];
  type?: string;
}
