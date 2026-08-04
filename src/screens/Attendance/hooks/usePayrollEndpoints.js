import axios from "axios";
import { useSelector } from "react-redux";
import apiEndpoint from "../../../config/apiConfig";
import {
  getSummaryCardSubTitle,
  getSummaryCardTitle,
} from "../utils/payrollGeneralFunctions";

export const usePayrollEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const project = useSelector((state) => state.project.selectedProject);
  const project_id = project?.id;

  const getPayrollSummary = async (setLoading, setPayrollSummaryData) => {
    setLoading((prev) => ({ ...prev, fetchingPayrollSummary: true }));
    try {
      const response = await axios.get(
        `${apiEndpoint}/manpower/payroll/summary/`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        const payrollSummary = response.data.result;
        console.log("Payroll summary data", payrollSummary);
        const payrollSummaryData = Object.keys(payrollSummary)
          .filter((key) => key !== "organization_name")
          .map((key) => ({
            title: getSummaryCardTitle(key),
            value: payrollSummary[key] ?? "0",
            subTitle: getSummaryCardSubTitle(key),
          }));
        setPayrollSummaryData([...payrollSummaryData]);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch payroll summary. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, fetchingPayrollSummary: false }));
    }
  };

  const getPayroll = async (setLoading, setPayrollData) => {
    setLoading((prev) => ({ ...prev, fetchingPayroll: true }));
    try {
      const response = await axios.get(`${apiEndpoint}/manpower/payroll/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const payrollData = response.data.result;
        console.log("Payroll Data is", payrollData);
        setPayrollData([...payrollData]);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch payroll data. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, fetchingPayroll: false }));
    }
  };

  return { getPayrollSummary, getPayroll };
};
