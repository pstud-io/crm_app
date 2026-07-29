export const groupAdditionalFieldsBySection = (additionalFields: any[]) => {
  return additionalFields.reduce<Record<string, any[]>>((acc, field) => {
    const section =
      field.additional_field?.section || field?.section || "Additional Fields";

    if (!acc[section]) {
      acc[section] = [];
    }

    acc[section].push(field);

    return acc;
  }, {});
};

export const formatEventType = (eventType: string): string => {
  return eventType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getDayAndMonth = (
  dateString: string,
): { day: string; month: string } => {
  const date = new Date(dateString);

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
  };
};

export interface TimelineGroup<T> {
  date: string;
  items: T[];
}

export const groupTimelineByDate = <T extends { created_on: string }>(
  data: T[],
): TimelineGroup<T>[] => {
  const groups = new Map<string, T[]>();

  for (const item of data) {
    const date = item.created_on.slice(0, 10); // YYYY-MM-DD

    if (!groups.has(date)) {
      groups.set(date, []);
    }

    groups.get(date)!.push(item);
  }

  return Array.from(groups.entries()).map(([date, items]) => ({
    date,
    items,
  }));
};
