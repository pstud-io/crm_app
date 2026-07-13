import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { body } from "../../DesignSystem/typography";
import { capitalizeEachWord, Colors, SH, SW } from "../../../../utils";
import Popover from "react-native-popover-view";
import badgeColors from "../../Badge/badgeColors";
import { Badge } from "../../Badge/Badge";
import { ItemSeparatorComponent } from "../ItemSeperatorComponent";
import React, { useRef, useState } from "react";
import {
  ArrowRight,
  CloseOutlineIcon,
  SendOutlineTilted,
} from "../../../../svg";
import images from "../../../../images";
import { useFilesEndpoints } from "../../../../screens/Files/hooks/useFilesEndpoints";
import { useGeneralEndpoints } from "../../../../hooks/useGeneralEndpoints";
import { formElementsStyles } from "../../Dropdown/formElementStyles";
import { filterApprovalHierarchy } from "../../../../utils";
import { useQuotesEndpoints } from "../../../../screens/Quotes/hooks/useQuotesEndpoints";
export const SendForApprovalPopover = ({
  uniqueKey,
  item,
  type,
  onRefresh,
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");
  const [loading, setLoading] = useState({
    fetchingApprovalHierarchy: false,
    fetchingProjectDetails: false,
    sendingForApproval: false,
    editingFolder: false,
    editingFile: false,
    editingQuote: false,
  });
  const [approvalHierarchy, setApprovalHierarchy] = useState([]);
  const sendForApprovalPopoverRef = useRef(null);
  const { handleEditFolder, handleEditFile } = useFilesEndpoints();
  const { handleEditQuote } = useQuotesEndpoints();
  const {
    getApprovalHierarchy,
    handleSendForApproval,
    getSingleProjectDetails,
  } = useGeneralEndpoints();
  return (
    <Popover
      key={uniqueKey}
      onOpenComplete={async () => {
        const projectDetails = await getSingleProjectDetails(
          loading,
          setLoading,
        );
        console.log("Project users", projectDetails.organization_contacts);
        const hierachary = await getApprovalHierarchy(
          loading,
          setLoading,
          type,
        );
        console.log("Approval hierarchy", hierachary);
        await filterApprovalHierarchy(
          hierachary,
          projectDetails.organization_contacts,
          setApprovalHierarchy,
        );
      }}
      onCloseComplete={() => {
        setApprovalHierarchy([]);
        setLoading({
          fetchingApprovalHierarchy: false,
          fetchingProjectDetails: false,
          sendingForApproval: false,
        });
      }}
      ref={sendForApprovalPopoverRef}
      placement={"center"}
      popoverStyle={{ borderRadius: SW(12) }}
      from={
        <TouchableOpacity>
          <Badge
            text={`Send For Approval`}
            size={"md"}
            color={badgeColors.blueGray}
            border={true}
            iconRight={
              <SendOutlineTilted
                width={SW(12)}
                height={SH(12)}
                stroke={badgeColors.blueGray.text}
                strokeWidth={1.5}
              />
            }
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
            Send For Approval
          </Text>
          <TouchableOpacity
            onPress={() => sendForApprovalPopoverRef.current.requestClose()}
          >
            <CloseOutlineIcon
              fill={Colors.black_text_color}
              width={SW(12)}
              height={SH(12)}
            />
          </TouchableOpacity>
        </View>
        {loading.fetchingProjectDetails || loading.fetchingApprovalHierarchy ? (
          <ActivityIndicator size={16} color={primaryColors.button.active} />
        ) : (
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
                approvalHierarchy.length === 0 ? "center" : "flex-start",
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
                      text={"Level " + (index + 1)}
                      color={badgeColors.blueLight}
                    />
                    <Badge
                      size={"sm"}
                      text={item.approver_type === "role" ? "Role" : "User"}
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
                        item.approver_type === "role"
                          ? images.noUserGroupImage
                          : images.noUserImage
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
                      }}
                    >
                      {item.approver_type === "role"
                        ? capitalizeEachWord(item.role_details.role_name)
                        : capitalizeEachWord(
                            item.organization_contact_details.name,
                          )}
                    </Text>
                  </View>
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
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: SW(16),
            paddingVertical: SH(16),
            borderColor: Colors.gray_line_color,
            borderTopWidth: StyleSheet.hairlineWidth,
            width: "100%",
            borderColor: primaryColors.gray[200],
            borderTopWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingVertical: SH(8),
              paddingHorizontal: SW(10),
              borderRadius: SW(8),
              borderWidth: SW(1),
              borderColor: primaryColors.gray[400],
              gap: SW(4),
            }}
            onPress={() => sendForApprovalPopoverRef.current.requestClose()}
          >
            <Text style={formElementsStyles.titleStyle}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                approvalHierarchy.length < 1
                  ? primaryColors.brand[1000]
                  : primaryColors.button.active,
              paddingHorizontal: SW(10),
              paddingVertical: SH(8),
              borderRadius: SW(6),
              gap: SW(6),
            }}
            onPress={async () => {
              if (approvalHierarchy.length < 1) {
                return;
              }
              setLoading({ ...loading, sendingForApproval: true });
              await handleSendForApproval(item, type, approvalHierarchy);
              if (type === "files") {
                await handleEditFolder(
                  loading,
                  setLoading,
                  { status: "pending" },
                  item,
                  onRefresh,
                );
              } else if (type === "file_assets") {
                await handleEditFile(
                  loading,
                  setLoading,
                  { status: "pending" },
                  item,
                  onRefresh,
                );
              } else if (type === "quotes") {
                await handleEditQuote(
                  loading,
                  setLoading,
                  { status: "pending" },
                  item,
                  onRefresh,
                );
              }
              sendForApprovalPopoverRef.current.requestClose();
              setLoading({ ...loading, sendingForApproval: false });
            }}
          >
            <Text style={{ ...formElementsStyles.titleStyle, color: "white" }}>
              Send For Approval
            </Text>
            {loading.sendingForApproval ? (
              <ActivityIndicator size={12} color={Colors.white} />
            ) : (
              <SendOutlineTilted
                width={SW(12)}
                height={SH(12)}
                strokeWidth={1.5}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Popover>
  );
};
