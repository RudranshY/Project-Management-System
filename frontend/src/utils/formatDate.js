export function formatDate(date) {
  if (!date) {
    return "Not set";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}