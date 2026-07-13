import { Input } from "react-native-elements";
import { primaryColors } from "../DesignSystem/colorPalette";
import { SearchOutline } from "../../../svg";
import { body } from "../DesignSystem/typography";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { SH, SW } from "../../../utils";
import { View } from "react-native";

export const SearchInput = ({ searchTerm, setSearchTerm, label }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: SW(16),
        marginTop: SH(16),
        gap: SW(12),
        backgroundColor: "transparent",
      }}
    >
      <Input
        renderErrorMessage={false}
        placeholder={label ?? "Quick Search"}
        placeholderTextColor={primaryColors.gray[500]}
        leftIconContainerStyle={{
          height: SH(20),
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        leftIcon={() => (
          <SearchOutline
            width={SW(16)}
            height={SH(16)}
            strokeWidth={SW(2)}
            stroke={primaryColors.gray[500]}
          />
        )}
        style={{ flexGrow: 1 }}
        inputStyle={{
          color: Colors.black_text_color,
          minHeight: SH(20),
          maxHeight: SH(20),
          height: "100%",
          ...body.sm.regular,
        }}
        containerStyle={{
          borderRadius: SW(12),
          backgroundColor: "white",
          height: SH(40),
          paddingHorizontal: 0,
          flex: 1,
          flexGrow: 1,
          elevation: 1,
          shadowColor: "#0A0D12",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
        }}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: primaryColors.gray[200],
          backgroundColor: "white",
          width: "100%",
          height: "100%",
          padding: SW(10),
          gap: SW(2),
          borderRadius: SW(12),
        }}
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
    </View>
  );
};
