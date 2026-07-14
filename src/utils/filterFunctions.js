export const sortByCreationDate = (array, fieldName, order) => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[fieldName]);
    const dateB = new Date(b[fieldName]);

    return order === "oldest" ? dateA - dateB : dateB - dateA;
  });
};

export const sortByDate = (array, fieldName, order) => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[fieldName]);
    const dateB = new Date(b[fieldName]);

    return order === "recent" ? dateA - dateB : dateB - dateA;
  });
};

export const filterByDueDate = (array, fieldName, dateFilters) => {
  console.log("in filter by due date", array, fieldName, dateFilters);
  const now = new Date();
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  return array.filter((item) => {
    const dueDate = new Date(item[fieldName]);
    return dateFilters.some((filter) => {
      if (filter === ">-14-days-ago") {
        const fourteenDaysAgo = new Date(now);
        fourteenDaysAgo.setDate(now.getDate() - 14);
        return dueDate < fourteenDaysAgo;
      }
      if (filter === "in-last-14-days") {
        const fourteenDaysAgo = new Date(now);
        fourteenDaysAgo.setDate(now.getDate() - 14);
        return dueDate >= fourteenDaysAgo && dueDate < now;
      }
      if (filter === "in-last-7-days") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return dueDate >= sevenDaysAgo && dueDate < now;
      }
      if (filter === "yesterday") {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return isSameDay(dueDate, yesterday);
      }
      if (filter === "today") {
        return isSameDay(dueDate, now);
      }
      if (filter === "tomorrow") {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        return isSameDay(dueDate, tomorrow);
      }
      if (filter === "in-7-days") {
        const next7 = new Date(now);
        next7.setDate(now.getDate() + 7);
        return dueDate >= now && dueDate <= next7;
      }
      if (filter === "in-14-days") {
        const next14 = new Date(now);
        next14.setDate(now.getDate() + 14);
        return dueDate >= now && dueDate <= next14;
      }
      if (filter === "after-14-Days") {
        const next14 = new Date(now);
        next14.setDate(now.getDate() + 14);
        return dueDate > next14;
      }
      return false;
    });
  });
};

export const filterByCompletionDate = (
  array,
  dueDateFieldName,
  completionDateFieldName,
  dateFilters,
) => {
  return array.filter((item) => {
    const dueDate = new Date(item[dueDateFieldName]);
    const completionDate = new Date(item[completionDateFieldName]);

    return dateFilters.some((filter) => {
      if (filter === "on-time") {
        return completionDate <= dueDate;
      }
      if (filter === "late") {
        return completionDate > dueDate;
      }
      return false;
    });
  });
};

export const filterByType = (array, fieldName, typeFilters) => {
  console.log("in filter by type", array, fieldName, typeFilters);
  array = array.filter((item) =>
    typeFilters
      .map((t) => (t === "Snags" ? "snag" : t.toLowerCase()))
      .includes(item[fieldName].toLowerCase()),
  );
  console.log("Array after filter", array);
  return array;
};
