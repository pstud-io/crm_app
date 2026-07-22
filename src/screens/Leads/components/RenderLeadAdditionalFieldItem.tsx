import { ProjectInfoCardItem } from "@/components/common/ProjectInfoCardItem";
import { ItemSeparatorComponent } from "@/components/UI/GeneralComponents/ItemSeperatorComponent";
import { primaryColors, secondaryColors } from "@/design/colors";
import { xstack } from "@/design/layout";
import { body } from "@/design/typography";
import { EditOutline, EditOutlineIcon } from "@/svg";
import { capitalizeEachWord, Colors } from "@/utils";
import PenIcon from "assets/icons/PenIcon";
import { Pressable, Text, View } from "react-native";

export const RenderLeadAdditionalFieldItem = ({
  section,
  fields,
  editProjectFunctions,
  allFields,
}: {
  section: any;
  fields: any[];
  editProjectFunctions: any;
  allFields: any[];
}) => {
  console.log("Edit project functions is", editProjectFunctions);
  return (
    <View key={section} style={{ gap: 16 }}>
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
          {section}
        </Text>
        <Pressable
          onPress={() =>
            editProjectFunctions.open({ section, fields, allFields })
          }
        >
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
          borderRadius: 16,
          borderWidth: 1,
          borderColor: primaryColors.gray[200],
          padding: 16,
          gap: 14,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        {fields.map((item, index) => {
          return (
            <>
              {index !== 0 && (
                <ItemSeparatorComponent
                  direction={"horizontal"}
                  style={{ opacity: 1, marginVertical: 2 }}
                />
              )}
              <ProjectInfoCardItem
                key={item.id}
                label={capitalizeEachWord(item.additional_field.name)}
                value={item.value || "NA"}
                location={true}
                color={Colors.black_text_color}
                size={13}
              />
            </>
          );
        })}
      </View>
    </View>
  );
};
