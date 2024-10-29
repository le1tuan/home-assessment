import { ErrorContext } from "@/context/ErrorContext";
import { LoadingContext } from "@/context/LoadingContext";
import { connectPoolContract, getReserveList, ReserveListItem } from "@/contract";
import { ADDRESS_LIST_KEY } from "@/utils/constants";
import { useContext, useEffect, useState } from "react";

const savedReserveList = localStorage.getItem(ADDRESS_LIST_KEY)

export const useGetReserveList = () => {
  const [reserveList, setReserveList] = useState<Array<ReserveListItem>>(savedReserveList ? JSON.parse(savedReserveList) : []);
  const { setLoading } = useContext(LoadingContext);
  const { setError } = useContext(ErrorContext);

  const handleContract = async () => {
    try {
      setLoading(true);
      await connectPoolContract();
      const rawSavedList = localStorage.getItem(ADDRESS_LIST_KEY);
      let savedList = rawSavedList ? JSON.parse(rawSavedList) : []
      if (!savedList || savedList.length === 0) {
        const list = await getReserveList();
        savedList = [...list];
        localStorage.setItem(ADDRESS_LIST_KEY, JSON.stringify(savedList))
      }
      setReserveList(savedList);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError((error as any)?.message);
    }

  }

  useEffect(() => {
    if (!savedReserveList || savedReserveList.length === 0) {
      handleContract();
    }
  }, [])

  return {
    reserveList
  }

}