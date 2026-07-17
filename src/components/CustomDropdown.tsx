import { forwardRef } from "react";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";
import { DropdownProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";

import { useFormElementsStyles } from "@/hooks/useFormElementsStyles";
import { DropdownDataItem } from "./DropdownDataItem";
import LoadingIndicatorFooter from "./LoadingIndicatorFooter";
import { Text, View } from "react-native";

type CustomDropdownProps = DropdownProps<any> & {
  itemDisplayField: string;
  loading: boolean;
  onEndReached: () => Promise<void>;
};

export const CustomDropdown = forwardRef<IDropdownRef, CustomDropdownProps>(
  (props, ref) => {
    const styles = useFormElementsStyles();
    return (
      <View
        style={{
          width: 0,
          height: 0,
          position: "absolute",
          overflow: "hidden",
        }}
      >
        <Dropdown
          {...props}
          ref={ref}
          mode="modal"
          iconStyle={{ display: "none" }}
          style={[styles.dropdownTriggerStyle, props.style]}
          search
          placeholderStyle={[
            styles.dropdownPlaceholderStyle,
            props.placeholderStyle,
          ]}
          itemContainerStyle={[
            styles.dropdownOptionsItemContainerStyle,
            props.itemContainerStyle,
          ]}
          selectedTextStyle={[styles.valueStyle, props.selectedTextStyle]}
          containerStyle={[
            styles.dropdownOptionsContainerStyle,
            props.containerStyle,
          ]}
          inputSearchStyle={[
            styles.dropdownOptionsSearchStyle,
            props.inputSearchStyle,
          ]}
          searchPlaceholderTextColor={
            props.searchPlaceholderTextColor ?? styles.placeholderColor
          }
          showsVerticalScrollIndicator={
            props.showsVerticalScrollIndicator ?? false
          }
          activeColor="transparent"
          autoScroll={props.autoScroll ?? false}
          renderItem={(item, isSelected) => (
            <DropdownDataItem
              itemName={item[props.itemDisplayField]}
              isSelected={isSelected}
            />
          )}
          flatListProps={{
            onEndReached: async () => {
              await props.onEndReached();
            },
            ListFooterComponent: props.loading ? (
              <LoadingIndicatorFooter size={10} width="100%" />
            ) : null,
          }}
        />
      </View>
    );
  },
);

CustomDropdown.displayName = "CustomDropdown";
