export interface Option {
    readonly label: string;
    readonly value: string;
}

export const langOptions: Option[] = [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
];

export const logicOptions: Option[] = [
    { label: "Generic", value: "generic" },
    { label: "Aggregator", value: "aggregator" },
];

export const plusSign = "✚";
export const editSign = "🖉";
export const editOKSign = "✔";
export const trashSign = "🗑";

// return light/dark style for components
export const setColorStyle = (
    colorMode: string,
    light: string,
    dark: string,
) => (colorMode === "light" ? light : dark);
