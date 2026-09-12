import { primaryColors, secondaryColors } from "@/design/colors";
import { body } from "@/design/typography";
import { SH, SW } from "@/utils";
import { Pressable, Text, View } from "react-native";
import { ProjectInfoCardItem } from "./ProjectInfoCardItem";
import EditProjectAddressBottomSheet from "@/screens/Leads/components/EditProjectAddressBottomSheet";
import { xstack } from "@/design/layout";
import {
  openProjectClientInfoBottomSheet,
  openProjectDocumentsBottomSheet,
  openProjectInfoAddressBottomSheet,
  openProjectOtherInfoBottomSheet,
} from "./ProjectInfoBottomSheetService";
import PenIcon from "assets/icons/PenIcon";
import CallWhatsappPopover from "../specific/CallWhatsappPopover";
import EditProjectClientDetailsBottomSheet from "@/screens/Leads/components/EditProjectClientDetailsBottomSheet";
import EditProjectOtherDetailsBottomSheet from "@/screens/Leads/components/EditProjectOtherDetailsBottomSheet";
import { RenderAssets } from "../UI/GeneralComponents/RenderAssets";
import EditProjectDocumentsBottomSheet from "@/screens/Leads/components/EditProjectDocumentsBottomSheet";
import PlusIcon from "assets/icons/PlusIcon";
import { PlusCircleOutline } from "@/svg";

export const ProjectDocumentsInfo = ({
  onRefresh,
  projectDocuments,
  clientDetails,
}: {
  onRefresh: () => Promise<void> | void;
  projectDocuments: any[];
  clientDetails: any;
}) => {
  console.log("Client details are", projectDocuments);
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
            Documents
          </Text>
          <Pressable onPress={() => openProjectDocumentsBottomSheet()}>
            <PlusCircleOutline
              stroke={secondaryColors.blueGray[900]}
              strokeWidth={0.75}
              width={20}
              height={20}
              fill={"transparent"}
              style={{}}
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
        {projectDocuments.length > 0 ? (
          <RenderAssets
            imageSize={SW(52)}
            assets={projectDocuments}
            marginRight={8}
          />
        ) : (
          <Text style={{ textAlign: "center", width: "100%" }}>NA</Text>
        )}
      </View>
      <EditProjectDocumentsBottomSheet
        onRefresh={onRefresh}
        clientDetails={clientDetails}
      />
    </>
  );
};
