import { View, TouchableOpacity, StyleSheet } from "react-native";
import { getActiveRouteName, SH, SW } from "../../../utils";
import { primaryColors } from "../DesignSystem/colorPalette";
import PlusIcon from "../../../svg/plus-icon";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { openNewFolderBottomSheet } from "../../../screens/Files/utils/filesBottomSheetService";
import { openNewManPowerBottomSheet } from "../../../screens/ManPower/utils/manPowerBottomSheetService";
import { openNewPRBottomSheet } from "../../../screens/PurchaseRequest/Utils/addPRBottomSheetService";
import { openNewReimbursementBottomSheet } from "../../../screens/Reimbursement/utils/reimbursementBottomSheetService";
import { openNewExpenseBottomSheet } from "../../../screens/Expenses/utils/expensesBottomSheetService";
import { openQuickUpdateBottomSheet } from "../../../screens/Home/Tab/Activities/utils/activityBottomSheetService";
import { openRequestLeaveBottomSheet } from "../../../screens/HMRS/utils/requestLeaveBottomSheetRef";
import { openNewWareHouseBottomSheet } from "../../../screens/WareHouse/utils/useWareHouseBottomSheetService";
import { openNewMRNBottomSheet } from "../../../screens/Eleganz/Utils/mrnBottomSheetService";
import { openNewTimeSheetBottomSheet } from "../../../screens/TimeSheet/utils/timeSheetBottomSheetService";
import { openAddFilesToChecklistBottomSheet } from "../../../screens/Checklist/utils/checklistBottomSheetService";
const CustomAddButton = () => {
  const project = useSelector((state) => state.project);
  const customAddButton = useSelector(
    (state) => state.customAddButton.customAddButton,
  );
  const navigation = useNavigation();

  const handlePress = () => {
    switch (customAddButton.onPress) {
      // case "TasksStack":
      case "ADD_TASK":
        return navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "TasksStack",
            params: {
              screen: "AddTaskFromTasksTab",
              params: {
                voiceInput: false,
                onRefresh: () => {},
              },
            },
          },
        });

      case "ADD_ISSUE_TASK":
        return navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "TasksStack",
            params: {
              screen: "AddTaskFromTasksTab",
              params: {
                voiceInput: false,
                task_type: "issue",
                onRefresh: () => {},
              },
            },
          },
        });

      case "ADD_NOTE":
        return navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "AddNote",
            params: {
              project_id: project.id,
              project,
            },
          },
        });

      case "ADD_FINANCE":
        return navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "AddPayment",
          },
        });

      case "ADD_FOLDER":
        return openNewFolderBottomSheet();

      case "ADD_FILES_TO_CHECKLIST":
        return openAddFilesToChecklistBottomSheet();

      case "ADD_MANPOWER":
        return openNewManPowerBottomSheet();

      case "ADD_PR":
        return openNewPRBottomSheet();

      case "ADD_REIMBURSEMENT":
        return openNewReimbursementBottomSheet();

      case "ADD_EXPENSE":
        return openNewExpenseBottomSheet();

      case "ADD_QUICK_UPDATE":
        return openQuickUpdateBottomSheet();

      case "ADD_LEAVE":
        return openRequestLeaveBottomSheet();

      case "ADD_WAREHOUSE":
        return openNewWareHouseBottomSheet();

      case "ADD_MRN":
        return openNewMRNBottomSheet();

      case "ADD_TIMESHEET":
        return openNewTimeSheetBottomSheet();

      case "DO_NOTHING":
        return;

      default:
        return {
          cannotAdd: true,
          onPress: () => {},
        };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={handlePress}
      activeOpacity={customAddButton.cannotAdd ? 1 : 0.8}
    >
      <View
        style={[
          styles.button,
          customAddButton.cannotAdd && {
            backgroundColor: primaryColors.gray[600],
            opacity: 0.5,
          },
        ]}
      >
        <PlusIcon
          width={SH(40)}
          height={SH(40)}
          fill={"white"}
          stroke={"white"}
          strokeWidth={SW(1)}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    top: -SH(20), // 👈 lifts it above tab bar
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "20%",

    // position: "absolute",
  },
  button: {
    width: SH(58),
    height: SH(58),
    borderRadius: 999,
    backgroundColor: primaryColors.brand[1000],
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#0A0D12",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default CustomAddButton;
