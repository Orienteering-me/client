import { createContext } from "react";

export interface ModifyCourseContextCheckpoint {
  course: string;
  number: number;
  lat: number;
  lng: number;
}

type ModifyCourseContextType = {
  courseName: string;
  checkpoints: ModifyCourseContextCheckpoint[] | null;
  setCheckpoints: (checkpoints: ModifyCourseContextCheckpoint[] | null) => void;
};

export const ModifyCourseContext = createContext<ModifyCourseContextType>({
  courseName: "",
  checkpoints: null,
  setCheckpoints: () => {},
});
