
import { ErrorContext } from "@/context/ErrorContext";
import { useContext, useState } from "react"

type UseWalletProps = {
  setError: any
}

export const useWallet = ({
  setError
}: UseWalletProps) => {

  const [currentAccount, setCurrentAccount] = useState(null);


  const handleConnect = async () => {
    const accounts = await window?.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err) => {
        if (err.code === 4001) {
          setError('User rejected the request.')
        } else {
          setError('Can not connect to your wallet')
        }
      })
    const account = accounts[0];
    setCurrentAccount(account)
  }

  return {
    currentAccount,
    handleConnect,
  }
}