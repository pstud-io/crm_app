import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";
import { useTheme } from "@/hooks/useTheme";
import React, { useState } from "react";
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";
// import { formElementsStyles } from "@/design/form";
import LoadingIndicatorFooter from "./LoadingIndicatorFooter";
import { primaryColors } from "@/design/colors";
import DownArrow from "assets/icons/DownArrow";
import { DropdownDataItem } from "./DropdownDataItem";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProject } from "@/store/slices/projectSlice/projectSlice";
import { ProjectRecord } from "@/store/slices/projectSlice/projectSliceTypes";
import { RootState } from "@/store/store";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { useFormElementsStyles } from "@/hooks/useFormElementsStyles";
import { CustomDropdown } from "./CustomDropdown";
interface SelectProjectType {
  dropdownRef: React.RefObject<IDropdownRef | null>;
}

export const SelectProject = ({ dropdownRef }: SelectProjectType) => {
  const [projectsData, setProjectsData] = useState<ProjectRecord[]>([]);
  const { getProjects, generalLoading } = useGeneralEndpoints();
  const projectSearch = usePaginatedSearch<ProjectRecord>({
    data: projectsData,
    setData: setProjectsData,
    getData: getProjects,
    loading: generalLoading.getProjects,
    pageSize: 25,
  });
  const selectedProject = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  return (
    <CustomDropdown
      ref={dropdownRef}
      onFocus={async () => await projectSearch.onFocus()}
      onBlur={async () => await projectSearch.onAbort()}
      data={projectsData}
      labelField="project_name"
      valueField="id"
      searchField="project_name"
      placeholder="Select Project"
      value={selectedProject?.id}
      searchPlaceholder="Search Projects"
      itemDisplayField={"project_name"}
      onChange={(item) => dispatch(setSelectedProject(item))}
      onEndReached={async () => await projectSearch.onEndReached()}
      loading={generalLoading.getProjects}
      onChangeText={async (text: string) => projectSearch.onSearch(text)}
    />
  );
};
