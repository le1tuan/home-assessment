import { useContext } from "react"
import { DataTable } from "@/components/DataTable/DataTable";
import { AppBar, Button, Toolbar, Box, Container, Alert, Snackbar } from "@mui/material";
import { WalletContext } from "@/context/WalletContext";
import { ErrorContext } from "@/context/ErrorContext";
import { LoadingContext } from "@/context/LoadingContext";
import { useGetReserveList } from "@/hook/useGetReserveList";
import { useGetReserveData } from "@/hook/useGetReserveData";
import { Loading } from "@/components/loading/Loading";

export const ReserveData = () => {
  const { handleConnect, currentAccount } = useContext(WalletContext);
  const { error, setError } = useContext(ErrorContext);
  const { setLoading, loading } = useContext(LoadingContext);
  const { reserveList } = useGetReserveList();
  const { reserveData, latestFetched } = useGetReserveData({
    reserveList
  });

  const displayAddress = currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`.toLowerCase() : '';

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
      {loading && <Loading />}
      <AppBar
        position="static"
      >
        <Toolbar>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            <Button color="inherit" onClick={handleClickButton} disabled={loading}>
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
          reserveData={reserveData}
          latestFetched={latestFetched}
        />
      </Container>
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
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