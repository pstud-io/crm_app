import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { body } from "../../DesignSystem/typography";
import {
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
import { useRef, useState } from "react";
import { CloseOutlineIcon } from "../../../../svg";
import images from "../../../../images";
import { useGeneralEndpoints } from "../../../../hooks/useGeneralEndpoints";
import { RenderPendingApproval } from "./RenderPendingApproval";
import LoadingIndicatorFooter from "../LoadingIndicatorFooter";
import { ViewApproversPopover } from "../../../../screens/Files/components/ViewApproversPopover";
import { ViewPendingApproversPopover } from "../../../../screens/Files/components/ViewPendingApproversPopover";
import { SearchInput } from "../SearchInput";

export const ViewPendingApprovals = ({ type }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  const viewPendingApprovalsRef = useRef(null);

  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState({
    getPendingApprovals: false,
  });

  const { getPendingApprovals } = useGeneralEndpoints();
  const refresh = async () => {
    await getPendingApprovals(setLoading, setPendingApprovals, type);
  };

  const searchedData = pendingApprovals.filter((pendingApproval) => {
    const pendingApprovalTitle =
      pendingApproval?.project_detail?.project_name || "";
    return pendingApprovalTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <Popover
      key={`view-pending-approvals-for-${type}`}
      placement={"center"}
      mode="rn-modal"
      ref={viewPendingApprovalsRef}
      popoverStyle={{ borderRadius: SW(16) }}
      onOpenStart={async () => {
        await getPendingApprovals(setLoading, setPendingApprovals, type);
      }}
      from={
        <TouchableOpacity>
          <Badge
            text={`My Pending Approvals`}
            size={"xs"}
            color={badgeColors.blueGray}
            border={true}
          />
        </TouchableOpacity>
      }
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: SCREEN_WIDTH * 0.9,
          height: SCREEN_HEIGHT * 0.8,
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: primaryColors.gray[200],
          borderRadius: SW(8),
          backgroundColor: primaryColors.gray[100],
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
            backgroundColor: "white",
          }}
        >
          <Text style={{ ...body.md.regular, color: primaryColors.gray[900] }}>
            {`Pending ${type === "expense" ? "expense" : "payment request"} approvals`}
          </Text>
          <TouchableOpacity
            onPress={() => viewPendingApprovalsRef.current.requestClose()}
          >
            <CloseOutlineIcon
              fill={Colors.black_text_color}
              width={SW(12)}
              height={SH(12)}
            />
          </TouchableOpacity>
        </View>
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          label={"Search by Lead"}
        />
        {loading.getPendingApprovals && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingIndicatorFooter />
          </View>
        )}
        {!loading.getPendingApprovals && (
          <FlatList
            horizontal={false}
            nestedScrollEnabled={true}
            data={searchedData}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{
              flexGrow: 1,
              width: "100%",
              backgroundColor: primaryColors.gray[100],
            }}
            contentContainerStyle={{
              padding: SW(16),
              justifyContent:
                pendingApprovals?.length === 0 ? "center" : "flex-start",
            }}
            renderItem={({ item, index }) => {
              return (
                <RenderPendingApproval
                  item={item}
                  setActiveItem={setActiveItem}
                  setVisible={setVisible}
                  onRefresh={refresh}
                  viewPendingApprovalsRef={viewPendingApprovalsRef}
                />
              );
            }}
            ItemSeparatorComponent={() => (
              <ItemSeparatorComponent
                direction={"horizontal"}
                style={{ opacity: 0, marginVertical: SH(8) }}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
                progressBackgroundColor={Colors.white}
              />
            }
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={() => {
              return (
                <Text
                  style={{
                    ...body.xs.regular,
                    color: primaryColors.gray[500],
                    textAlign: "center",
                  }}
                >
                  No Pending Approvals
                </Text>
              );
            }}
          />
        )}
        <ViewPendingApproversPopover
          approvalHierarchy={activeItem?.approval_status_details}
          uniqueKey={activeItem?.id}
          canApproveReject={true}
          visible={visible}
          setVisible={setVisible}
          setActiveItem={setActiveItem}
        />
      </View>
    </Popover>
  );
};
