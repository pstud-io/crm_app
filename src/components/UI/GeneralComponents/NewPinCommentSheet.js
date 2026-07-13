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
import { Spacing, TranscriptionInput } from "../..";
import { BottomButton } from "./BottomButton";
import { primaryColors } from "../DesignSystem/colorPalette";
import { formElementsStyles } from "../Dropdown/formElementStyles";
import { useCameraScreen } from "../../../hooks/useCameraScreen";
import { body } from "../DesignSystem/typography";
import { RenderMedia } from "./RenderMedia";
import { ItemSeparatorComponent } from "./ItemSeperatorComponent";
import useKeyboardStatus from "../../../hooks/useKeyboardStatus";
import { closeNewPinCommentBottomSheet } from "../../common/NewPinCommentBottomSheetService";
import { useCreatePinComment } from "../../../hooks/useCreatePinComment";
import apiEndpoint from "../../../config/apiConfig";
import { usePinCommentEndpoints } from "../../../hooks/usePinCommentEndpoints";
export const NewPinCommentSheet = ({
  fk_project,
  onPost,
  newPinCommentBottomSheetRef,
  urlRefForMedia,
  setShowActionButtonsNCS,
}) => {
  const [comment, setComment] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [loading, setLoading] = useState({
    postComment: false,
    creatingPinComment: false,
  });

  const { handleSelectMedia, handleDeleteMedia } = useCameraScreen({
    setSelectedMedia,
  });

  const { postPinComment } = usePinCommentEndpoints();

  const { createPinComment } = useCreatePinComment();

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
      ref={newPinCommentBottomSheetRef}
      enableDynamicSizing={false}
      enableOverDrag={false}
      enablePanDownToClose={true}
      detached={false}
      onChange={(index) => {
        console.log("The image ref for pin comment is", urlRefForMedia.current);
      }}
      enableContentPanningGesture={false}
      enableBlurKeyboardOnGesture={false}
      enableHandlePanningGesture={true}
      stackBehavior="push"
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
      onDismiss={() => {
        setShowActionButtonsNCS(true);
        resetNewCommentBottomSheet();
      }}
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
          onPress={async () => {
            setComment("");
            await closeNewPinCommentBottomSheet(
              newPinCommentBottomSheetRef,
              urlRefForMedia,
            );
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
              // <TouchableOpacity>
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
          onPress={async () => {
            setComment("");
            await closeNewPinCommentBottomSheet(
              newPinCommentBottomSheetRef,
              urlRefForMedia,
            );
          }}
          type={"outlined"}
        />
        <BottomButton
          title={
            loading.postComment || loading.creatingPinComment
              ? "Sending Message"
              : "Send Message"
          }
          onPress={async () => {
            console.log("Sending message");
            if (!urlRefForMedia.current.pin_comment_chain_id) {
              const pinCommentData = await createPinComment(
                urlRefForMedia.current.context_id,
                "project_board_item",
                null,
                urlRefForMedia.current.pin.x,
                urlRefForMedia.current.pin.y,
                setLoading,
              );
              console.log(
                "This is the create pin comment data",
                pinCommentData,
              );
              const commentPostUrl = `${apiEndpoint}/moodboards/pin-comment/?pin_comment_chain_id=${pinCommentData.id}`;
              await postPinComment(
                setLoading,
                comment,
                selectedMedia,
                fk_project,
                mentions,
                onPost,
                commentPostUrl,
                newPinCommentBottomSheetRef,
                urlRefForMedia,
              );
            } else {
              const commentPostUrl = `${apiEndpoint}/moodboards/pin-comment/?pin_comment_chain_id=${urlRefForMedia.current.pin_comment_chain_id}`;
              await postPinComment(
                setLoading,
                comment,
                selectedMedia,
                fk_project,
                mentions,
                onPost,
                commentPostUrl,
                newPinCommentBottomSheetRef,
                urlRefForMedia,
              );
              console.log("Before closing");
            }
          }}
          type={"default"}
          disabled={loading.postComment || loading.creatingPinComment}
          icon={
            loading.postComment || loading.creatingPinComment ? (
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
