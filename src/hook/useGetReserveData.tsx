import { connectPoolContract, getReserveData, ReserveListItem } from "@/contract";
import { delay } from "@/utils/delay";
import Big from "big.js";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/context/LoadingContext";
import { ErrorContext } from "@/context/ErrorContext";
import { LATEST_FETCHED_RESERVE_DATA, RESERVE_DATA } from "@/utils/constants";
import { convertDateToMinutes } from "@/utils/number";

type Props = {
  reserveList: Array<ReserveListItem>
}

type ReserveData = ReserveListItem & {
  variableBorrowRate: number | string
}

const savedTime = localStorage.getItem(LATEST_FETCHED_RESERVE_DATA);
const rawSavedReserveData = localStorage.getItem(RESERVE_DATA);
const INTERVAL_FETCH = 5;

export const useGetReserveData = ({
  reserveList
}: Props) => {
  const [reserveData, setReserveData] = useState<Array<ReserveData>>(rawSavedReserveData ? JSON.parse(rawSavedReserveData) : []);
  const [latestFetched, setLatestFetched] = useState(savedTime ? parseFloat(JSON.parse(savedTime)) : 0);
  const { setLoading } = useContext(LoadingContext);
  const { setError } = useContext(ErrorContext);

  const handleParseBorrowRate = (rate: number | string) => {
    const borrowRate = new Big(rate);
    const RAY_DECIMALS = new Big("1" + "0".repeat(27));
    const currentBorrowRate = borrowRate.div(RAY_DECIMALS);
    return currentBorrowRate.toFixed(5);
  }

  const handleGetReserveData = async () => {
    try {
      if (!reserveList || reserveList.length === 0) {
        throw new Error("Can not get reserve data");
      }
      setLoading(true);
      const fetchedReserveData: Array<ReserveData> = [];
      const errors = [];
      await connectPoolContract();
      const promises = reserveList.map(async (data) => {
        if (data.address) {
          await delay();
          const result = await getReserveData(data.address);
          if (result[6]) {
            return {
              ...data,
              variableBorrowRate: handleParseBorrowRate(result[6])
            }
          }
        }
      });
      const results = await Promise.allSettled(promises);
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result?.value) {
          fetchedReserveData.push(result.value);
        } else if (result.status === 'rejected') {
          errors.push(result.reason)
        }
      })
      const dateNow = Date.now();
      localStorage.setItem(RESERVE_DATA, JSON.stringify(fetchedReserveData))
      setReserveData(fetchedReserveData);
      setLoading(false);
      if (errors.length > 0) {
        throw new Error('Can not fetch symbol of some reserve data')
      } else {
        localStorage.setItem(LATEST_FETCHED_RESERVE_DATA, JSON.stringify(dateNow));
        setLatestFetched(dateNow)
      }
    } catch (error) {
      setLoading(false);
      setError((error as any)?.message);
    }
  }

  useEffect(() => {
    const now = Date.now();
    const duration = latestFetched ? convertDateToMinutes(now - latestFetched) : 10;
    if (reserveList && reserveList.length > 0 && duration > INTERVAL_FETCH) {
      handleGetReserveData()
    }
  }, [reserveList])

  return {
    reserveData,
    latestFetched
  }
}