import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { Colors, SW, SH } from "../../../utils";
import { getAllCountries } from "rn-international-phone-number";
import { Dropdown } from "react-native-element-dropdown";
import {
  CloseOutlineIcon,
  DownArrowOutlineIcon,
  LocationOutline,
} from "../../../svg";
import { useSelector } from "react-redux";
import apiEndpoint from "../../../config/apiConfig";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useAddProjectEndpoints } from "@/components/common/AddProject/hooks/useAddProjectEndpoints";
import Toast from "react-native-toast-message";
import { useKeyboard } from "@react-native-community/hooks";
import useKeyboardStatus from "../../../hooks/useKeyboardStatus";
import { useGeneralEndpoints } from "../../../hooks/useGeneralEndpoints";
import { setSelectedProject } from "@/store/slices/projectSlice/projectSlice";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { RenderDataForDropdown } from "@/components/UI/GeneralComponents/RenderDataForDropdown";
import { formElementsStyles } from "@/design/form";
import { BottomButton } from "@/components/UI/GeneralComponents/BottomButton";
import {
  closeProjectExtraInfoBottomSheet,
  projectExtraInfoBottomSheetRef,
} from "@/components/common/ProjectInfoBottomSheetService";
import { TranscriptionInput } from "@/components";

function EditProjectExtraDetailsBottomSheet({ onRefresh, clientDetails }) {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      console.log("Run cleanup of add project");
      dispatch(setIsSheetOpen(false));
    };
  }, []);
  const [loading, setLoading] = useState({
    getBrandsForDropdown: false,
    getProjectTypesForDropdown: false,
    getLeadSourcesForDropdown: false,
    editingExtraInfo: false,
  });

  const [description, setDescription] = useState(
    clientDetails?.description || "",
  );

  const [allBrands, setAllBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [allProjectTypes, setAllProjectTypes] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [allSources, setAllSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [budget, setBudget] = useState(clientDetails?.budget || "");
  const keyboard = useKeyboard();
  const isKeyboardVisible = useKeyboardStatus();
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const getBrandsForDropdown = async () => {
    setLoading({ ...loading, getBrandsForDropdown: true });
    try {
      const response = await axios.get(`${apiEndpoint}/core/brands/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("State details", response.data.result);
        setAllBrands([...response.data.result]);
        const initialState =
          response.data.result.find(
            (brand) => brand.id === clientDetails?.fk_brand,
          )?.id || response.data.result[0].id;
        setSelectedBrand(initialState);
      }
    } catch (error) {
      console.error(
        "Error fetching brands:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading({ ...loading, getBrandsForDropdown: false });
    }
  };

  const getProjectTypesForDropdown = async (id) => {
    setLoading({ ...loading, getProjectTypesForDropdown: true });
    try {
      const response = await axios.get(
        `${apiEndpoint}/customers/projecttype/`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        // console.log("City details", response.data.result);
        const initialProjectType =
          response.data.result.find(
            (projectType) => projectType.id === clientDetails?.fk_project_type,
          )?.id || response.data.result[0].id;
        setAllProjectTypes([...response.data.result]);
        setSelectedProjectType(initialProjectType);
      }
    } catch (error) {
      console.error(
        "Error fetching project types:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading({ ...loading, getProjectTypesForDropdown: false });
    }
  };

  const getLeadSourcesForDropdown = async (id) => {
    setLoading({ ...loading, getLeadSourcesForDropdown: true });
    try {
      const response = await axios.get(`${apiEndpoint}/customers/leadsource/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // console.log("City details", response.data.result);
        const initialSource =
          response.data.result.find(
            (source) => source.id === clientDetails?.fk_lead_source,
          )?.id || response.data.result[0].id;
        setAllSources([...response.data.result]);
        setSelectedSource(initialSource);
      }
    } catch (error) {
      console.error(
        "Error fetching lead soruces:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading({ ...loading, getLeadSourcesForDropdown: false });
    }
  };

  const resetEditProjectInfoAddressBottomSheet = () => {
    setLoading({
      getBrandsForDropdown: false,
      getProjectTypesForDropdown: false,
      getLeadSourcesForDropdown: false,
      editingExtraInfo: false,
    });

    setDescription("");
    setBudget("");
    setAllBrands([]);
    setSelectedBrand("");
    setAllProjectTypes([]);
    setSelectedProjectType("");
    setAllSources([]);
    setSelectedSource("");
  };

  const budgetInputRef = useRef(null);

  const editExtraDetails = async () => {
    setLoading((prev) => ({ ...prev, editingExtraInfo: true }));

    const payload = {
      description: description,
      budget: budget,
      fk_brand: selectedBrand,
      fk_lead_source: selectedSource,
      fk_project_type: selectedProjectType,
    };
    console.log("This is the payload of edit address", payload);
    try {
      const response = await axios.put(
        `${apiEndpoint}/customers/project/?project_id=${clientDetails?.id}`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        await onRefresh();
      }
    } catch (error) {
      console.error(
        "Error editing extra details",
        error.response?.data || error.message,
      );
      setLoading((prev) => ({ ...prev, editingExtraInfo: false }));
    } finally {
      setLoading((prev) => ({ ...prev, editingExtraInfo: false }));
    }
  };

  return (
    <>
      <BottomSheetModal
        ref={projectExtraInfoBottomSheetRef}
        snapPoints={isKeyboardVisible ? ["100%"] : ["90%"]}
        enableOverDrag={false}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        enableBlurKeyboardOnGesture={false}
        enableHandlePanningGesture={true}
        enablePanDownToClose={true}
        stackBehavior="push"
        onAnimate={async (fromIndex, toIndex) => {
          if (fromIndex === -1 && toIndex === 0) {
            dispatch(setIsSheetOpen(true));
          }
          if (fromIndex === 0 && toIndex === -1) {
            setTimeout(() => {
              console.log("Set to false from add project");
              dispatch(setIsSheetOpen(false));
            }, [250]);
          }
        }}
        onChange={async (index) => {
          if (index < 0) {
            Keyboard.dismiss();
          }
          if (index > -1) {
            const newBudget = clientDetails?.budget?.toString() || "";

            setBudget(newBudget);
            setDescription(clientDetails?.description);

            budgetInputRef.current?.setNativeProps({
              text: newBudget,
            });

            await Promise.all([
              getBrandsForDropdown(),
              getLeadSourcesForDropdown(),
              getProjectTypesForDropdown(),
            ]);
          }
        }}
        backdropComponent={(props) => {
          return (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0} // backdrop visible when sheet index >= 0
              disappearsOnIndex={-1} // hidden when index = -1
              opacity={0.5} // dim amount
              pressBehavior={"none"}
            />
          );
        }}
        onDismiss={() => {
          resetEditProjectInfoAddressBottomSheet();
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
          <Text style={formElementsStyles.titleStyle}>Edit Extra Details</Text>
          <TouchableOpacity onPress={() => closeProjectExtraInfoBottomSheet()}>
            <CloseOutlineIcon
              fill={Colors.black_text_color}
              width={SW(16)}
              height={SH(16)}
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
          style={{
            flex: 1,
            paddingHorizontal: 20,
            topBorderColor: Colors.gray_line_color,
            topBorderWidth: StyleSheet.hairlineWidth,
          }}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: SH(12),
            paddingBottom:
              isKeyboardVisible && keyboard.keyboardHeight - SH(60),
          }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={{ width: "100%", gap: 16 }}>
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    flex: 1,
                    gap: SH(6),
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>Budget</Text>
                  <TextInput
                    ref={budgetInputRef}
                    placeholder="Enter Budget"
                    keyboardType="numeric"
                    onChangeText={setBudget}
                    defaultValue={budget}
                    style={[
                      formElementsStyles.triggerStyle,
                      formElementsStyles.valueStyle,
                      formElementsStyles.inputContainerStyle,
                      formElementsStyles.bottomSheetInput,
                    ]}
                    placeholderTextColor={formElementsStyles.placeholderColor}
                  />
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  flex: 1,
                  width: "100%",
                  gap: SH(6),
                }}
              >
                <Text style={formElementsStyles.titleStyle}>Brand</Text>
                <Dropdown
                  iconStyle={{ display: "none" }}
                  mode="modal"
                  activeColor="transparent"
                  style={formElementsStyles.triggerStyle}
                  placeholderStyle={formElementsStyles.placeholderStyle} // Placeholder font
                  itemContainerStyle={
                    formElementsStyles.dropdownOptionsItemContainerStyle
                  }
                  selectedTextStyle={formElementsStyles.valueStyle}
                  containerStyle={
                    formElementsStyles.dropdownOptionsContainerStyle
                  }
                  data={allBrands}
                  labelField={!loading.getBrandsForDropdown && "name"}
                  valueField={"id"}
                  searchField="name"
                  placeholder={
                    loading.getBrandsForDropdown
                      ? "Fetching Brands..."
                      : "Select Brand"
                  }
                  value={loading.getBrandsForDropdown ? "" : selectedBrand}
                  search
                  searchPlaceholder="Search Brands"
                  inputSearchStyle={
                    formElementsStyles.dropdownOptionsSearchStyle
                  }
                  searchPlaceholderTextColor={
                    formElementsStyles.placeholderColor
                  }
                  renderItem={(item, isSelected) => (
                    <RenderDataForDropdown
                      itemName={item.name}
                      isSelected={isSelected}
                    />
                  )}
                  autoScroll={false}
                  showsVerticalScrollIndicator={false}
                  onChange={async (item) => {
                    setSelectedBrand(item.id);
                  }}
                  renderRightIcon={() =>
                    loading.getBrandsForDropdown ? (
                      <ActivityIndicator
                        size={12}
                        color={Colors.gray_text_color}
                      />
                    ) : (
                      <DownArrowOutlineIcon width={SH(17)} height={SH(17)} />
                    )
                  }
                />
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: SH(6),
                  flex: 1,
                }}
              >
                <Text style={formElementsStyles.titleStyle}>Project Type</Text>
                <Dropdown
                  iconStyle={{ display: "none" }}
                  mode="modal"
                  activeColor="transparent"
                  style={formElementsStyles.triggerStyle}
                  placeholderStyle={formElementsStyles.placeholderStyle} // Placeholder font
                  itemContainerStyle={
                    formElementsStyles.dropdownOptionsItemContainerStyle
                  }
                  selectedTextStyle={formElementsStyles.valueStyle}
                  containerStyle={
                    formElementsStyles.dropdownOptionsContainerStyle
                  }
                  data={allProjectTypes}
                  labelField={!loading.getProjectTypesForDropdown && "name"}
                  valueField="id"
                  searchField="name"
                  placeholder={
                    loading.getProjectTypesForDropdown
                      ? "Fetching Project Types..."
                      : "Select Project Type"
                  }
                  value={
                    loading.getProjectTypesForDropdown
                      ? ""
                      : selectedProjectType
                  }
                  search
                  showsVerticalScrollIndicator={false}
                  searchPlaceholder="Search Project Types"
                  inputSearchStyle={
                    formElementsStyles.dropdownOptionsSearchStyle
                  }
                  searchPlaceholderTextColor={
                    formElementsStyles.placeholderColor
                  }
                  renderItem={(item, isSelected) => (
                    <RenderDataForDropdown
                      itemName={item.name}
                      isSelected={isSelected}
                    />
                  )}
                  autoScroll={false}
                  onChange={async (item) => {
                    setSelectedProjectType(item.id);
                  }}
                  renderRightIcon={() =>
                    loading.getProjectTypesForDropdown ? (
                      <ActivityIndicator
                        size={12}
                        color={Colors.gray_text_color}
                      />
                    ) : (
                      <DownArrowOutlineIcon width={SH(17)} height={SH(17)} />
                    )
                  }
                />
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: SH(6),
                  flex: 1,
                }}
              >
                <Text style={formElementsStyles.titleStyle}>Lead Source</Text>
                <Dropdown
                  iconStyle={{ display: "none" }}
                  mode="modal"
                  activeColor="transparent"
                  style={formElementsStyles.triggerStyle}
                  placeholderStyle={formElementsStyles.placeholderStyle} // Placeholder font
                  itemContainerStyle={
                    formElementsStyles.dropdownOptionsItemContainerStyle
                  }
                  selectedTextStyle={formElementsStyles.valueStyle}
                  containerStyle={
                    formElementsStyles.dropdownOptionsContainerStyle
                  }
                  data={allSources}
                  labelField={!loading.getLeadSourcesForDropdown && "name"}
                  valueField="id"
                  searchField="name"
                  placeholder={
                    loading.getLeadSourcesForDropdown
                      ? "Fetching Lead Sources..."
                      : "Select Lead Source"
                  }
                  value={
                    loading.getLeadSourcesForDropdown ? "" : selectedSource
                  }
                  search
                  showsVerticalScrollIndicator={false}
                  searchPlaceholder="Search Project Types"
                  inputSearchStyle={
                    formElementsStyles.dropdownOptionsSearchStyle
                  }
                  searchPlaceholderTextColor={
                    formElementsStyles.placeholderColor
                  }
                  renderItem={(item, isSelected) => (
                    <RenderDataForDropdown
                      itemName={item.name}
                      isSelected={isSelected}
                    />
                  )}
                  autoScroll={false}
                  onChange={async (item) => {
                    setSelectedSource(item.id);
                  }}
                  renderRightIcon={() =>
                    loading.getLeadSourcesForDropdown ? (
                      <ActivityIndicator
                        size={12}
                        color={Colors.gray_text_color}
                      />
                    ) : (
                      <DownArrowOutlineIcon width={SH(17)} height={SH(17)} />
                    )
                  }
                />
              </View>
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    flex: 1,
                    gap: SH(6),
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>Description</Text>
                  <TranscriptionInput
                    value={description}
                    usesBottomSheet={false}
                    onChangeText={setDescription}
                    placeholder="Type Here"
                    placeholderTextColor={formElementsStyles.placeholderColor}
                    containerStyle={formElementsStyles.descriptionTriggerStyle}
                    inputContainerStyle={formElementsStyles.inputContainerStyle}
                    inputStyle={formElementsStyles.valueStyle}
                    hasIcon={true}
                    onTranscriptionStart={() => {
                      console.log("Transcription started");
                    }}
                    onTranscriptionEnd={(transcribedText) => {
                      console.log("Transcription completed:", transcribedText);
                      // You can show a toast here if needed
                    }}
                    onTranscriptionError={(error) => {
                      console.error("Transcription error:", error);
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BottomSheetScrollView>
        <View
          style={{
            ...formElementsStyles.bottomButtonContainer,
            // display: isHidden && "none",
          }}
        >
          <BottomButton
            title={"Change Details"}
            onPress={async () => {
              await editExtraDetails();
            }}
            type={"default"}
            disabled={loading.editingExtraInfo}
            icon={
              loading.editingExtraInfo && (
                <ActivityIndicator size={10} color="white" />
              )
            }
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
export default React.memo(EditProjectExtraDetailsBottomSheet);
