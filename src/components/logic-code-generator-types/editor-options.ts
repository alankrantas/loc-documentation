import type { Option } from "./general";

export type BlockOption = {
    option: Option;
    editing: boolean;
    userValue: string;
};

export interface EditorParamsType {
    lang: Option;
    type: Option;
    comment: boolean;
    fullImport: boolean;
}

const defaultFontSize = 14;
const defaultLineHeight = 1.5;

// options for monaco editor
// https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IEditorOptions.html
export const editorOptions = {
    automaticLayout: true,
    contextmenu: false,
    dragAndDrop: true,
    dropIntoEditor: {
        enabled: true,
    },
    detectIndentation: false,
    fixedOverflowWidgets: false,
    fontFamily: "Fira Mono",
    fontSize: defaultFontSize,
    formatOnPaste: true,
    formatOnType: true,
    lineHeight: defaultLineHeight,
    minimap: {
        enabled: false,
    },
    padding: {
        top: 8,
        button: 8,
    },
    readOnly: false,
    scrollbar: {
        verticalScrollbarSize: 9,
        horizontalScrollbarSize: 9,
        alwaysConsumeMouseWheel: false,
    },
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    tabSize: 4,
    quickSuggestions: true,
    wordBasedSuggestions: false,
};

export const diagnosticsOptions = {
    noSemanticValidation: false,
    noSuggestionDiagnostics: false,
    noSyntaxValidation: false,
};

export const getCompilerOptions = (strict: boolean) => {
    return {
        allowNonTsExtensions: true,
        allowUnreachableCode: !strict,
        allowUnusedLabels: !strict,
        checkJs: true,
        noFallthroughCasesInSwitch: strict,
        noImplicitAny: strict,
        noImplicitOverride: strict,
        noImplicitReturns: strict,
        noImplicitThis: strict,
        noPropertyAccessFromIndexSignature: strict,
        noUncheckedIndexedAccess: strict,
        noUnusedLocals: strict,
        noUnusedParameters: strict,
        skipLibCheck: true,
        strict: strict,
        target: 99, // ESNext
        noEmit: true,
    };
};

// calculating editor height by code lines
export const calculateCodeHeight = (
    code: string,
    editorOptions: any,
    minHeight: number,
    maxHeight?: number,
) => {
    const lines =
        code.trim() === ""
            ? 0
            : Math.ceil(code.trim().split(/\r?\n/).length + 1);
    const lineHeight =
        (editorOptions?.fontSize || defaultFontSize) *
        (editorOptions?.lineHeight || defaultLineHeight);
    return `${Math.max(minHeight, Math.min(maxHeight ? maxHeight : 500, lines)) * lineHeight}px`;
};

export const changeOptionMsg =
    "WARNING: your blocks and code will be reset. Continue?";

export const syncBlockMsg =
    "WARNING: your manually edited code will be discarded (re-synced with blocks). Continue?";
