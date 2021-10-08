export const editorHotkeys = [
  [
    {
      keys: ["Ctrl", "F11"],
      condition: "",
      result: "Activate Zen Mode",
      header: "Global",
    },
    {
      keys: ["Ctrl", "/"],
      condition: "",
      result: "Focus on the editor",
    },
  ],
  [
    {
      keys: ["Ctrl", "&#8595;"],
      condition: "",
      result: "Jump to next block",
      header: "Accessiblity (Editor)",
    },
    {
      keys: ["Ctrl", "&#8593;"],
      condition: "",
      result: "Jump to previous block",
    },
    {
      keys: ["Ctrl", "&#8594;"],
      condition: "",
      result: "Jump to next word",
    },
    {
      keys: ["Ctrl", "&#8592;"],
      condition: "",
      result: "Jump to previous word",
    },
  ],
  [
    {
      keys: ["Ctrl", "Shift", "&#8595;"],
      condition: "",
      result: "Select till end of block",
      header: "Selection (Editor)",
    },
    {
      keys: ["Ctrl", "Shift", "&#8595;"],
      condition: "Double pressed",
      result: "Select block below",
      header: "Selection (Editor)",
    },
    {
      keys: ["Ctrl", "Shift", "&#8593;"],
      condition: "",
      result: "Select till start of block",
    },

    {
      keys: ["Ctrl", "Shift", "&#8593;"],
      condition: "Double Pressed",
      result: "Select block above",
    },
    {
      keys: ["Ctrl", "Shift", "&#8594;"],
      condition: "",
      result: "Select next word",
    },
    {
      keys: ["Ctrl", "Shift", "&#8592;"],
      condition: "",
      result: "Select previous word",
    },
    {
      keys: ["Shift", "&#8594;"],
      condition: "",
      result: "Select next letter",
    },
    {
      keys: ["Shift", "&#8592;"],
      condition: "",
      result: "Select previous letter",
    },

    {
      keys: ["Ctrl", "A"],
      condition: "",
      result: "Select all in the block",
    },
  ],
  [
    {
      keys: ["Tab"],
      condition: "Old Block",
      result: "Open up toolbar",
      header: "General (Editor)",
    },
    {
      keys: ["Tab"],
      condition: "New/Blank Block",
      result: "Open up block selection",
    },
  ],
  [
    {
      keys: ["Enter"],
      condition: "",
      result: "Add new bullet",
      header: "List Manipulation (Editor)",
    },
    {
      keys: ["Tab"],
      condition: "",
      result: "Indent bullet point",
    },
    {
      keys: ["Shift", "Tab"],
      condition: "",
      result: "Outdent bullet point",
    },
  ],
  [
    {
      keys: ["Ctrl", "C"],
      condition: "",
      result: "Copy",
      header: "Text Manipulation (Editor)",
    },
    {
      keys: ["Ctrl", "V"],
      condition: "",
      result: "Paste",
    },
    {
      keys: ["Ctrl", "Z"],
      condition: "",
      result: "Undo",
    },
    {
      keys: ["Ctrl", "Y"],
      condition: "",
      result: "Redo",
    },
    {
      keys: ["Ctrl", "B"],
      condition: "",
      result: "Bold",
    },
    {
      keys: ["Ctrl", "I"],
      condition: "",
      result: "Italic",
    },
    {
      keys: ["Ctrl", "U"],
      condition: "",
      result: "Underline",
    },
    {
      keys: ["Ctrl", "K"],
      condition: "",
      result: "Link",
    },
    {
      keys: ["Ctrl", "M"],
      condition: "",
      result: "Marker",
    },
  ],
];
