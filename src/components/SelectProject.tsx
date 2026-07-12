import { borderRadius } from "@/design/borders";
import { center, SCREEN_HEIGHT, SCREEN_WIDTH, xstack } from "@/design/layout";
import { body } from "@/design/typography";
import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";
import { useTheme } from "@/hooks/useTheme";
import { Ref, RefObject, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { Dropdown } from "react-native-element-dropdown";
import { formElementsStyles } from "@/design/form";
import LoadingIndicatorFooter from "./LoadingIndicatorFooter";
import { primaryColors } from "@/design/colors";
import DonwArrow from "assets/icons/DownArrow";
import DownArrow from "assets/icons/DownArrow";
import { DropdownDataItem } from "./DropdownDataItem";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProject } from "@/store/slices/projectSlice";
interface SelectProjectType {
  getProjectsController: any;
  dropdownRef: RefObject<any>;
}

export const SelectProject = ({
  getProjectsController,
  dropdownRef,
}: SelectProjectType) => {
  const { theme } = useTheme();
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [projectsData, setProjectsData] = useState([]);
  const selectedProject = useSelector(
    (state: any) => state.project.selectedProject,
  );
  const dispatch = useDispatch();
  const { getProjects, generalLoading } = useGeneralEndpoints();

  const handleSearchChange = async (text: string) => {
    console.log("Hi handle search change");
    if (text === "" && searchTerm === "") return;
    setSearchTerm(text);
    setPage(1);
    setHasMore(true);
    console.log("From handle search change");
    const res = await getProjects(projectsData, setProjectsData, 1, true, text);
    setHasMore(res?.hasMore!);
  };

  const onEndReachedActivities = async () => {
    if (!generalLoading.getProjects && hasMore) {
      const nextPage = page + 1;
      console.log("From on end reached");
      const res = await getProjects(
        projectsData,
        setProjectsData,
        nextPage,
        hasMore,
        searchTerm,
      );
      console.log("This is next page and has more", nextPage, res?.hasMore);
      setPage(nextPage);
      setHasMore(res?.hasMore);
    }
  };

  return (
    <Dropdown
      iconStyle={{ display: "none" }}
      onFocus={async () => {
        console.log("From on animate");
        const res = await getProjects(
          projectsData,
          setProjectsData,
          1,
          true,
          "",
        );
        setHasMore(res?.hasMore);
      }}
      onBlur={() => {
        console.log("Function run on blur");
      }}
      mode="modal"
      ref={dropdownRef}
      style={{
        ...formElementsStyles.triggerStyle,
        flex: 1,
        backgroundColor: "transparent",
        position: "absolute",
        opacity: 0,
        // display: "none",
      }}
      placeholderStyle={{
        ...formElementsStyles.placeholderStyle,
        backgroundColor: "transparent",
      }} // Placeholder font
      itemContainerStyle={formElementsStyles.dropdownOptionsItemContainerStyle}
      selectedTextStyle={formElementsStyles.valueStyle}
      containerStyle={formElementsStyles.dropdownOptionsContainerStyle}
      showsVerticalScrollIndicator={false}
      autoScroll={false}
      data={projectsData}
      labelField="project_name"
      valueField="id"
      searchField="project_name"
      placeholder={projectsData.length === 0 ? "No Projects" : "Select Project"}
      value={selectedProject?.id}
      activeColor="transparent"
      search
      searchPlaceholder="Search Activity"
      inputSearchStyle={formElementsStyles.dropdownOptionsSearchStyle}
      searchPlaceholderTextColor={formElementsStyles.placeholderColor}
      renderItem={(item, isSelected) => (
        <DropdownDataItem
          itemName={item.project_name}
          isSelected={isSelected}
        />
      )}
      onChange={(item) => {
        dispatch(setSelectedProject(item));
      }}
      flatListProps={{
        onEndReached: onEndReachedActivities,
        ListFooterComponent: generalLoading.getProjects && (
          <LoadingIndicatorFooter size={8} />
        ),
      }}
      renderRightIcon={() =>
        generalLoading.getProjects ? (
          <ActivityIndicator size={8} color={primaryColors.brand[900]} />
        ) : (
          <DownArrow
            width={17}
            height={17}
            stroke={theme.text}
            fill={theme.text}
            strokeWidth={0}
          />
        )
      }
      onChangeText={(text) => handleSearchChange(text)}
    />
  );
};
