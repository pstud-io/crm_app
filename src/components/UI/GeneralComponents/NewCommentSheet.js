import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  NativeModules,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  SendOutlineIcon,
  CloseOutlineIcon,
  AttachOutlineIcon,
} from "../../../svg";
import { useCallback, useState } from "react";
import { Colors, SH, SW } from "../../../utils";
import { useKeyboard } from "@react-native-community/hooks";
import {
  newCommentBottomSheetRef,
  closeNewCommentBottomSheet,
} from "../../common/NewCommentBottomSheetService";
import { Spacing, TranscriptionInput } from "../..";
import { TranscriptionInput } from "@/components/specific";
import { BottomButton } from "./BottomButton";
import { primaryColors } from "../DesignSystem/colorPalette";
import { formElementsStyles } from "../Dropdown/formElementStyles";
import { useCameraScreen } from "../../../hooks/useCameraScreen";
import { usePostComment } from "../../../hooks/usePostComment";
import { body } from "../DesignSystem/typography";
import { RenderMedia } from "./RenderMedia";
import { ItemSeparatorComponent } from "./ItemSeperatorComponent";
import useKeyboardStatus from "../../../hooks/useKeyboardStatus";

export const NewCommentSheet = ({
  fk_project,
  commentPostURL,
  onPost,
  project_asset_group_id = null,
  project_asset_id = null,
}) => {
  const [comment, setComment] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [loading, setLoading] = useState({
    postComment: false,
  });

  const { handleSelectMedia, handleDeleteMedia } = useCameraScreen({
    setSelectedMedia,
  });

  const { postComment } = usePostComment({
    loading,
    setLoading,
    commentPostURL,
    comment,
    selectedMedia,
    fk_project,
    mentions,
    onPost,
    project_asset_group_id,
    project_asset_id,
  });

  const resetNewCommentBottomSheet = useCallback(() => {
    setLoading({
      ...loading,
      postComment: false,
    });
    setComment("");
    setSelectedMedia([]);
    setMentions([]);
  });

  const isKeyboardVisible = useKeyboardStatus();
  const keyboard = useKeyboard();
  const snapPoint = isKeyboardVisible ? "100%" : "65%";

  return (
    <BottomSheetModal
      snapPoints={[snapPoint]}
      ref={newCommentBottomSheetRef}
      enableDynamicSizing={false}
      enableOverDrag={false}
      enablePanDownToClose={true}
      detached={false}
      enableContentPanningGesture={false}
      enableBlurKeyboardOnGesture={false}
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
      onDismiss={() => resetNewCommentBottomSheet()}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: SW(16),
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopWidth: 0,
        }}
      >
        <Text
          style={{
            ...body.md.medium,
            color: primaryColors.gray[900],
          }}
        >
          New Message
        </Text>
        <TouchableOpacity
          onPress={() => {
            setComment("");
            closeNewCommentBottomSheet();
          }}
        >
          <CloseOutlineIcon
            fill={Colors.black_text_color}
            width={SW(16)}
            height={SH(16)}
          />
        </TouchableOpacity>
      </View>
      <ItemSeparatorComponent
        direction={"horizontal"}
        style={{ marginVertical: SH(16) }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            paddingHorizontal: SW(16),
            topBorderColor: Colors.gray_line_color,
            topBorderWidth: StyleSheet.hairlineWidth,
            overflow: "visible",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: SH(12),
            width: "100%",
            flexGrow: 1,
            position: "relative",
            paddingBottom:
              isKeyboardVisible && keyboard.keyboardHeight - SH(60),
          }}
        >
          <TranscriptionInput
            value={comment}
            mentions={mentions}
            usesBottomSheet={true}
            onChangeText={setComment}
            onMentionsChange={(mentionsList) => setMentions(mentionsList)} // <- Add this
            placeholder="Type Here"
            projectId={fk_project}
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
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  handleSelectMedia();
                  Keyboard.dismiss();
                }}
              >
                <AttachOutlineIcon
                  width={SW(24)}
                  height={SH(24)}
                  stroke={primaryColors.brand[1000]}
                  strokeWidth={0}
                  color={primaryColors.brand[1000]}
                />
              </TouchableOpacity>
            }
          />
          <Text style={formElementsStyles.titleStyle}>Attached Files</Text>
          {selectedMedia.length === 0 && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: SW(1),
                borderColor: primaryColors.gray[200],
                borderRadius: SW(8),
                height: SH(60),
                width: "100%",
              }}
            >
              <Text
                style={{ ...body.sm.regular, color: primaryColors.gray[900] }}
              >
                No Images attached yet
              </Text>
            </View>
          )}
          <RenderMedia
            selectedMedia={selectedMedia}
            handleDeleteMedia={handleDeleteMedia}
            imageSize={SH(88)}
            hasDelete={true}
            style={{ flexGrow: 0 }}
          />

          <Spacing space={SH(6)} />
        </View>
      </TouchableWithoutFeedback>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"Cancel"}
          onPress={() => {
            setComment("");
            closeNewCommentBottomSheet();
          }}
          type={"outlined"}
        />
        <BottomButton
          title={loading.postComment ? "Sending Message" : "Send Message"}
          onPress={() => postComment()}
          type={"default"}
          disabled={loading.postComment}
          icon={
            loading.postComment ? (
              <ActivityIndicator size={12} color={primaryColors.gray[25]} />
            ) : (
              <SendOutlineIcon
                width={12}
                height={12}
                color={primaryColors.gray[25]}
              />
            )
          }
        />
      </View>
    </BottomSheetModal>
  );
};
