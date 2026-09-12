import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useState, useEffect } from "react";
import { Colors, SW, SH } from "../../../utils";
import { ArrowRight, CloseOutlineIcon, UploadCloudOutline } from "../../../svg";
import {
  projectDocumentsBottomSheetRef,
  closeProjectDocumentsBottomSheet,
} from "@/components/common/ProjectInfoBottomSheetService";
import { body } from "../../../components/UI/DesignSystem/typography";
import { primaryColors } from "../../../components/UI/DesignSystem/colorPalette";
import { formElementsStyles } from "../../../components/UI/Dropdown/formElementStyles";
import { Spacing } from "../../../components";
import { BottomButton } from "../../../components/UI/GeneralComponents/BottomButton";
import { Input } from "react-native-elements";
import { useCameraScreen } from "../../../hooks/useCameraScreen";
import { RenderMedia } from "../../../components/UI/GeneralComponents/RenderMedia";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";
import axios from "axios";
import apiEndpoint from "@/config/apiConfig";

const EditProjectDocumentsBottomSheet = ({ onRefresh, clientDetails }) => {
  const snapPoints = "70%";
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const dispatch = useDispatch();
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [loading, setLoading] = useState({
    addingProjectDocuments: false,
  });
  const { uploadMedia } = useGeneralEndpoints();
  const { handleSelectMedia, handleDeleteMedia } = useCameraScreen({
    setSelectedMedia,
  });

  const resetAddFilesBottomSheet = () => {
    console.log("In reset new add files bottom sheet");
    setSelectedMedia([]);
    setLoading({
      addingProjectDocuments: false,
    });
  };

  const handleEditProjectDocuments = async () => {
    setLoading((prev) => ({ ...prev, addingProjectDocuments: true }));

    try {
      const assetResponse = await uploadMedia(selectedMedia, clientDetails?.id);
      for (const asset of assetResponse.data.result) {
        const payload = {
          fk_asset: asset.id,
          fk_project: clientDetails?.id,
        };
        await axios.post(
          `${apiEndpoint}/customers/projectdocuments/`,
          payload,
          {
            headers: {
              Authorization: `token ${token}`,
              "X-OrganizationID": organization_id,
              "Content-Type": "application/json",
            },
          },
        );
      }
      await onRefresh();
    } catch (error) {
      console.error(
        "Error editing extra details",
        error.response?.data || error.message,
      );
      setLoading((prev) => ({ ...prev, addingProjectDocuments: false }));
    } finally {
      setLoading((prev) => ({ ...prev, addingProjectDocuments: false }));
    }
  };

  return (
    <BottomSheetModal
      ref={projectDocumentsBottomSheetRef}
      snapPoints={[snapPoints]}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      enableDynamicSizing={false}
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
      onDismiss={() => resetAddFilesBottomSheet()}
      onAnimate={(fromIndex, toIndex) => {
        if (fromIndex === -1 && toIndex === 0) {
          handleSelectMedia();
        }
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
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: 20,
          paddingTop: 12,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: primaryColors.gray[900],
            ...body.md.medium,
          }}
        >
          Adding More Files
        </Text>
        <TouchableOpacity onPress={() => closeProjectDocumentsBottomSheet()}>
          <CloseOutlineIcon
            fill={Colors.black_text_color}
            width={SW(16)}
            height={SH(16)}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginVertical: 16,
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
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Text style={formElementsStyles.titleStyle}>Attach Files *</Text>
        <Spacing space={SH(8)} />
        <TouchableOpacity
          style={formElementsStyles.attachFilesTriggerStyle}
          onPress={handleSelectMedia}
        >
          <UploadCloudOutline
            width={SW(24)}
            height={SH(24)}
            stroke={primaryColors.button.active}
            strokeWidth={SW(2)}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: SW(6),
            }}
          >
            <Text style={formElementsStyles.attachFilesPlaceholderStyle1}>
              Click here
            </Text>
            <Text style={formElementsStyles.attachFilesPlaceholderStyle2}>
              to upload
            </Text>
          </View>
        </TouchableOpacity>
        <Spacing space={SH(16)} />
        <RenderMedia
          selectedMedia={selectedMedia}
          imageSize={SW(80)}
          handleDeleteMedia={handleDeleteMedia}
        />
        <Spacing space={SH(16)} />
      </BottomSheetScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"Cancel"}
          onPress={() => closeProjectDocumentsBottomSheet()}
          type={"outlined"}
        />
        <BottomButton
          icon={
            loading.addingProjectDocuments && (
              <ActivityIndicator size={12} color={Colors.white} />
            )
          }
          disabled={loading.addingProjectDocuments}
          title={"Add Files"}
          onPress={async () => {
            await handleEditProjectDocuments();
          }}
          type={loading.addingProjectDocuments ? "disabled" : "default"}
        />
      </View>
    </BottomSheetModal>
  );
};
export default EditProjectDocumentsBottomSheet;
