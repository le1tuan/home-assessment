import React, { createContext } from "react";

type ErrorContextProps = {
  setError: any,
  error: string | null
}

export const ErrorContext = createContext<ErrorContextProps>({
  setError: null,
  error: null
})