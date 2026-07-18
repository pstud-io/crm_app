import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { forwardRef, useState, useRef, useEffect, useCallback } from "react";
import { Colors, SF, SW, SH, formatDate } from "../../utils";
import { InputTextStyles } from "../../styles/InputTextStyles";
import { ArrowRight, CloseOutlineIcon } from "../../svg";
import { useSelector } from "react-redux";
import { primaryColors } from "../UI/DesignSystem/colorPalette";
import { ProjectInfoCardItem } from "./ProjectInfoCardItem";
import { Dropdown } from "react-native-element-dropdown";
import { DownArrowOutlineIcon } from "../../svg";
import { useGeneralEndpoints } from "../../hooks/useGeneralEndpoints";
import { RenderDataForDropdown } from "../UI/GeneralComponents/RenderDataForDropdown";
import { formElementsStyles } from "../UI/Dropdown/formElementStyles";
import { ItemSeparatorComponent } from "../UI/GeneralComponents/ItemSeperatorComponent";
import { body } from "../UI/DesignSystem/typography";
import CallWhatsappPopover from "../specific/CallWhatsappPopover";
import { LoadingIndicatorFooter } from "../UI/GeneralComponents";
import { useFocusEffect } from "@react-navigation/native";
import TimelineDot from "@/screens/tasks/components/TimelineDot";
import { getTaskHistoryStageColor } from "@/screens/tasks/utils/taskFunctions";
import { useTheme } from "@/hooks/useTheme";
const ProjectHistory = ({ route }) => {
  const { project } = route.params;
  const { theme } = useTheme();
  console.log("Add instance of project info", project);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState({
    getStagesForDropdown: false,
    getClientDetails: false,
    updatingStage: false,
  });
  const [allProjectStages, setAllProjectStages] = useState([]);
  const [projectStage, setProjectStage] = useState("");
  const [clientDetails, setClientDetails] = useState(null);
  const stageDropdownRef = useRef(null);

  const organization_id = useSelector((state) => state.profile.organization_id);
  const profile = useSelector((state) => state.profile);
  const permissions = useSelector(
    (state) => state.permissions.categorizedPermissions,
  );

  const canChange =
    profile.is_admin ||
    permissions.customer.includes("customer.can_edit_project_stage");

  const { getStagesForDropdown, getClientDetails, updateStage } =
    useGeneralEndpoints();

  const hasLoadedForProject = useRef(null);

  const fetchData = async (index) => {
    if (index < 0) {
      Keyboard.dismiss();
      return;
    }

    // Replace selectedProject?.id with whatever uniquely identifies your project
    const projectId = project?.id;

    if (hasLoadedForProject.current === projectId) {
      return;
    }

    hasLoadedForProject.current = projectId;

    setInitialLoading(true);
    setAllProjectStages([]);
    setProjectStage("");
    setClientDetails([]);

    try {
      await Promise.all([
        getStagesForDropdown(setLoading, setAllProjectStages),
        getClientDetails(
          setLoading,
          setClientDetails,
          setProjectStage,
          project,
        ),
      ]);
    } catch (e) {
      console.log("Lead info error", e);
    } finally {
      setInitialLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setInitialLoading(true);
        await fetchData();
        setInitialLoading(false);
      };

      loadData();
    }, [project]),
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.sheetContent}
      contentContainerStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingVertical: 16,
      }}
    >
      {initialLoading || !clientDetails ? (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            borderWidth: 0,
            flex: 1,
          }}
        >
          <LoadingIndicatorFooter />
        </View>
      ) : (
        <>
          {clientDetails?.stage_history?.length > 0 ? (
            clientDetails?.stage_history?.map((h, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  gap: 12,
                }}
              >
                <TimelineDot
                  color={primaryColors.gray[25]}
                  borderColor={primaryColors.gray[300]}
                  circleShadow={false}
                  width={16}
                  height={16}
                />
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    borderColor: Colors.gray_line_color,
                    // borderWidth: StyleSheet.hairlineWidth,
                    borderRadius: 16,
                    padding: 12,
                    flex: 1,
                    gap: 12,
                    marginVertical: 6,
                    backgroundColor: "white",
                    boxShadow: theme.shadow.sm,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      width: "100%",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        ...body.sm.medium,
                        color: primaryColors.gray[900],
                        backgroundColor: primaryColors.gray[100],
                        paddingHorizontal: SH(12),
                        paddingVertical: SH(6),
                        borderRadius: 16,
                        overflow: "hidden",
                      }}
                    >
                      {h?.old_stage_info?.name}
                    </Text>
                    <ArrowRight
                      stroke={Colors.black_text_color}
                      strokeWidth={0.1}
                      fill={Colors.black_text_color}
                      width={12}
                      height={12}
                    />
                    <Text
                      style={{
                        ...body.sm.medium,
                        color: primaryColors.gray[900],
                        backgroundColor: primaryColors.gray[100],
                        paddingHorizontal: SH(12),
                        paddingVertical: SH(6),
                        borderRadius: 16,
                        overflow: "hidden",
                      }}
                    >
                      {h?.new_stage_info?.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "100%",
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 8,
                      }}
                    >
                      <Text
                        style={{
                          ...body.xs.medium,
                          color: Colors.gray_text_color,
                          marginBottom: SH(2),
                          paddingLeft: SH(6),
                          height: "100%",
                        }}
                      >
                        By {h?.changed_by_info?.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "Inter-Medium",
                        fontSize: SF(8),
                        color: Colors.gray_text_color,
                        marginHorizontal: SH(2),
                      }}
                    >
                      ●
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 8,
                      }}
                    >
                      <Text
                        style={{
                          ...body.xs.medium,
                          color: Colors.gray_text_color,
                          marginBottom: SH(2),
                          height: "100%",
                        }}
                      >
                        On {formatDate(h.changed_at)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No history available</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};
export default ProjectHistory;

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    topBorderColor: Colors.gray_line_color,
    topBorderWidth: StyleSheet.hairlineWidth,
  },
  container: { width: "100%", borderWidth: 0 },
  dropdown: {
    height: 50,
    maxWidth: SW(150),
    ...InputTextStyles.input,
  },
  placeholderStyle: {
    ...body.xs.regular,
    backgroundColor: Colors.theme_background,
    color: Colors.gray_text_color,
  },
  selectedTextStyle: {
    ...body.xs.regular,
    color: Colors.gray_text_color,
    backgroundColor: Colors.theme_background,
  },
  selectedStyle: {
    backgroundColor: "transparent",
    borderRadius: 16,
    overflow: "hidden",
  },
  containerStyle: {
    borderRadius: 16,
    backgroundColor: Colors.theme_background,
    borderWidth: 0,
  },
  item: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingVertical: SH(10),
    paddingHorizontal: SW(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray_line_color,
    backgroundColor: Colors.theme_background,
  },
  searchStyle: {
    borderRadius: 10,
    borderColor: Colors.primary,
    height: 40,
    ...body.xs.regular,
    color: Colors.gray_text_color,
  },
});
