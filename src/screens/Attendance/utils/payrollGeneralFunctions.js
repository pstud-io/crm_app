import { Alert, Linking } from "react-native";
import badgeColors from "../../../components/UI/Badge/badgeColors";
import axios from "axios";
import Toast from "react-native-toast-message";

export const getSummaryCardTitle = (keyName) => {
  switch (keyName) {
    case "gross_annual_salary":
      return "Total Annual Salary";

    case "net_monthly_salary":
      return "Monthly In Hand";

    case "total_deductions":
      return "Total Deductions";

    case "variable_pay":
      return "Variable Pay";

    case "wallet_balance":
      return "My Wallet";

    default:
      return "";
  }
};

export const getSummaryCardSubTitle = (keyName) => {
  switch (keyName) {
    case "gross_annual_salary":
      return "Per Year";

    case "net_monthly_salary":
      return "Per Month";

    case "total_deductions":
      return "Per Month";

    case "variable_pay":
      return "Vests Dec 31 2025";

    case "wallet_balance":
      return "Current Balance";

    default:
      return "";
  }
};

export const getMonth = (monthNumber) => {
  switch (monthNumber) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
    default:
      return "";
  }
};

export const getPayrollStatusColor = (status) => {
  if (status === "paid") {
    return badgeColors.success;
  } else if (status === "pending") {
    return badgeColors.warning;
  } else if (status === "rejected") {
    return badgeColors.error;
  } else {
    return badgeColors.outline;
  }
};

export const handleDownloadPayroll = async (
  setLoading,
  payrollID,
  organizationID
) => {
  setLoading((prev) => ({ ...prev, downloadingPayroll: true }));
  
  const payload = {
    organization_id: organizationID,
    payroll_id: payrollID,
  };

  try {
    const response = await axios.post(
      "https://automation.projectstudio.ai/webhook/484e082e-23cd-49b0-9808-bf955630590b",
      payload
    );

    // Check if response data exists and has the download_url
    const downloadUrl = response?.data?.[0]?.download_url;

    if (downloadUrl) {
      const canOpen = await Linking.canOpenURL(downloadUrl);
      if (canOpen) {
        await Linking.openURL(downloadUrl);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Opening payroll document...',
        });
      } else {
        throw new Error("Cannot open URL");
      }
    } else {
      // Handle cases where the webhook responds but doesn't provide a link
      throw new Error("No download link provided");
    }

  } catch (error) {
    console.error("Download error:", error);
    
    // 1. Define your friendly message
    let errorMessage = "Failed to download payroll. Please try again.";
    
    // 2. Refine message based on response
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = "Payroll document is not available for this entry.";
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "Network error. Please check your connection.";
    }

    // 3. PASS THE STRING, NOT THE ERROR OBJECT
    Toast.show({
      type: 'error',
      text1: 'Download Failed',
      text2: errorMessage, // Use the variable here
    });
    
  } finally {
    setLoading((prev) => ({ ...prev, downloadingPayroll: false }));
  }
};
