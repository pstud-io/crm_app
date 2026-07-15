import { Alert } from "react-native";

/**
 * Generates a clean timestamp string for unique file naming
 */
export const generateTimestampString = () => {
  const now = new Date();
  return now.toISOString().replace(/[:.-]/g, "");
};

/**
 * Helper to remove an item from the media array
 */
export const handleDeleteImage = (index, setSelectedMedia) => {
  setSelectedMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
};

/**
 * Handles the logic for selecting media from the library
 */
export const processSelectedMedia = (assets, setSelectedMedia) => {
  const selectedFiles = assets.map((file) => ({
    name: file.name || file.fileName || `FILE_${Date.now()}`,
    uri: file.uri,
    size: file.size,
    type: file.mimeType || "application/octet-stream",
  }));

  setSelectedMedia((prevMedia) => {
    const newMedia = selectedFiles.filter(
      (file) => !prevMedia.some((media) => media.uri === file.uri)
    );
    if (newMedia.length === 0) {
      Alert.alert("No New Files", "All selected files are already in your selection.");
      return prevMedia;
    }
    return [...prevMedia, ...newMedia];
  });
};

export const stripMarkdown = (text) => {
  if (!text) return "";
  return text
    // 1. Remove HTML tags (e.g., <p>, <li>)
    .replace(/<\/?[^>]+(>|$)/g, "") 
    // 2. Remove Markdown formatting characters
    .replace(/[#*`_~]/g, "")           
    // 3. Replace links [text](url) with just text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") 
    // 4. Remove bullet points and numbered lists
    .replace(/^[ \t]*[-+*][ \t]+/gm, "")      
    .replace(/^[ \t]*\d+\.[ \t]+/gm, "")       
    // 5. Replace table pipes and newlines with spaces for a single-line flow
    .replace(/\|/g, " ")
    .replace(/\n+/g, " ")
    .trim();
};