export function removeSpaces(text: string) {
  const cleaned = text.replace(/\s+/g, "");
  // const isValid = /^\d{10}$/.test(cleaned);
  console.log("cleaned username", cleaned);
  // console.log("Is valid", isValid);
  return cleaned;
}
