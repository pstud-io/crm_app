import { StyleSheet } from "react-native";
import { SF, Fonts, Colors, SW, SH } from "../../utils";

const InputTextStyles = StyleSheet.create({
  containerStyle: {
    borderRadius: 10,
    borderWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: Colors.grey_bg_color,
    paddingVertical: 0,
    height: SH(45),
    marginBottom: SH(20),
    marginHorizontal: 0,
  },
  inputContainerStyle: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  inputStyle: {
    paddingVertical: SH(10),
    borderWidth: 0,
    paddingHorizontal: SW(5),
    fontSize: SF(14),
    fontFamily: "Inter-Regular",
    color: Colors.black_text_color,
  },
  leftIconContainerStyle: {
    marginLeft: SW(5),
  },
  containerStyleTwo: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray_line_color,
    height: SH(130),
    // paddingBottom: 32,
  },
  inputContainerStyleTwo: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  inputStyleTwo: {
    paddingVertical: SH(5),
    borderWidth: 0,
    paddingHorizontal: SW(5),
    fontSize: SF(12),
    fontFamily: "Inter-Regular",
    color: Colors.black_text_color,
  },
  countContainerStyle: {
    borderRadius: 10,
    borderWidth: 1,
    height: SH(40),
    borderColor: Colors.gray_line_color,
  },
  fileNotesContainerStyle: {
    borderRadius: 10,
    borderWidth: 1,
    height: SH(30),
    borderColor: Colors.gray_line_color,
  },
  fileNotesInputStyle: {
    paddingVertical: SH(5),
    borderWidth: 0,
    paddingHorizontal: SW(5),
    fontSize: SF(10),
    fontFamily: "Inter-Regular",
    color: Colors.black_text_color,
  },
  fileNotesInputContainerStyle: {
    borderWidth: 0,
    height: SH(25),
    borderBottomWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray_line_color,
    paddingVertical: SH(10),
    paddingHorizontal: SW(15),
    fontSize: SF(14),
    fontFamily: "Inter-SemiBold",
    color: Colors.primary,
    backgroundColor: Colors.theme_background,
    width: "100%",
    marginBottom: SH(0),
    height: SH(40),
  },
  searchContainerStyle: {},
});

export default InputTextStyles;
