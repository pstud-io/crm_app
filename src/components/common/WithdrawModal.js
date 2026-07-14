// import React from "react";
// import { Modal, Text, View, StyleSheet, TextInput } from "react-native";
// import { Colors, SH, SW, SF } from "../../utils";
// import { InputTextStyles } from "../../styles/InputTextStyles";
// import { Formik } from "formik";
// import * as yup from "yup";
// import Spacing from "./Spacing";
// import SuccessTickOutlineIcon from "../../svg/success-outline";
// import { Button } from "../Button";

// const WithdrawModal = ({
//   visible,
//   title,
//   message,
//   onOkayPress,
//   onBackPress,
//   loading,
//   isApproved,
// }) => {
//   const validationSchema = yup.object().shape({
//     amount: yup
//       .number()
//       .required("Amount is required")
//       .positive("Amount must be positive")
//       .integer("Amount must be an integer"),
//   });

//   //console.log('isApproved', isApproved);

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onBackPress}
//     >
//       <View style={styles.centeredView}>
//         <View style={styles.modalView}>
//           {isApproved ? (
//             <>
//               <Spacing space={SH(10)} />
//               <SuccessTickOutlineIcon
//                 width={SH(51)}
//                 height={SH(51)}
//                 fill={Colors.primary}
//               />
//               <Spacing space={SH(20)} />
//               <Text style={styles.successModalTitle}>
//                 Request Sent to Admin
//               </Text>

//               <Text style={[styles.successModalMessage]}>
//                 Please wait for the admin to approve your request.
//               </Text>
//               <Button
//                 title="Okay"
//                 onPress={onBackPress}
//                 buttonStyle={styles.confirmButton}
//                 containerStyle={{ width: "100%" }}
//               />
//             </>
//           ) : (
//             <>
//               <Text style={styles.modalTitle}>{title}</Text>
//               <Text style={styles.modalMessage}>{message}</Text>

//               <Formik
//                 initialValues={{ amount: "" }}
//                 validationSchema={validationSchema}
//                 onSubmit={(values) => {
//                   console.log(values.amount);
//                   onOkayPress(values.amount); // Pass the amount to the callback function
//                 }}
//               >
//                 {({
//                   handleChange,
//                   handleBlur,
//                   handleSubmit,
//                   values,
//                   errors,
//                   touched,
//                 }) => (
//                   <View style={{ width: "100%" }}>
//                     <TextInput
//                       style={InputTextStyles.input}
//                       placeholder="Enter the amount"
//                       placeholderTextColor={Colors.gray_text_color}
//                       keyboardType="numeric"
//                       keyboardAppearance="light"
//                       onChangeText={handleChange("amount")}
//                       onBlur={handleBlur("amount")}
//                       value={values.amount}
//                     />
//                     {touched.amount && errors.amount && (
//                       <Text
//                         style={{
//                           color: "red",
//                           fontFamily: "Inter-Regular",
//                           fontSize: SF(11),
//                           marginTop: SH(-15),
//                           marginBottom: SH(5),
//                         }}
//                       >
//                         {errors.amount}
//                       </Text>
//                     )}
//                     <View style={styles.buttonsView}>
//                       <Button
//                         title="Request Withdraw"
//                         onPress={handleSubmit}
//                         buttonStyle={styles.confirmButton}
//                         loading={loading}
//                       />
//                     </View>
//                   </View>
//                 )}
//               </Formik>
//             </>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalView: {
//     backgroundColor: Colors.theme_background,
//     borderRadius: 10,
//     padding: SW(20),
//     width: "90%",
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontFamily: "Inter-Bold",
//     fontSize: SF(18),
//     marginBottom: SH(5),
//     textAlign: "center",
//     color: Colors.primary,
//   },
//   successModalTitle: {
//     fontFamily: "Inter-Regular",
//     fontSize: SF(15),
//     textAlign: "center",
//     color: Colors.black_text_color,
//   },
//   modalMessage: {
//     fontFamily: "Inter-Regular",
//     fontSize: SF(14),
//     marginBottom: SH(10),
//     textAlign: "center",
//     color: Colors.gray_text_color,
//   },
//   successModalMessage: {
//     fontFamily: "Inter-Regular",
//     fontSize: SF(15),
//     marginBottom: SH(20),
//     textAlign: "center",
//     color: Colors.primary,
//   },
//   buttonsView: {
//     flexDirection: "row",
//     justifyContent: "center",
//     borderWidth: 0,
//     width: "100%",
//   },
//   confirmButton: {
//     paddingHorizontal: SW(12),
//     minWidth: SW(80),
//   },
//   cancelButton: {
//     paddingHorizontal: SW(12),
//     backgroundColor: Colors.gray_line_color,
//     minWidth: SW(80),
//   },
// });

// export default WithdrawModal;
