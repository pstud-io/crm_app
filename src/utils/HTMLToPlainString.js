export function htmlToPlainString(html) {
  if (!html) return "";

  return html
    .replace(/<[^>]*>/g, "") // Remove all HTML tags
    .replace(/&nbsp;/g, " ") // Convert &nbsp; to space
    .replace(/&amp;/g, "&") // Convert &amp; to &
    .replace(/&lt;/g, "<") // Convert &lt; to <
    .replace(/&gt;/g, ">") // Convert &gt; to >
    .replace(/([a-zA-Z0-9])\.([^\s.])/g, "$1. $2") // Add space after period if not followed by one
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim(); // Remove leading/trailing spaces
}
