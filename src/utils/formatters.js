export function formatISODateTime(isoDateStr, output = "date") {
  try {
    const date = new Date(isoDateStr);
    return format(
      date,
      output == "date" ? "MMM dd, yyyy" : "MMM dd, yyyy HH:mm a",
    );
  } catch (error) {
    return isoDateStr;
  }
}

export function stringFrom(value, defaultValue = "") {
  if (typeof value === "string") return value;
  else if (typeof value === "number") return value.toString();
  else return defaultValue;
}
export function arrayFrom(data) {
  if (data === null) return [];
  else if (Array.isArray(data)) return data;
  else return [];
}
export function boolFrom(value) {
  if (typeof value === "boolean") return value;
  else if (typeof value === "number") return value === 1;
  else if (typeof value === "string")
    return value.toLowerCase() === "true" || value === "1";
  return false;
}

export function formatContacts(contact) {
  return {
    id: stringFrom(contact.id),
    createdTimestamp: formatISODateTimeToTimeStamp(
      stringFrom(contact.created_on),
    ),
    createdOn: formatISODateTime(stringFrom(contact.created_on)),
    name: stringFrom(contact.contact_details.name),
    phone: stringFrom(contact.contact_details.phone),
    email: stringFrom(contact.contact_details.email),
    countryCode: stringFrom(contact.contact_details.country_code),
    phoneWithCountryCode: `${contact.contact_details.country_code} ${contact.contact_details.phone}`,
    designation: stringFrom(contact.designation),
    userId: stringFrom(contact.fk_user),
    authGroups: arrayFrom(contact.user_details.groups),
    isAdmin: boolFrom(contact.is_admin),
  };
}
