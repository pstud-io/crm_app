import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useState, useEffect } from "react";
import { Colors, SW, SH } from "../../../utils";
import { ArrowRight, CloseOutlineIcon, SendOutlineIcon } from "../../../svg";

import { body } from "../../../components/UI/DesignSystem/typography";
import { primaryColors } from "../../../components/UI/DesignSystem/colorPalette";
import { formElementsStyles } from "../../../components/UI/Dropdown/formElementStyles";
import { Spacing } from "../../../components";
import { BottomButton } from "../../../components/UI/GeneralComponents/BottomButton";
import { CommentCard } from "./CommentCard";
// import { useDispatch, useSelector } from "react-redux";
import { setActiveMedia } from "../../../store/slices/activeMediaSlice";
import { setActiveMediaPinCommentsData } from "../../../store/slices/activeMediaPinCommentsData";
import { setActivePinComments } from "../../../store/slices/activePinComments";
import { openNewPinCommentBottomSheet } from "../../common/NewPinCommentBottomSheetService";

const ViewPinCommentSheet = ({
  viewPinCommentBottomSheetRef,
  newPinCommentBottomSheetRef,
  urlRefForMedia,
  item,
  activeChain,
  setShowActionButtonsVCS,
}) => {
  const snapPoints = "90%";

  const closeViewPinCommentBottomSheet = async (
    viewPinCommentBottomSheetRef,
  ) => {
    await viewPinCommentBottomSheetRef.current?.close();
    Keyboard.dismiss();
  };

  return (
    <BottomSheet
      snapPoints={[snapPoints]}
      ref={viewPinCommentBottomSheetRef}
      enableDynamicSizing={false}
      enableOverDrag={false}
      enablePanDownToClose={true}
      detached={false}
      index={-1}
      onClose={() => {
        setShowActionButtonsVCS(true);
      }}
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
        <Text
          style={{
            color: primaryColors.gray[900],
            ...body.sm.semiBold,
          }}
        >
          Pin Comments
        </Text>
        <TouchableOpacity
          onPress={async () =>
            await closeViewPinCommentBottomSheet(viewPinCommentBottomSheetRef)
          }
        >
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
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <FlatList
          data={activeChain?.pin_comment_details}
          keyExtractor={(item) => item.id}
          horizontal={false}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          renderItem={({ item, index }) => {
            return <CommentCard commentData={item} key={index} />;
          }}
        />
        <Spacing space={SH(16)} />
      </BottomSheetScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"Close"}
          onPress={async () =>
            await closeViewPinCommentBottomSheet(viewPinCommentBottomSheetRef)
          }
          type={"outlined"}
        />
        <BottomButton
          title={"New Message"}
          onPress={async () => {
            console.log("Pressed New Message");
            await openNewPinCommentBottomSheet(
              {
                context_id: item.id,
                pin_comment_chain_id: activeChain.id,
                pin: null,
              },
              newPinCommentBottomSheetRef,
              urlRefForMedia,
            );
          }}
          type={"default"}
        />
      </View>
    </BottomSheet>
  );
};
export default ViewPinCommentSheet;
