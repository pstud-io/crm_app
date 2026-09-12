import { primaryColors, secondaryColors } from "@/design/colors";
import { body } from "@/design/typography";
import { SH, SW } from "@/utils";
import { Pressable, Text, View } from "react-native";
import { ProjectInfoCardItem } from "./ProjectInfoCardItem";
import EditProjectAddressBottomSheet from "@/screens/Leads/components/EditProjectAddressBottomSheet";
import { xstack } from "@/design/layout";
import { openProjectInfoAddressBottomSheet } from "./ProjectInfoBottomSheetService";
import PenIcon from "assets/icons/PenIcon";

export const ProjectAddressInfo = ({
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
        <Text style={[body.sm.semiBold, { color: primaryColors.gray[900] }]}>
          Address Details
        </Text>
        <Pressable onPress={() => openProjectInfoAddressBottomSheet()}>
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
          label={"Address"}
          value={
            [
              clientDetails?.address_details?.address_line_1,
              clientDetails?.address_details?.address_line_2,
            ]
              .filter(Boolean)
              .join(" ") || "NA"
          }
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"City"}
          value={clientDetails?.address_details?.city || "NA"}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"State"}
          value={clientDetails?.address_details?.state || "NA"}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"PIN Code"}
          value={clientDetails?.address_details?.pincode || "NA"}
        />
        <View
          style={{
            borderTopWidth: SW(1),
            borderTopColor: primaryColors.gray[200],
            width: "100%",
          }}
        />
        <ProjectInfoCardItem
          label={"Location"}
          value={clientDetails?.address_details?.location || "NA"}
          location={true}
        />
      </View>
      <EditProjectAddressBottomSheet
        onRefresh={onRefresh}
        clientDetails={clientDetails}
      />
    </>
  );
};
