export { cn } from "cn";

export function submitOnEnter(submit: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    submit();
  };
}

const CURSOR_COLORS = [
  "#1558c9",
  "#3d70c4",
  "#5688df",
  "#6f8fd1",
  "#8ba9e8",
  "#b8c8e8",
  "#64748b",
  "#929bad",
];

export function colorForUser(userId: string) {
  let hash = 0;
  for (const char of userId) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}
