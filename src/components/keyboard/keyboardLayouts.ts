// Mac Keyboard Layout
// Note: The "fn" key cannot be detected by browsers - it's a hardware-level modifier
// We replace it with "Globe" key (which some Macs report) or remove it from required keys
export const macKeyboardLayout = [
  ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Control", "Alt", "Meta", " ", "Meta", "Alt", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"],
];

// Windows Keyboard Layout
export const windowsKeyboardLayout = [
  ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Control", "Meta", "Alt", " ", "Alt", "Meta", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"],
];

// Mac key display mappings
export const macKeyDisplay: Record<string, string> = {
  " ": "Space",
  "Escape": "Esc",
  "Backspace": "⌫",
  "Tab": "Tab",
  "CapsLock": "Caps",
  "Enter": "Return",
  "Shift": "⇧ Shift",
  "Control": "⌃ Control",
  "Meta": "⌘",
  "Alt": "⌥ Option",
  "ArrowLeft": "←",
  "ArrowUp": "↑",
  "ArrowDown": "↓",
  "ArrowRight": "→",
};

// Windows key display mappings
export const windowsKeyDisplay: Record<string, string> = {
  " ": "Space",
  "Escape": "Esc",
  "Backspace": "⌫",
  "Tab": "Tab",
  "CapsLock": "Caps",
  "Enter": "Enter",
  "Shift": "Shift",
  "Control": "Ctrl",
  "Meta": "⊞ Win",
  "Alt": "Alt",
  "ArrowLeft": "←",
  "ArrowUp": "↑",
  "ArrowDown": "↓",
  "ArrowRight": "→",
};

// Mac key widths
export const macKeyWidths: Record<string, string> = {
  "Backspace": "w-24",
  "Tab": "w-16",
  "CapsLock": "w-20",
  "Enter": "w-24",
  "Shift": "w-28",
  "Control": "w-16",
  "Meta": "w-14",
  "Alt": "w-18",
  " ": "w-64",
};

// Windows key widths
export const windowsKeyWidths: Record<string, string> = {
  "Backspace": "w-24",
  "Tab": "w-16",
  "CapsLock": "w-20",
  "Enter": "w-24",
  "Shift": "w-28",
  "Control": "w-16",
  "Meta": "w-14",
  "Alt": "w-14",
  " ": "w-64",
};

export type KeyboardType = "mac" | "windows";

export const getKeyboardLayout = (type: KeyboardType) => {
  return type === "mac" ? macKeyboardLayout : windowsKeyboardLayout;
};

export const getKeyDisplay = (key: string, type: KeyboardType) => {
  const displayMap = type === "mac" ? macKeyDisplay : windowsKeyDisplay;
  return displayMap[key] || key;
};

export const getKeyWidth = (key: string, type: KeyboardType) => {
  const widthMap = type === "mac" ? macKeyWidths : windowsKeyWidths;
  return widthMap[key] || "w-12";
};
