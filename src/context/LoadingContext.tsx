import React, { createContext } from "react";

type LoadingContextProps = {
  setLoading: any,
  loading: boolean
}

export const LoadingContext = createContext<LoadingContextProps>({
  setLoading: null,
  loading: false
})