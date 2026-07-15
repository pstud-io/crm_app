import React from "react";
import { useWindowDimensions, View, StyleSheet } from "react-native";
import RenderHtml from "react-native-render-html";
import { SF, Colors, SW } from "../../../utils";

export const HTMLFormat = ({ htmlString }) => {
  const { width } = useWindowDimensions();

  // If it's not HTML, wrap it in a paragraph tag to ensure consistent rendering
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(htmlString?.trim() || "");
  const safeHtml = isHtml ? htmlString : `<p>${htmlString}</p>`;

  return (
    <View style={styles.container}>
      <RenderHtml
        contentWidth={width - SW(48)} // Adjusting for card padding to prevent overflow
        source={{ html: safeHtml }}
        tagsStyles={tagsStyles}
      />
    </View>
  );
};

const tagsStyles = {
  body: {
    fontFamily: "Inter-Regular",
    color: Colors.black_text_color,
    fontSize: SF(13),
  },
  ol: {
    paddingLeft: SW(20),
    marginBottom: 6,
  },
  ul: {
    paddingLeft: SW(20),
    marginBottom: 6,
  },
  li: {
    fontSize: SF(13),
    lineHeight: SF(18),
    fontFamily: "Inter-Regular",
    color: Colors.black_text_color,
    marginBottom: 4,
  },
  p: {
    fontSize: SF(13),
    lineHeight: SF(18),
    fontFamily: "Inter-Regular",
    color: Colors.black_text_color,
    marginTop: 0,
    marginBottom: 8,
  },
  table: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.gray_line_color,
    width: "100%",
  },
  th: {
    borderWidth: 1,
    borderColor: Colors.gray_line_color,
    padding: 6,
    fontFamily: "Inter-SemiBold",
    fontSize: SF(12),
    backgroundColor: "#F9F9F9",
  },
  td: {
    borderWidth: 1,
    borderColor: Colors.gray_line_color,
    padding: 6,
    fontFamily: "Inter-Regular",
    fontSize: SF(12),
  },
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
