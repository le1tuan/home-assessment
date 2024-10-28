import { MILI_SEC, MINUTE } from "./constants";

export const convertDateToMinutes = (duration: number) => {
  return Math.floor(duration / (MILI_SEC * MINUTE));
}