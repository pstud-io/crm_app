import Popover from "react-native-popover-view";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";
import { SW, SH } from "../../../utils";
import { MenuDotOutline, DownloadOutlineIcon } from "../../../svg";
import { ItemSeparatorComponent } from "./ItemSeperatorComponent";
import { Shadow } from "react-native-shadow-2";
import { RenderPopoverMenuOption } from "./RenderPopoverMenuOption";
export const PopoverMenu = ({
  options,
  id,
  from = null,
  placement = "auto",
  popoverMenuRef,
}) => {
  return (
    <Popover
      backgroundStyle={{
        backgroundColor: "transparent",
      }}
      popoverStyle={{
        backgroundColor: "transparent",
        overflow: "visible",
      }}
      animationConfig={{
        duration: 150,
      }}
      ref={popoverMenuRef}
      placement={placement}
      arrowSize={{ width: 0, height: 0 }}
      offset={6}
      from={
        from || (
          <TouchableOpacity key={id}>
            <MenuDotOutline
              width={SH(20)}
              height={SH(20)}
              fill={primaryColors.brand[1000]}
              stroke={primaryColors.brand[1000]}
              strokeWidth={SW(1)}
            />
          </TouchableOpacity>
        )
      }
    >
      <Shadow
        distance={SW(6)}
        startColor="rgba(0, 0, 0, 0.03)"
        offset={[SW(2), SH(4)]}
      >
        <FlatList
          keyExtractor={(item, index) => item.id + index}
          data={options}
          scrollEnabled={true}
          renderItem={({ item, index }) => {
            return <RenderPopoverMenuOption item={item} />;
          }}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: "white",
            borderColor: primaryColors.gray[200],
            borderRadius: SW(8),
            borderWidth: SW(1),
            maxHeight: SH(200),
            minWidth: SW(120),
          }}
          ItemSeparatorComponent={
            <ItemSeparatorComponent
              direction={"horizontal"}
              style={{ marginVertical: SH(0) }}
            />
          }
        />
      </Shadow>
    </Popover>
  );
};
