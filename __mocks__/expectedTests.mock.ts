import { TestSuiteInfo } from "vscode-test-adapter-api";

export const mock = {
  type: "suite",
  id: "root",
  label: "root",
  children: [
    {
      id: "suite1",
      label: "suite1",
      type: "suite",
      file: ".",
      children: [
        {
          id: "suite1 test1",
          label: "test1",
          type: "test",
          file: ".",
        },
      ],
    },
    {
      id: "suite2",
      label: "suite2",
      type: "suite",
      file: ".",
      children: [
        {
          id: "suite2 innersuite1",
          label: "innersuite1",
          type: "suite",
          file: ".",
          children: [
            {
              id: "suite2 innersuite1 innersuite2",
              label: "innersuite2",
              type: "suite",
              file: ".",
              children: [
                {
                  id: "suite2 innersuite1 innersuite2 test5",
                  label: "test5",
                  file: ".",
                  type: "test",
                },
              ],
            },
            {
              id: "suite2 innersuite1 test3",
              label: "test3",
              file: ".",
              type: "test",
            },
            {
              id: "suite2 innersuite1 test4",
              label: "test4",
              file: ".",
              type: "test",
            },
          ],
        },
        {
          id: "suite2 test2",
          label: "test2",
          file: ".",
          type: "test",
        },
      ],
    },
    {
      id: "suite3",
      label: "suite3",
      type: "suite",
      file: ".",
      children: [
        {
          id: "suite3 innersuite3",
          label: "innersuite3",
          type: "suite",
          file: ".",
          children: [
            {
              id: "suite3 innersuite3 test6",
              label: "test6",
              file: ".",
              type: "test",
            },
          ],
        },
      ],
    },
  ] as TestSuiteInfo[],
} as TestSuiteInfo;
