import { Text, TouchableOpacity, View } from "react-native";
import { Badge } from "./UI/Badge/Badge";
import badgeColors from "./UI/Badge/badgeColors";
import { Dispatch, SetStateAction } from "react";

export const FilterChip = ({
  filter,
  setFilter,
  label,
}: {
  filter: boolean;
  setFilter: Dispatch<SetStateAction<boolean>>;
  label: string;
}) => {
  return (
    <TouchableOpacity onPress={() => setFilter(!filter)}>
      <Badge
        size={"md"}
        color={filter ? badgeColors.blueGray : badgeColors.outline}
        border={filter ? true : false}
        text={label}
      />
    </TouchableOpacity>
  );
};
