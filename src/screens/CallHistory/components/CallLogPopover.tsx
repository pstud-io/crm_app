import { Dispatch, RefObject, SetStateAction } from "react";
import { View, Text } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";

import { SCREEN_WIDTH, SW } from "../../../utils";
import { body } from "@/design/typography";
import { primaryColors } from "@/design/colors";
import { useDispatch } from "react-redux";
import { center, grow, xstack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { ItemSeparator } from "../../../components/ItemSeperator";
import { borderWidth } from "@/design/borders";
import {
  callHistoryInitialState,
  setCallHistory,
} from "@/store/slices/callHistorySlice";
const CallLogPopover = ({
  showPopover,
  setShowPopover,
  callLogPopoverRef,
  openCallLogBottomSheet,
}: {
  showPopover: boolean;
  setShowPopover: Dispatch<SetStateAction<boolean>>;
  callLogPopoverRef: RefObject<Popover | null>;
  openCallLogBottomSheet: () => void;
}) => {
  const dispatch = useDispatch();
  return (
    <Popover
      backgroundStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
      ref={callLogPopoverRef}
      isVisible={showPopover}
      onRequestClose={() => setShowPopover(false)}
      popoverStyle={{
        backgroundColor: "transparent",
        overflow: "visible",
      }}
      animationConfig={{
        duration: 150,
      }}
      placement={PopoverPlacement.CENTER}
      arrowSize={{ width: 0, height: 0 }}
      offset={0}
      from={null}
    >
      <View
        style={{
          width: SCREEN_WIDTH * 0.66,
          //   height: SCREEN_HEIGHT * 0.5,
          backgroundColor: "white",
          borderRadius: SW(24),
          overflow: "hidden",
        }}
      >
        <View
          style={{
            // paddingHorizontal: SW(20),
            paddingVertical: spacing.xl,
            borderBottomWidth: borderWidth.sm,
            borderBottomColor: primaryColors.gray[200],
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              body.md.regular,
              {
                color: primaryColors.gray[900],
              },
            ]}
          >
            Log This Call?
          </Text>
        </View>

        <View style={[xstack, center]}>
          <Text
            style={[
              grow,
              body.md.regular,
              {
                paddingVertical: spacing.lg,
                textAlign: "center",
              },
            ]}
            onPress={() => {
              dispatch(setCallHistory({ ...callHistoryInitialState }));
              setTimeout(() => {
                callLogPopoverRef.current?.requestClose();
              }, 250);
            }}
            suppressHighlighting
          >
            No
          </Text>
          <ItemSeparator
            direction="vertical"
            style={{
              marginHorizontal: 0,
              height: "100%",
              borderRightWidth: borderWidth.sm,
            }}
            opacity={1}
          />
          <Text
            style={[
              grow,
              body.md.regular,
              { paddingVertical: spacing.lg, textAlign: "center" },
            ]}
            onPress={() => {
              callLogPopoverRef.current?.requestClose();
              setTimeout(() => {
                openCallLogBottomSheet();
              }, 250);
            }}
            suppressHighlighting
          >
            Yes
          </Text>
        </View>
      </View>
    </Popover>
  );
};

export default CallLogPopover;
