import { Linking, Platform } from "react-native";
import badgeColors from "../../../../components/UI/Badge/badgeColors";
import Toast from "react-native-toast-message";

export const getAttendanceStatusColor = (status) => {
  if (status === "present") {
    return badgeColors.success;
  } else if (status === "absent" || status === "regularization rejected") {
    return badgeColors.error;
  } else if (status === "regularization requested") {
    return badgeColors.blueGray;
  } else if (status === "weekend") {
    return badgeColors.purple;
  } else {
    return badgeColors.warning;
  }
};

export const openMapForAttendance = (latitude, longitude) => {
  if (!latitude || !latitude) return;
  const url = Platform.select({
    ios: `http://maps.apple.com/?ll=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
  });

  Linking.openURL(url).catch((err) => {
    console.error("Error opening map:", err);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Unable to open maps",
    });
  });
};

export const timeToSeconds = (time) => {
  if (!time) return;
  const [h, m] = time.split(":").map(Number);
  return h * 3600 + m * 60;
};

export function isDateWeekend(date, weekendDays = []) {
  if (!date) return false;
  const dateToCheck = new Date(date);
  const dayName = dateToCheck.toLocaleDateString("en-US", { weekday: "long" });
  return weekendDays.includes(dayName);
}

export const getTotalWorkingHours = (punchInTime, punchOutTime, date) => {
  if (!punchInTime) return "NA";

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  if (!punchOutTime) {
    if (date === today) {
      return "Punch Out Pending";
    }
    return "Auto Logged Out";
  }

  const [inHours, inMinutes] = punchInTime.split(":").map(Number);
  const [outHours, outMinutes] = punchOutTime.split(":").map(Number);

  const punchInTotalMinutes = inHours * 60 + inMinutes;
  const punchOutTotalMinutes = outHours * 60 + outMinutes;

  if (punchOutTotalMinutes <= punchInTotalMinutes) {
    return "0 hours 0 minutes";
  }

  const diffMinutes = punchOutTotalMinutes - punchInTotalMinutes;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours} hours ${minutes} minutes`;
};

export const getBadgeColoForAttendance = (punchInTime, punchOutTime, date) => {
  const workingStatus = getTotalWorkingHours(punchInTime, punchOutTime, date);

  if (workingStatus === "Punch Out Pending") {
    return badgeColors.warning;
  }

  if (workingStatus === "Auto Logged Out") {
    return badgeColors.error;
  }

  if (workingStatus === "NA") {
    return badgeColors.error;
  }

  return badgeColors.outline; // working hours
};
