
const PALETTE = [
  { bg: "#EAF1FB", fg: "#2C5AA0" },
  { bg: "#FBEFE7", fg: "#B0592A" },
  { bg: "#EAF6EF", fg: "#237355" },
  { bg: "#F5EDFB", fg: "#7141A8" },
  { bg: "#FBEAEE", fg: "#A83452" },
  { bg: "#EEF3E3", fg: "#5A7A24" },
  { bg: "#E9F5F7", fg: "#1E7E8C" },
];

export function colorForDepartment(name) {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
