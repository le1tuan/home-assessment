import { createContext } from "react";

type WalletContextProps = {
  handleConnect: (() => {}) | null,
  currentAccount: string | null
}

export const WalletContext = createContext<WalletContextProps>({
  handleConnect: null,
  currentAccount: null
})