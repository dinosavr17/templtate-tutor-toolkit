export interface ILabel {
  color: string;
  text: string;
}

export interface ITask {
  id: string;
  completed: boolean;
  text: string;
}

export interface ICard {
  id: string;
  title: string;
  labels: ILabel[];
  date: string;
  tasks: ITask[];
  desc?: string;
}

export interface IBoard {
  id: string;
  title: string;
  cards: ICard[];
}
