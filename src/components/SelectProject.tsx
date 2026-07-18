import { useProjectEndpoints } from "@/hooks/useProjectEndpoints";
import React, { useState } from "react";
import { IDropdownRef } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProject } from "@/store/slices/projectSlice/projectSlice";
import { ProjectRecord } from "@/store/slices/projectSlice/projectSliceTypes";
import { RootState } from "@/store/store";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { CustomDropdown } from "./CustomDropdown";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { DownArrowOutlineIcon } from "@/svg";
import { xstack } from "@/design/layout";
interface SelectProjectType {
  dropdownRef: React.RefObject<IDropdownRef | null>;
}

export const SelectProject = ({ dropdownRef }: SelectProjectType) => {
  const { theme } = useTheme();
  const [projectsData, setProjectsData] = useState<ProjectRecord[]>([]);
  const { getProjects, generalLoading } = useProjectEndpoints();
  const projectSearch = usePaginatedSearch<ProjectRecord>({
    data: projectsData,
    setData: setProjectsData,
    getData: getProjects,
    loading: generalLoading.getProjects,
    pageSize: 25,
    extraParams: {},
  });
  const selectedProject = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  return (
    <>
      <CustomDropdown
        ref={dropdownRef}
        onFocus={async () => await projectSearch.onFocus()}
        onBlur={async () => await projectSearch.onAbort()}
        data={projectsData}
        labelField="project_name"
        valueField="id"
        searchField="project_name"
        placeholder="Select Lead"
        value={selectedProject?.id}
        searchPlaceholder="Search Leads"
        itemDisplayField={"project_name"}
        onChange={(item) => dispatch(setSelectedProject(item))}
        onEndReached={async () => await projectSearch.onEndReached()}
        loading={generalLoading.getProjects}
        onChangeText={async (text: string) => projectSearch.onSearch(text)}
      />
      <DownArrowOutlineIcon width={14} height={14} color={theme.text} />
    </>
  );
};
