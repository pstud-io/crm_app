import React from "react";
import { Text, StyleSheet } from "react-native";
import { body } from "../UI/DesignSystem/typography";
import { primaryColors } from "../UI/DesignSystem/colorPalette";

// Regex to match mention markup in the form {@}[Name](id)
const MENTION_REGEX = /\{@\}\[([^\]]+)\]\(([^\)]+)\)/g;

const RenderComment = ({ comment, onMentionPress, textStyle }) => {
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = MENTION_REGEX.exec(comment)) !== null) {
    const [fullMatch, name, id] = match;
    const index = match.index;

    // Add text preceding the mention
    if (index > lastIndex) {
      parts.push(
        <Text key={`text-${lastIndex}`}>
          {comment.substring(lastIndex, index)}
        </Text>,
      );
    }

    // Add the mention as styled, clickable text
    parts.push(
      <Text
        key={`mention-${index}`}
        style={styles.mention}
        onPress={() => onMentionPress && onMentionPress(id, name)}
      >
        {name}
      </Text>,
    );
    lastIndex = index + fullMatch.length;
  }

  // Add any trailing text after the last mention
  if (lastIndex < comment.length) {
    parts.push(<Text key={`text-end`}>{comment.substring(lastIndex)}</Text>);
  }

  return <Text style={textStyle}>{parts}</Text>;
};

const styles = StyleSheet.create({
  mention: {
    ...body.sm.medium,
    color: primaryColors.brand[900],
    // color: "#6B4F3A",
  },
});

export default RenderComment;
