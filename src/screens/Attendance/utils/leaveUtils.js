import badgeColors from "../../../components/UI/Badge/badgeColors";

export const isFutureOrToday = (dateString) => {
    if (!dateString) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leaveDate = new Date(dateString);
    leaveDate.setHours(0, 0, 0, 0);

    return leaveDate.getTime() >= today.getTime();
  };
  
export  const calculateDays = (startDateString, endDateString) => {
    if (!startDateString || !endDateString) return "-";
    
    const start = Date.parse(startDateString);
    const end = Date.parse(endDateString);
    
    if (isNaN(start) || isNaN(end) || start > end) return "-";

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const diffTime = end - start;
    const diffDays = Math.round(diffTime / MS_PER_DAY);
    
    return diffDays + 1;
};
  
export const getLeaveStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return badgeColors.success;
    case 'rejected':
      return badgeColors.error;
    case 'pending':
      return badgeColors.warning;
    default:
      return badgeColors.gray;
  }
};

export const getLeaveTypeDisplayText = (type) => {
  switch (type) {
    case 'casual':
      return 'Casual Leave';
    case 'sick':
      return 'Sick Leave';
    case 'Absent':
      return 'Absent';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};