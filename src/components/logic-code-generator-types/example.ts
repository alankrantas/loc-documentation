import type { BlockOption, EditorParamsType } from "./editor-options";
import { langOptions, logicOptions } from "./general";
import { agentOptionsJS } from "./logic-templates";

export const exampleEditorOption: EditorParamsType = {
    lang: langOptions[0],
    type: logicOptions[0],
    comment: true,
};

// the label name has to be the same in logic-template.ts
const option0 = agentOptionsJS.filter(
    (item) => item.label == "Custom block",
)[0];
const option1 = agentOptionsJS.filter(
    (item) => item.label == "[Payload] read payload body and parse as JSON",
)[0];
const option2 = agentOptionsJS.filter(
    (item) => item.label == "[Logging] log a JSON object",
)[0];
const option3 = agentOptionsJS.filter(
    (item) => item.label == "[Session Storage] write a JSON value",
)[0];

export const exampleBlocks: BlockOption[] = [
    {
        option: {
            label: option0.label,
            value: option0.value,
        },
        editing: false,
        userValue: `// this is the payload JSON parser example for which
// you can find in most of the example in the documentation.
// by creating blocks with pre-defined snippets, you can
// quickly generate a template for your need.`,
    },
    {
        option: {
            label: option1.label,
            value: option1.value,
        },
        editing: false,
        userValue: option1.value,
    },
    {
        option: {
            label: option2.label,
            value: option2.value,
        },
        editing: false,
        userValue: option2.value
            .replace('"message"', "parsed")
            .replace("message", "parsed"),
    },
    {
        option: {
            label: option3.label,
            value: option3.value,
        },
        editing: false,
        userValue: `await SessionStorageAgent.putJson("parsed", parsed);`,
    },
];
