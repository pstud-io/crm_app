import { Text } from "react-native";
import { primaryColors } from "../DesignSystem/colorPalette";
import { body } from "../DesignSystem/typography";
const NoProject = () => {
  return (
    <Text
      style={{
        ...body.md.medium,
        color: primaryColors.gray[700],
        textAlign: "center",
      }}
    >
      Please select a project to view tasks.
    </Text>
  );
};
export default NoProject;
