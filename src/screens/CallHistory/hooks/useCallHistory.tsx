import { useState } from "react";

export const useCallHistory = () => {
  const [callHistoryLoading, setCallHistoryLoading] = useState({
    addCallHistory: false,
  });
  const addCallHistory = () => {
    console.log("Adding call history");
  };
  return { callHistoryLoading, addCallHistory };
};
