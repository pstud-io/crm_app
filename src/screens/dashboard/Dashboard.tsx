import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import AddProject from "@/components/common/AddProject/AddProject";
import { ListModules } from "./components/ListModules";
export const Dashboard = () => {
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("dashboard"));
    }, []),
  );

  return (
    <>
      <ListModules />
      <AddProject />
    </>
  );
};
