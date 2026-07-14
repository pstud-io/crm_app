import React, { forwardRef } from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";

const HighlightingTextInput = forwardRef(
  (
    {
      value,
      onChangeText,
      onSelectionChange,
      placeholder,
      inputStyle,
      colors,
      ...props
    },
    ref
  ) => {
    // Split and highlight mentions in the text
    const renderHighlightedText = (text) => {
      if (!text && placeholder) {
        return <Text style={{ color: colors.grayText }}>{placeholder}</Text>;
      }

      const regex = /(@\w+)/g;
      const result = [];
      let lastIndex = 0;
      let match;
      let key = 0;
      while ((match = regex.exec(text))) {
        if (match.index > lastIndex) {
          result.push(
            <Text key={key++} style={{ color: colors.text }}>
              {text.substring(lastIndex, match.index)}
            </Text>
          );
        }
        result.push(
          <Text
            key={key++}
            style={{ color: colors.primary, fontWeight: "bold" }}
          >
            {match[0]}
          </Text>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) {
        result.push(
          <Text key={key++} style={{ color: colors.text }}>
            {text.substring(lastIndex)}
          </Text>
        );
      }
      // Ensure the last character is rendered properly (especially trailing \n)
      if (text && text.endsWith("\n")) {
        result.push(<Text key={key++}>{"\n "}</Text>);
      }
      return result;
    };

    return (
      <View style={styles.container}>
        {/* Highlighted overlay */}
        <Text
          style={[
            styles.textOverlay,
            inputStyle || {},
            {
              color: "transparent", // Never show accidental color here
              includeFontPadding: false,
            },
          ]}
          numberOfLines={Platform.OS === "android" ? null : undefined}
          pointerEvents="none"
        >
          {renderHighlightedText(value)}
        </Text>
        {/* Transparent input */}
        <TextInput
          ref={ref}
          value={value}
          multiline
          placeholder=""
          style={[
            styles.textInput,
            inputStyle || {},
            {
              color: "transparent", // Hide user's actual text
              textShadowColor: colors.text,
              textShadowRadius: 0.1,
              backgroundColor: "transparent",
              includeFontPadding: false,
            },
          ]}
          onChangeText={onChangeText}
          onSelectionChange={onSelectionChange}
          selectionColor={colors.primary}
          underlineColorAndroid="transparent"
          {...props}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    minHeight: 36,
    justifyContent: "flex-start",
  },
  textOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlignVertical: "top",
    zIndex: 1,
    padding: 0,
    // padding must match TextInput!
  },
  textInput: {
    position: "relative",
    zIndex: 2,
    backgroundColor: "transparent",
    padding: 0,
    // padding must match textOverlay!
  },
});

export default HighlightingTextInput;
