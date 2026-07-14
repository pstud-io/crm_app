import { Text, TouchableOpacity, Image, View, FlatList } from "react-native";
import { SW, SH, SCREEN_WIDTH } from "../../utils";
import { body } from "../UI/DesignSystem/typography";
import { primaryColors } from "../UI/DesignSystem/colorPalette";
import images from "../../images";
import { ItemSeparatorComponent } from "../UI/GeneralComponents/ItemSeperatorComponent";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
export const RenderMentionsData = ({
  triggers,
  contacts,
  showPopover,
  localMentions,
  setLocalMentions,
  onMentionsChange,
}) => {
  const { keyword, onSelect } = triggers.mention;

  let filtered = contacts;
  if (keyword && keyword.length > 0) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = contacts.filter((c) =>
      c.name.toLowerCase().includes(lowerKeyword),
    );
  }

  const handleSelectMention = (item) => {
    onSelect(item);

    // Avoid duplicates by id
    if (!localMentions.find((m) => m.id === item.id)) {
      const updatedMentions = [...localMentions, item];
      setLocalMentions(updatedMentions);
      onMentionsChange?.(updatedMentions);
    }
  };

  return (
    showPopover && (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          backgroundColor: "#fff",
          overflow: "visible",
          borderColor: primaryColors.gray[200],
          borderRadius: SW(12),
          borderWidth: SW(1),
          gap: SH(8),
          height: SH(160),
          width: SCREEN_WIDTH - SW(120),
          // width: SCREEN_WIDTH - SW(32),
          shadowColor: "#0A0D12",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
          position: "absolute",
          top: SH(96),
          // top: SH(204),
          left: SW(16),
          zIndex: 10,
        }}
        pointerEvents="box-none"
      >
        {/* <BottomSheetFlatList */}
        <FlatList
          keyExtractor={(item, index) => item.id + index}
          data={filtered}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="always"
          scrollEnabled={true}
          horizontal={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: SW(8),
                  justifyContent: "flex-start",
                  paddingHorizontal: SW(12),
                  alignSelf: "flex-start",
                  paddingVertical: SH(12),
                  height: SH(50),
                  width: "100%",
                }}
                onPress={() => handleSelectMention(item)}
              >
                <Image
                  source={item?.url ? { uri: item.url } : images.noUserImage}
                  style={{
                    width: SH(24),
                    height: SH(24),
                    resizeMode: "cover",
                    borderRadius: SW(32),
                  }}
                />
                <Text
                  style={{
                    ...body.sm.medium,
                    color: primaryColors.gray[700],
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={true}
          style={{ width: "100%", borderRadius: SW(12) }}
          contentContainerStyle={{
            backgroundColor: "white",
            borderColor: primaryColors.gray[200],
            borderTopWidth: SW(1),
          }}
          ItemSeparatorComponent={
            <ItemSeparatorComponent
              direction={"horizontal"}
              style={{ marginVertical: SH(0) }}
            />
          }
          ListEmptyComponent={
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: SH(200),
              }}
            >
              <Text
                style={{ ...body.sm.medium, color: primaryColors.gray[900] }}
              >
                {keyword
                  ? `No results for "${keyword}"`
                  : "No contacts available"}
              </Text>
            </View>
          }
        />
      </View>
    )
  );
};
