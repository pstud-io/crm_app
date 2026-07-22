export const groupAdditionalFieldsBySection = (additionalFields: any[]) => {
  return additionalFields.reduce<Record<string, any[]>>((acc, field) => {
    const section = field.additional_field?.section || "Additional Fields";

    if (!acc[section]) {
      acc[section] = [];
    }

    acc[section].push(field);

    return acc;
  }, {});
};
