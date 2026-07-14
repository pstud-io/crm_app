import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { forwardRef, useState, useRef, useEffect } from "react";
import { Colors, SF, SW, SH } from "../../utils";
import { InputTextStyles } from "../../styles/InputTextStyles";
import { CloseOutlineIcon } from "../../svg";
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

const ProjectInfo = forwardRef((props, ref) => {
  const projectInfoBottomSheetRef = props.projectInfoBottomSheetRef;
  const closeProjectInfoBottomSheet = props.closeProjectInfoBottomSheet;
  console.log("Add instance of project info");
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

  const project = useSelector((state) => state.project.selectedProject);
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

  return (
    <>
      <BottomSheet
        ref={projectInfoBottomSheetRef}
        index={-1} // hidden by default
        snapPoints={["75%"]}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
        backdropComponent={(props) => {
          return (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0} // backdrop visible when sheet index >= 0
              disappearsOnIndex={-1} // hidden when index = -1
              opacity={0.5} // dim amount
            />
          );
        }}
        onClose={() => {}}
        onChange={async (index) => {
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
              getClientDetails(setLoading, setClientDetails, setProjectStage),
            ]);
          } finally {
            setInitialLoading(false);
          }
        }}
      >
        <View
          style={{
            width: "100%",
            paddingHorizontal: SW(20),
            paddingTop: SH(12),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={formElementsStyles.titleStyle}>Details</Text>
          <TouchableOpacity onPress={() => closeProjectInfoBottomSheet()}>
            <CloseOutlineIcon
              fill={Colors.black_text_color}
              width={12}
              height={12}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginVertical: SH(16),
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: Colors.gray_line_color,
          }}
        />
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          style={styles.sheetContent}
          contentContainerStyle={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: SH(16),
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
              <Text style={formElementsStyles.titleStyle}>Project Details</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  borderRadius: SW(8),
                  borderWidth: 1,
                  borderColor: primaryColors.gray[200],
                  padding: 12,
                  gap: SH(14),
                  width: "100%",
                }}
              >
                <ProjectInfoCardItem
                  label={"Project Name"}
                  value={clientDetails.project_name}
                  color={primaryColors.brand[1000]}
                  size={SF(16)}
                />
                <View
                  style={{
                    borderTopWidth: SW(1),
                    borderTopColor: primaryColors.gray[200],
                    width: "100%",
                  }}
                />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>
                    Project Stage
                  </Text>
                  <Dropdown
                    disable={!canChange}
                    ref={stageDropdownRef}
                    mode="modal"
                    style={[
                      formElementsStyles.triggerStyle,
                      { maxWidth: SW(180) },
                    ]}
                    placeholderStyle={formElementsStyles.placeholderStyle} // Placeholder font
                    itemContainerStyle={
                      formElementsStyles.dropdownOptionsItemContainerStyle
                    }
                    selectedTextStyle={formElementsStyles.valueStyle}
                    searchPlaceholderTextColor={
                      formElementsStyles.placeholderColor
                    }
                    containerStyle={
                      formElementsStyles.dropdownOptionsContainerStyle
                    }
                    showsVerticalScrollIndicator={false}
                    autoScroll={false}
                    activeColor="transparent"
                    inputSearchStyle={
                      formElementsStyles.dropdownOptionsSearchStyle
                    }
                    data={allProjectStages}
                    labelField={!loading.getStagesForDropdown && "name"}
                    valueField={"id"}
                    searchField="name"
                    placeholder={
                      loading.getStagesForDropdown
                        ? "Fetching States..."
                        : loading.updatingStage
                          ? "Updating Stage"
                          : "Update Stage"
                    }
                    value={
                      loading.getStagesForDropdown || loading.updatingStage
                        ? ""
                        : projectStage
                    }
                    search
                    iconStyle={{ display: "none" }}
                    searchPlaceholder="Search Stage"
                    renderItem={(item, isSelected) => (
                      <RenderDataForDropdown
                        itemName={item.name}
                        isSelected={isSelected}
                      />
                    )}
                    onChange={async (item) => {
                      await updateStage(setLoading, item);
                      setProjectStage(item.id);
                    }}
                    confirmSelectItem={
                      organization_id === "13148b25-307b-4e2b-a6f4-767498e45756"
                    }
                    onConfirmSelectItem={(item) => {
                      Alert.alert("Confirm", `Changing Stage to ${item.name}`, [
                        {
                          text: "Cancel",
                          onPress: () => stageDropdownRef.current.close(),
                        },
                        {
                          text: "Confirm",
                          onPress: async () => {
                            console.log("Clicked confirm");
                            await stageDropdownRef.current.close();
                            await updateStage(setLoading, item);
                            setProjectStage(item.id);
                          },
                        },
                      ]);
                    }}
                    renderRightIcon={() => {
                      return (
                        canChange &&
                        (loading.getStagesForDropdown ||
                        loading.updatingStage ? (
                          <ActivityIndicator
                            size={12}
                            color={Colors.gray_text_color}
                          />
                        ) : (
                          <DownArrowOutlineIcon
                            width={SH(17)}
                            height={SH(17)}
                          />
                        ))
                      );
                    }}
                  />
                </View>
              </View>
              <Text style={formElementsStyles.titleStyle}>Client Details</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  borderRadius: SW(8),
                  borderWidth: 1,
                  borderColor: primaryColors.gray[200],
                  padding: 12,
                  gap: SH(14),
                  width: "100%",
                }}
              >
                <ProjectInfoCardItem
                  label={"Client Name"}
                  value={
                    clientDetails?.client_details?.contact_details?.name || "NA"
                  }
                />
                <View
                  style={{
                    borderTopWidth: SW(1),
                    borderTopColor: primaryColors.gray[200],
                    width: "100%",
                  }}
                />
                <CallWhatsappPopover
                  value={
                    clientDetails?.client_details?.contact_details?.phone ||
                    "NA"
                  }
                  code={
                    clientDetails?.client_details?.contact_details
                      ?.country_code || "NA"
                  }
                />
                <View
                  style={{
                    borderTopWidth: SW(1),
                    borderTopColor: primaryColors.gray[200],
                    width: "100%",
                  }}
                />
                <ProjectInfoCardItem
                  label={"Email"}
                  value={
                    clientDetails?.client_details?.contact_details?.email ||
                    "NA"
                  }
                />
                <View
                  style={{
                    borderTopWidth: SW(1),
                    borderTopColor: primaryColors.gray[200],
                    width: "100%",
                  }}
                />
                <ProjectInfoCardItem
                  label={"Address"}
                  value={
                    clientDetails?.address_details?.address_line_1 +
                      " " +
                      clientDetails?.address_details?.address_line_2 || "NA"
                  }
                />
                <View
                  style={{
                    borderTopWidth: SW(1),
                    borderTopColor: primaryColors.gray[200],
                    width: "100%",
                  }}
                />
                <ProjectInfoCardItem
                  label={"City"}
                  value={clientDetails?.address_details?.city || "NA"}
                />
                <View
                  style={{
                    borderTopWidth: SW(1),
                    borderTopColor: primaryColors.gray[200],
                    width: "100%",
                  }}
                />
                <ProjectInfoCardItem
                  label={"State"}
                  value={clientDetails?.address_details?.state || "NA"}
                />
                <View
                  style={{
                    borderTopWidth: SW(1),
                    borderTopColor: primaryColors.gray[200],
                    width: "100%",
                  }}
                />
                <ProjectInfoCardItem
                  label={"PIN Code"}
                  value={clientDetails?.address_details?.pincode || "NA"}
                />
                <View
                  style={{
                    borderTopWidth: SW(1),
                    borderTopColor: primaryColors.gray[200],
                    width: "100%",
                  }}
                />
                <ProjectInfoCardItem
                  label={"Location"}
                  value={clientDetails?.address_details?.location || "NA"}
                  location={true}
                />
              </View>
              <ItemSeparatorComponent
                direction={"horizontal"}
                style={{ opacity: 0 }}
              />
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
});
export default ProjectInfo;

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
