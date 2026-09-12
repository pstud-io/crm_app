import { primaryColors, secondaryColors } from "@/design/colors";
import { body } from "@/design/typography";
import { formatDate, SH, SW } from "@/utils";
import { Pressable, Text, View } from "react-native";
import { ProjectInfoCardItem } from "./ProjectInfoCardItem";
import EditProjectAddressBottomSheet from "@/screens/Leads/components/EditProjectAddressBottomSheet";
import { xstack } from "@/design/layout";
import {
  openProjectExtraInfoBottomSheet,
  openProjectInfoAddressBottomSheet,
} from "./ProjectInfoBottomSheetService";
import PenIcon from "assets/icons/PenIcon";
import EditProjectExtraDetailsBottomSheet from "@/screens/Leads/components/EditProjectExtraDetailsBottomSheet";

export const ProjectExtraInfo = ({
  onRefresh,
  clientDetails,
}: {
  onRefresh: () => Promise<void> | void;
  clientDetails: Record<string, any>;
}) => {
  console.log("Lead details are", clientDetails);
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
        <Text style={[body.sm.semiBold, { color: primaryColors.gray[900] }]}>
          Lead Details
        </Text>
        <Pressable onPress={() => openProjectExtraInfoBottomSheet()}>
          <PenIcon
            stroke={secondaryColors.blueGray[900]}
            strokeWidth={0.75}
            width={20}
            height={20}
            fill={"white"}
          />
        </Pressable>
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
          label={"Created on"}
          value={formatDate(clientDetails?.created_on)}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"Last Updated on"}
          value={formatDate(clientDetails?.last_updated_on)}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"Budget"}
          value={clientDetails?.budget ? `₹${clientDetails?.budget}` : "NA"}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"Brand"}
          value={clientDetails?.fk_brand_name || "NA"}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"Lead Source"}
          value={clientDetails?.fk_lead_source_name || "NA"}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"Project Type"}
          value={clientDetails?.fk_project_type_name || "NA"}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"Description"}
          value={clientDetails?.description || "NA"}
        />
      </View>
      <EditProjectExtraDetailsBottomSheet
        onRefresh={onRefresh}
        clientDetails={clientDetails}
      />
    </>
  );
};
