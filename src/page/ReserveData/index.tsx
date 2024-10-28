import { useContext, useEffect, useState } from "react"
import { connectTokenContract, getSymbol } from "../../contract";
import { ADDRESS_SYMBOL_LIST_KEY } from "@/utils/constants";
import { delay } from "@/utils/delay";
import { DataTable } from "@/components/DataTable/DataTable";
import { AppBar, Button, Toolbar, Box, Container, Alert, Snackbar } from "@mui/material";
import { WalletContext } from "@/context/WalletContext";
import { ErrorContext } from "@/context/ErrorContext";

type Props = {
  listAddress: Array<string>
}

export type TokenData = {
  symbol: string
  address: string
}

type SymbolAddress = Array<TokenData>
const rawSavedSymbolAddress = localStorage.getItem(ADDRESS_SYMBOL_LIST_KEY);
const savedSymbolAddress = rawSavedSymbolAddress ? JSON.parse(rawSavedSymbolAddress) : [];

export const ReserveData = ({
  listAddress
}: Props) => {

  const [tokenSymbol, setTokenSymbol] = useState<SymbolAddress>(savedSymbolAddress);
  const { handleConnect, currentAccount } = useContext(WalletContext);
  const { error, setError } = useContext(ErrorContext);

  const [loading, setLoading] = useState(false);

  const displayAddress = currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`.toLowerCase() : ''

  const handleFetchTokenSymbol = async () => {
    try {
      const fetchedTokenSymbol: SymbolAddress = [];
      const errors: Array<string> = [];

      const promises = listAddress.map(async (address) => {
        if (address) {
          try {
            const checkTokenSymbol = tokenSymbol.find((info) => {
              return info.address.toLowerCase() === address.toLowerCase()
            })

            if (checkTokenSymbol && checkTokenSymbol.symbol !== null) {
              console.log("checkTokenSymbol.symbol", checkTokenSymbol.symbol)
              return checkTokenSymbol
            }

            delay()
            const contractToken = await connectTokenContract(address);
            const symbol = await getSymbol(contractToken);
            return {
              address,
              symbol
            }
          } catch (error) {
            console.log("errr", error)
            throw new Error(`Failure: Can not get symbol of address ${address}`)
          }
        }
        throw new Error(`Failure: Empty Address`)
      });
      const results = await Promise.allSettled(promises);
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          fetchedTokenSymbol.push(result.value);
        } else {
          errors.push(result.reason)
        }
      })
      setTokenSymbol(fetchedTokenSymbol)
      localStorage.setItem(ADDRESS_SYMBOL_LIST_KEY, JSON.stringify(fetchedTokenSymbol))
      console.log("errors", errors)
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (!savedSymbolAddress
      || savedSymbolAddress.length === 0
      // || savedSymbolAddress.length !== listAddress.length
    ) {
      handleFetchTokenSymbol()
    }
  }, [listAddress, savedSymbolAddress])

  const handleClickButton = async () => {
    try {

      if (!currentAccount) {
        setLoading(true)
        await handleConnect!();
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }

  }


  return (
    <div>
      <AppBar
        position="static"
      >
        <Toolbar>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            <Button color="inherit" onClick={handleClickButton}>
              {
                currentAccount ? displayAddress : "Connect Wallet"
              }
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}
        maxWidth="lg"
      >
        <DataTable
          tokenSymbol={tokenSymbol}
        />
      </Container>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => {
          setError('')
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Alert
          onClose={() => {
            setError('')
          }}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  )
}