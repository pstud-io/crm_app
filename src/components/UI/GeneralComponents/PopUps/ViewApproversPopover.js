import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { body } from "../../DesignSystem/typography";
import {
  badFormatDate,
  capitalizeEachWord,
  Colors,
  formatDate,
  SH,
  SW,
} from "../../../../utils";
import Popover from "react-native-popover-view";
import badgeColors from "../../Badge/badgeColors";
import { Badge } from "../../Badge/Badge";
import { ItemSeparatorComponent } from "../ItemSeperatorComponent";
import { useRef } from "react";
import { CloseOutlineIcon } from "../../../../svg";
import images from "../../../../images";

export const ViewApproversPopover = ({
  uniqueKey,
  approvalHierarchy,
  canApproveReject,
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");
  const viewApproversPopoverRef = useRef(null);
  const statusColor = (status) => {
    if (status === "pending") {
      return badgeColors.warning;
    } else if (status === "approved") {
      return badgeColors.success;
    } else if (status === "rejected") {
      return badgeColors.error;
    } else if (status === "skipped") {
      return badgeColors.purple;
    } else {
      return badgeColors.outline;
    }
  };
  return (
    <Popover
      key={uniqueKey}
      placement={"center"}
      ref={viewApproversPopoverRef}
      popoverStyle={{ borderRadius: SW(12) }}
      from={
        <TouchableOpacity
          style={{
            flexGrow: canApproveReject ? 1 : 0,
          }}
        >
          <Badge
            text={`All approvers`}
            size={"sm"}
            color={badgeColors.blueGray}
            border={false}
          />
        </TouchableOpacity>
      }
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: SCREEN_WIDTH * 0.8,
          height: SCREEN_HEIGHT * 0.7,
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: primaryColors.gray[200],
          borderRadius: SW(8),
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: SW(16),
            paddingTop: SH(20),
            paddingBottom: SH(16),
            borderColor: primaryColors.gray[200],
            borderBottomWidth: 1,
          }}
        >
          <Text style={{ ...body.md.regular, color: primaryColors.gray[900] }}>
            All Approvers
          </Text>
          <TouchableOpacity
            onPress={() => viewApproversPopoverRef.current.requestClose()}
          >
            <CloseOutlineIcon
              fill={Colors.black_text_color}
              width={SW(12)}
              height={SH(12)}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal={false}
          data={approvalHierarchy}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{
            flexGrow: 1,
            width: "100%",
            backgroundColor: primaryColors.gray[50],
          }}
          contentContainerStyle={{
            padding: SW(16),
            height: "100%",
            justifyContent:
              approvalHierarchy?.length === 0 ? "center" : "flex-start",
          }}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  backgroundColor: "white",
                  gap: 0,
                  padding: SW(10),
                  gap: SH(10),
                  borderRadius: SW(8),
                  borderColor: primaryColors.gray[200],
                  borderWidth: 1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Badge
                    size={"sm"}
                    text={`Level ${item.level}`}
                    color={badgeColors.blueLight}
                  />
                  <Badge
                    size={"sm"}
                    text={item.role_details === null ? "User" : "Role"}
                    color={badgeColors.gray}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    gap: SW(8),
                  }}
                >
                  <Image
                    source={
                      item.role_details === null
                        ? images.noUserImage
                        : images.noUserGroupImage
                    }
                    style={{
                      width: SH(28),
                      height: SH(28),
                      resizeMode: "cover",
                      borderRadius: SW(28),
                    }}
                  />
                  <Text
                    style={{
                      ...body.sm.regular,
                      color: primaryColors.gray[800],
                      flexGrow: 1,
                    }}
                  >
                    {item.role_details === null
                      ? capitalizeEachWord(
                          item.organization_contact_details.name,
                        )
                      : capitalizeEachWord(item.role_details.name)}
                  </Text>
                  <Badge
                    size={"sm"}
                    text={capitalizeEachWord(item.status)}
                    color={statusColor(item.status)}
                    alignSelf="center"
                  />
                </View>
                {(item.status === "approved" || item.status === "rejected") && (
                  <>
                    <ItemSeparatorComponent
                      direction={"horizontal"}
                      style={{
                        marginVertical: 0,
                        borderRightWidth: StyleSheet.hairlineWidth,
                        opacity: 0.5,
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
                      <Text
                        style={{
                          ...body.xs.regular,
                          color: primaryColors.gray[700],
                          paddingHorizontal: SH(4),
                        }}
                      >
                        {item.status === "approved"
                          ? "Approved on"
                          : "Rejected on"}
                      </Text>
                      <Text
                        style={{
                          ...body.xs.regular,
                          color: primaryColors.gray[900],
                        }}
                      >
                        {formatDate(item?.updated_status_time)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            );
          }}
          ItemSeparatorComponent={() => (
            <ItemSeparatorComponent
              direction={"horizontal"}
              style={{ opacity: 0, marginVertical: SH(8) }}
            />
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <Text
                style={{
                  ...body.md.regular,
                  color: primaryColors.gray[800],
                  textAlign: "center",
                }}
              >
                No Hierarchy configured yet. Please create hierarchy from web
                first
              </Text>
            );
          }}
        />
      </View>
    </Popover>
  );
};
