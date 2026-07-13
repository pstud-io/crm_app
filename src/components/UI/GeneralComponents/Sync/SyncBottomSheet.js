import { useState } from "react";
import useKeyboardStatus from "../../../../hooks/useKeyboardStatus";
import { useKeyboard } from "@react-native-community/hooks";
import {
  closeSyncBottomSheet,
  syncBottomSheetRef,
} from "../../../../utils/sync/syncBottomSheetService";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Colors, SH, SW } from "../../../../utils";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { body } from "../../DesignSystem/typography";
import { TouchableOpacity } from "react-native";
import { CloseOutlineIcon } from "../../../../svg";

const SyncBottomSheet = ({ onRefresh }) => {
  const [syncData, setSyncData] = useState(null);
  const [loading, setLoading] = useState({
    getSyncData: false,
    syncingData: false,
  });
  const isKeyboardVisible = useKeyboardStatus();
  const keyboard = useKeyboard();
  const snapPoints = isKeyboardVisible ? "100%" : "95%";

  const resetSyncBottomSheet = () => {
    console.log("In reset new Folder bottom sheet");
    setSyncData(null);
    setLoading({
      syncingData: false,
      getSyncData: false,
    });
  };

  return (
    <BottomSheetModal
      ref={syncBottomSheetRef}
      snapPoints={[snapPoints]}
      enablePanDownToClose={true}
      enableBlurKeyboardOnGesture={false}
      enableContentPanningGesture={false}
      enableOverDrag={false}
      enableHandlePanningGesture={true}
      enableDynamicSizing={false}
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
      onDismiss={() => resetSyncBottomSheet()}
      onAnimate={async (fromIndex, toIndex) => {
        if (fromIndex === -1 && toIndex === 0) {
          //   await getSyncData(
          //     setLoading,
          //     checkpointRef?.current.id,
          //     setCheckpoint,
          //   );
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
        <Text
          style={{
            color: primaryColors.gray[900],
            ...body.md.semiBold,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Sync Data
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.log("Pressed close stage update");
            closeSyncBottomSheet();
          }}
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
          marginVertical: SH(16),
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.gray_line_color,
        }}
      />
      <BottomSheetScrollView
        style={{
          flex: 1,
          paddingHorizontal: SW(20),
          topBorderColor: Colors.gray_line_color,
          topBorderWidth: StyleSheet.hairlineWidth,
        }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingBottom: isKeyboardVisible && keyboard.keyboardHeight - SH(60),
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <>
            {syncData.length === 0 && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{ ...body.sm.medium, color: primaryColors.gray[600] }}
                >
                  No data to sync
                </Text>
              </View>
            )}
            {syncData.length === 0 && loading.getSyncData ? (
              <LoadingIndicatorFooter width={"100%"} />
            ) : (
              syncData.map((item, index) => {
                return (
                  <View
                    key={item.id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      marginBottom: SH(16),
                      width: "100%",
                    }}
                  >
                    {/* <RenderTaskItem
                      item={item}
                      onRefresh={async () => {
                        await Promise.all([
                          onRefresh(),
                          getSyncData(setLoading, checkpoint.id, setCheckpoint),
                        ]);
                      }}
                      navigation={navigation}
                      hasActionButtons={true}
                      fromOverview={true}
                    /> */}
                  </View>
                );
              })
            )}
          </>
        </TouchableWithoutFeedback>
      </BottomSheetScrollView>
      {/* <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"Cancel"}
          onPress={() => closeProgressUpdateBottomSheet()}
          type={"outlined"}
        />
        <BottomButton
          icon={
            loading.syncingData && (
              <ActivityIndicator size={12} color={Colors.white} />
            )
          }
          disabled={loading.syncingData}
          title={"Update Checkpoint"}
          onPress={async () => {
            console.log("Hit update checkpoint");
            await handleEditCheckpoint(
              setLoading,
              {
                checkpoints: [
                  {
                    // ...checkpoint,
                    // fk_stage: stage,

                    // assignee: checkpoint?.assignee,
                    id: checkpoint?.id,
                    // due_date: checkpoint?.due_date,
                    // action_type: checkpoint?.action_type,
                    fk_stage: stage,
                    // progress: checkpoint?.progress,
                    // sort_index: checkpoint?.sort_index,
                    // status: checkpoint?.status,
                    // title: checkpoint?.title,
                  },
                ],
                due_date: checklist?.due_date,
                fk_project: checklist?.fk_project,
                title: checklist?.title,
              },
              checkpoint,
              onRefresh,
            );
          }}
          type={"default"}
        />
      </View> */}
    </BottomSheetModal>
  );
};
export default SyncBottomSheet;
