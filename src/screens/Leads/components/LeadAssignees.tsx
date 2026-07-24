import { ProjectInfoCardItem } from "@/components/common/ProjectInfoCardItem";
import { ItemSeparatorComponent } from "@/components/UI/GeneralComponents/ItemSeperatorComponent";
import { borderWidth } from "@/design/borders";
import { primaryColors } from "@/design/colors";
import { height } from "@/design/distance";
import { xstack } from "@/design/layout";
import { body } from "@/design/typography";
import { UserOutline } from "@/svg";
import { capitalizeEachWord, Colors } from "@/utils";
import { FlatList, StyleSheet, Text, View } from "react-native";

export const LeadAssignees = ({ data }: { data: any[] }) => {
  return (
    <View style={{ gap: 16 }}>
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
          Team Members
        </Text>
      </View>
      <View
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: primaryColors.gray[200],
          padding: 16,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <ItemSeparatorComponent
              direction="horizontal"
              style={{
                opacity: 1,
                marginVertical: 14,
              }}
            />
          )}
          renderItem={({ item }) => (
            <ProjectInfoCardItem
              label={capitalizeEachWord(item.contact_details.name)}
              leftIcon={
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    borderRadius: 36,
                    backgroundColor: primaryColors.gray[100],
                    borderColor: primaryColors.gray[200],
                    borderWidth: StyleSheet.hairlineWidth,
                  }}
                >
                  <UserOutline
                    width={14}
                    height={14}
                    stroke={primaryColors.brand[900]}
                    strokeWidth={1.5}
                    style={{}}
                  />
                </View>
              }
              value={item.user_role_details.role_name || "NA"}
              location
              color={Colors.black_text_color}
              size={13}
            />
          )}
        />
      </View>
    </View>
  );
};
