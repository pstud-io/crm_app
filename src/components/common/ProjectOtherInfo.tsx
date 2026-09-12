import { primaryColors, secondaryColors } from "@/design/colors";
import { body } from "@/design/typography";
import { SH, SW } from "@/utils";
import { Pressable, Text, View } from "react-native";
import { ProjectInfoCardItem } from "./ProjectInfoCardItem";
import EditProjectAddressBottomSheet from "@/screens/Leads/components/EditProjectAddressBottomSheet";
import { xstack } from "@/design/layout";
import {
  openProjectClientInfoBottomSheet,
  openProjectInfoAddressBottomSheet,
  openProjectOtherInfoBottomSheet,
} from "./ProjectInfoBottomSheetService";
import PenIcon from "assets/icons/PenIcon";
import CallWhatsappPopover from "../specific/CallWhatsappPopover";
import EditProjectClientDetailsBottomSheet from "@/screens/Leads/components/EditProjectClientDetailsBottomSheet";
import EditProjectOtherDetailsBottomSheet from "@/screens/Leads/components/EditProjectOtherDetailsBottomSheet";

export const ProjectOtherInfo = ({
  onRefresh,
  clientDetails,
}: {
  onRefresh: () => Promise<void> | void;
  clientDetails: Record<string, any>;
}) => {
  console.log("Client details are", clientDetails);
  return (
    <>
      <View
        style={[
          xstack,
          {
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          },
        ]}
      >
        <View
          style={[
            xstack,
            {
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            },
          ]}
        >
          <Text style={[body.sm.semiBold, { color: primaryColors.gray[900] }]}>
            Other Details
          </Text>
          <Pressable onPress={() => openProjectOtherInfoBottomSheet()}>
            <PenIcon
              stroke={secondaryColors.blueGray[900]}
              strokeWidth={0.75}
              width={20}
              height={20}
              fill={"white"}
            />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          borderRadius: SW(16),
          borderWidth: 1,
          borderColor: primaryColors.gray[200],
          padding: 16,
          gap: SH(14),
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <ProjectInfoCardItem
          label={"Legal Name"}
          value={clientDetails?.client_details?.legal_name || "NA"}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"GST Number"}
          value={clientDetails?.client_details?.gst_number || "NA"}
        />
      </View>
      <EditProjectOtherDetailsBottomSheet
        onRefresh={onRefresh}
        clientDetails={clientDetails}
      />
    </>
  );
};
