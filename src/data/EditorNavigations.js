export const editorNavigations = [
  {
    data: "Overview",
    caption: "",
  },
  {
    data: "Preview",
    caption: "",
  },
  {
    data: [
      {
        data: "Chapter-1",
        caption: "The time has come",
        to: {
          name: "write-editor",
          query: { manuscript_id: "abc" },
        },

        active: false,
        id: "abc",
      },
      {
        data: "Chapter-2",
        caption: "The Deed",
        to: {
          name: "write-editor",
          query: { manuscript_id: "edf" },
        },
        active: true,
        id: "efg",
      },
      {
        data: "Add Chapter",
        caption: "",
      },
    ],
    caption: "",
    name: "Chapters",
  },
];
