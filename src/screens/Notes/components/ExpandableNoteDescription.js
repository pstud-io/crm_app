import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Colors, SH, SW } from "../../../utils";
import { MaterialIcons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import { HTMLFormat } from "../utils/HTMLFormat";
import { primaryColors } from "../../../components/UI/DesignSystem/colorPalette";

export const ExpandableNoteDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const { height: screenHeight } = useWindowDimensions();

  const collapsedMaxHeight = screenHeight * 0.3;
  const expandedMaxHeight = screenHeight * 0.6;

  const isHTMLContent = (str) => {
    if (!str) return false;
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(str.trim());
  };

  const showExpandButton = contentHeight > collapsedMaxHeight;
  const isHtml = isHTMLContent(description);

  console.log("This is the note", description, isHtml);

  return (
    <View
      style={[
        styles.container,
        { height: isExpanded ? expandedMaxHeight : collapsedMaxHeight },
      ]}
    >
      <ScrollView
        style={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        onContentSizeChange={(_, h) => setContentHeight(h)}
      >
        {isHtml ? (
          <HTMLFormat htmlString={description} />
        ) : (
          <Markdown>{description}</Markdown>
        )}
      </ScrollView>

      {showExpandButton && (
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={1}
        >
          <MaterialIcons
            name={isExpanded ? "fullscreen-exit" : "fullscreen"}
            size={SH(24)}
            color={primaryColors.brand[1000]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    position: "relative",
    overflow: "hidden",
    paddingHorizontal: SW(12),
    paddingVertical: SH(8),
  },
  contentWrapper: {
    flex: 1,
  },
  expandButton: {
    position: "absolute",
    bottom: SH(12),
    right: SW(12),
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.gray_line_color,
    elevation: 2,
    shadowColor: "#0A0D12",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
