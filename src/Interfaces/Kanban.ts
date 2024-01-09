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
  type?: string;
  labels: ILabel[];
  date: string;
  tasks: ITask[];
  desc?: string;
  difficulty: string;
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

export interface IBoard {
  id: string;
  title: string;
  cards: ICard[];
  type?: string;
}
