import { StylesConfig } from "react-select";
import type { Option } from "./general";

interface ColourOption extends Option {
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

// react-select styles
// https://react-select.com/styles

type IsMulti = false;

export const selectStyle: StylesConfig<ColourOption, IsMulti> = {
    option: (styles, state) => ({
        ...styles,
        color: state.isSelected ? "#000" : "#696969",
        backgroundColor: state.isSelected ? "#9adbf0" : "#fff",
    }),
    control: (styles) => ({
        ...styles,
        padding: "4px",
        boxShadow: "none",
    }),
    singleValue: (styles) => ({ ...styles }),
};

export const selectDarkStyle: StylesConfig<ColourOption, IsMulti> = {
    option: (styles, state) => ({
        ...styles,
        color: state.isSelected ? "#000" : "#dcdcdc",
        backgroundColor: state.isSelected ? "#d3d3d3" : "#2d2d30",
    }),
    control: (styles) => ({
        ...styles,
        backgroundColor: "#2d2d30",
        padding: "4px",
        border: "none",
        boxShadow: "none",
    }),
    singleValue: (styles) => ({ ...styles, color: "#fff" }),
};
