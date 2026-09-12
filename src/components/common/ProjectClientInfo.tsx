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
} from "./ProjectInfoBottomSheetService";
import PenIcon from "assets/icons/PenIcon";
import CallWhatsappPopover from "../specific/CallWhatsappPopover";
import EditProjectClientDetailsBottomSheet from "@/screens/Leads/components/EditProjectClientDetailsBottomSheet";

export const ProjectClientInfo = ({
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
            Client Details
          </Text>
          <Pressable onPress={() => openProjectClientInfoBottomSheet()}>
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
          label={"Client Name"}
          value={clientDetails?.client_details?.contact_details?.name || "NA"}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <CallWhatsappPopover
          value={clientDetails?.client_details?.contact_details?.phone || "NA"}
          code={
            clientDetails?.client_details?.contact_details?.country_code || "NA"
          }
          fromInfo={true}
          project_id={clientDetails?.id}
          project_name={clientDetails?.project_name}
          client_name={clientDetails?.client_details?.contact_details?.name}
          task_id={""}
          task_name={""}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"Email"}
          value={clientDetails?.client_details?.contact_details?.email || "NA"}
        />
      </View>
      <EditProjectClientDetailsBottomSheet
        onRefresh={onRefresh}
        clientDetails={clientDetails}
      />
    </>
  );
};
