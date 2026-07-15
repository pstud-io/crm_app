import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { SF, Colors } from "../../utils";

export const FormattedNote = ({ htmlString }) => {
  // Even though the prop is named htmlString, we know it contains Markdown

  if (!htmlString) return null;

  return (
    <View style={styles.container}>
      <Markdown style={markdownStyles}>{htmlString}</Markdown>
    </View>
  );
};

const markdownStyles = {
  table: {
    borderWidth: 1,
    borderColor: Colors.gray_line_color,
    borderRadius: 3,
    marginVertical: 10,
  },
  tr: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray_line_color,
    flexDirection: "row",
  },
  th: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
    padding: 8,
    flex: 1,
  },
  td: {
    padding: 8,
    flex: 1,
  },
  heading1: {
    fontSize: SF(20),
    fontFamily: "Inter-Bold",
    color: Colors.black_text_color,
    marginVertical: 10,
  },
  heading2: {
    fontSize: SF(18),
    fontFamily: "Inter-SemiBold",
    color: Colors.black_text_color,
    marginTop: 15,
    marginBottom: 5,
  },
  body: {
    fontSize: SF(13),
    fontFamily: "Inter-Regular",
    color: Colors.black_text_color,
    lineHeight: SF(18),
  },
  bullet_list: {
    marginVertical: 10,
  },
  list_item: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 5,
  },
});
