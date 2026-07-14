import { navigationRef } from "../navigation/NavigationService";
import * as FileSystem from "expo-file-system";

export const generateTimestampString = () => {
  const now = new Date();
  return now.toISOString().replace(/[:.-]/g, ""); // Remove special characters for a clean string
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateWithoutTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTimeHHMM = (date) => {
  if (!(date instanceof Date)) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const formatTime12Hour = (time) => {
  if (!time) return "NA";

  const [hourStr, minute] = time.split(":");
  let hour = Number(hourStr);

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // converts 0 → 12

  return `${hour}:${minute} ${period}`;
};

export const getDateAndMonth = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

export const newDateToYYYYMMDD = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const dateToYYYYMMDD = (inputDate) => {
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const badFormatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
  // " " +
  // date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
};

export const truncate = (text, length) => {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

export function parseTaggedText(text) {
  // Match {@}[Name](id) and replace with just the Name inside []
  return text.replace(/\{@}\[([^\]]+)\]\([^)]+\)/g, "$1");
}
export const capitalizeEachWord = (text) => {
  if (!text) return "";

  return text
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function getActiveRouteName(route) {
  if (!route) return "";
  if (!route.params) {
    return route.name;
  }
  while (route.params && route.params.screen) {
    route = route.params;
  }

  return route.screen;
}

export const formatToDisplayDateWithTime = (isoDateString) => {
  const date = new Date(isoDateString);

  const dateOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  };

  const timeOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString("en-US", dateOptions);

  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  return `${formattedDate}, ${formattedTime}`;
};

export async function filterApprovalHierarchy(
  approvalHierarchy,
  projectUsers,
  setApprovalHierarchy,
) {
  const availableHierarchy = approvalHierarchy?.filter((item) => {
    if (item.approver_type === "organisation_contact") {
      const contactId = item?.organization_contact_details?.id;

      return projectUsers.some((user) => user?.id === contactId);
    }

    if (item.approver_type === "role") {
      const roleName = item?.role_details?.role_name?.toLowerCase();

      return projectUsers.some(
        (user) =>
          user?.user_role_details?.role_name?.toLowerCase() === roleName,
      );
    }

    return []; // if type doesn't match anything
  });

  // setApprovalHierarchy([...availableHierarchy]);
  setApprovalHierarchy(approvalHierarchy);
}

export function formatAdjustedDate(dateTimeString) {
  if (!dateTimeString) return "N/A";
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "N/A";
    // Subtract 5 hours 30 minutes (in milliseconds)
    date.setTime(date.getTime() - (5 * 60 + 30) * 60 * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, "0");
    return `${day} ${month} ${year}, ${strHours}:${minutes} ${ampm}`;
  } catch {
    return "N/A";
  }
}
export const persistMediaFiles = async (selectedMedia = []) => {
  return Promise.all(
    selectedMedia.map(async (file) => {
      try {
        if (!file?.uri?.startsWith("file://")) {
          return file;
        }

        const fileName =
          file.fileName ||
          file.name ||
          file.uri.substring(file.uri.lastIndexOf("/") + 1);

        const ext = fileName.substring(fileName.lastIndexOf("."));
        const uniqueFileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)}${ext}`;

        const mediaFolder = FileSystem.documentDirectory + "sync/";

        const folderInfo = await FileSystem.getInfoAsync(mediaFolder);

        if (!folderInfo.exists) {
          await FileSystem.makeDirectoryAsync(mediaFolder, {
            intermediates: true,
          });
        }

        const destination = mediaFolder + uniqueFileName;

        const destinationInfo = await FileSystem.getInfoAsync(destination);

        if (!destinationInfo.exists) {
          await FileSystem.copyAsync({
            from: file.uri,
            to: destination,
          });
        }

        const verify = await FileSystem.getInfoAsync(destination);

        console.log("Verifying from persist function isself", {
          from: file.uri,
          to: destination,
          exists: verify.exists,
          size: verify.size,
        });
        return {
          ...file,
          uri: destination,
          relativePath: `sync/${uniqueFileName}`,
        };
      } catch (err) {
        console.log("Persist media error:", err);
        return file;
      }
    }),
  );
};
