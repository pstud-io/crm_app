import { Text, View, TouchableOpacity, FlatList } from "react-native";
import { body } from "../DesignSystem/typography";
import { Checked, RadioOutline, Unchecked } from "../../../svg";
import { capitalizeEachWord, SH, SW } from "../../../utils";
import { primaryColors } from "../DesignSystem/colorPalette";

export const RadioSelect = ({
  data,
  value,
  setValue,
  orientation,
  scrollEnabled,
  justify,
  size = 20,
}) => {
  console.log("Data in radio select", data, value);
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item.id + index}
      scrollEnabled={scrollEnabled}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="handled"
      horizontal={orientation === "horizontal"}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        // width: "100%",
        display: "flex",
        flexDirection: orientation === "horizontal" ? "row" : "column",
        justifyContent: justify ? "space-between" : "flex-start",
        alignItems: "center",
        gap: SW(16),
      }}
      style={{ width: "100%" }}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 4,
            }}
            onPress={() => setValue(item.id)}
          >
            <RadioOutline
              width={SW(size)}
              height={SH(size)}
              stroke={primaryColors.gray[900]}
              strokeWidth={1}
              selected={value === item.id}
            />
            <Text style={{ ...body.sm.medium }}>
              {item?.value || capitalizeEachWord(item?.name)}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};
