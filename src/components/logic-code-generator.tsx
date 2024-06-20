import {
    FunctionComponent,
    lazy,
    Suspense,
    useState,
    useEffect,
    useRef,
} from "react";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "../css/logic-code-generator.module.css";

// https://react-select.com/home
import Select from "react-select";
import type { ActionMeta } from "react-select";

// https://github.com/suren-atoyan/monaco-react
import Editor from "@monaco-editor/react";
import type { OnMount, OnChange } from "@monaco-editor/react";

const LogicUnitTesterParams = lazy(
    () => import("./logic-code-unit-tester-params"),
);
import DownloadLink from "./download-link";

import {
    langOptions,
    logicOptions,
    plusSign,
    editSign,
    editOKSign,
    trashSign,
} from "./logic-code-generator-types/general";

import type { Option } from "./logic-code-generator-types/general";
import { setColorStyle } from "./logic-code-generator-types/general";
import {
    selectStyle,
    selectDarkStyle,
} from "./logic-code-generator-types/select-options";
import type {
    BlockOption,
    EditorParamsType,
} from "./logic-code-generator-types/editor-options";
import {
    editorOptions,
    diagnosticsOptions,
    getCompilerOptions,
    calculateCodeHeight,
    changeOptionMsg,
    syncBlockMsg,
} from "./logic-code-generator-types/editor-options";
import {
    AgentOptionsType,
    genericModuleListJS,
    genericModuleListTS,
    aggregatorModuleList,
    templateGenericJS,
    templateGenericTS,
    templateAggregatorJS,
    templateAggregatorTS,
    agentOptionsJS,
    agentOptionsTS,
} from "./logic-code-generator-types/logic-templates";
import {
    exampleEditorOption,
    exampleBlocks,
} from "./logic-code-generator-types/example";

// @ts-ignore
import sdkType from "!!raw-loader!./logic-code-generator-types/sdk-types/index.d.ts";

declare type OnChangeTypes = Parameters<OnChange>;
declare type OnMountTypes = Parameters<OnMount>;

const defaultLang = langOptions[0];
const defaultType = logicOptions[0];

const defaultDefaultEditorParams: EditorParamsType = {
    lang: defaultLang,
    type: defaultType,
    comment: true,
    fullImport: false,
};

// ========== end of imports and constants ==========

const LogicCodeGenerator: FunctionComponent = () => {
    const monacoRef = useRef<OnMountTypes[1]>(null);
    const editorRef = useRef<OnMountTypes[0]>(null);
    const { colorMode, setColorMode } = useColorMode();

    const [editorParams, setEditorParams] = useState<EditorParamsType>(
        defaultDefaultEditorParams,
    );
    const [blocks, setBlocks] = useState<BlockOption[]>([]);
    const [code, setCode] = useState("");
    const [manualEdited, setManualEdited] = useState(false);
    const [strictMode, setStrictMode] = useState(false);

    const agentOptions = (
        editorParams.lang.value === "javascript"
            ? agentOptionsJS
            : agentOptionsTS
    ).filter(
        (item) => item.type === "both" || item.type === editorParams.type.value,
    );
    const defaultAgentOption = agentOptions[0];

    // generate code from templates and blocks
    const getCode = (): string => {
        let template = "";
        let moduleList: string[] = [];
        if (editorParams.type.value === "generic") {
            template =
                editorParams.lang.value === "javascript"
                    ? templateGenericJS
                    : templateGenericTS;
            moduleList =
                editorParams.lang.value === "javascript"
                    ? genericModuleListJS
                    : genericModuleListTS;
        } else {
            template =
                editorParams.lang.value === "javascript"
                    ? templateAggregatorJS
                    : templateAggregatorTS;
            moduleList = aggregatorModuleList;
        }
        const blockCode =
            blocks.length === 0
                ? ""
                : blocks
                      .map(
                          (block) =>
                              (editorParams.comment
                                  ? `// ${block.option.label}` + "\n"
                                  : "") +
                              block.userValue +
                              (block.userValue.trim() != ""
                                  ? "\n\n"
                                  : editorParams.comment
                                    ? "\n"
                                    : ""),
                      )
                      .join("")
                      .trimEnd();
        const templateWithCode = template.replace(
            "<code>",
            (blockCode.trim() != "" ? "\n" : "") + blockCode,
        );
        const filteredModules = editorParams.fullImport
            ? moduleList.sort()
            : moduleList
                  .filter(
                      (module) =>
                          templateWithCode.includes(`${module}.`) ||
                          templateWithCode.includes(`: ${module}`) ||
                          templateWithCode.includes(`as ${module}`),
                  )
                  .sort();
        const filteredModulesString =
            filteredModules.length === 0 ? "" : filteredModules.join(",\n    ");
        return templateWithCode.replace("<modules>", filteredModulesString);
    };

    // toggle strict mode of main editor
    useEffect(() => {
        setEditorCompileOptions();
    }, [strictMode]);

    // set code and filename when options or blocks are changed
    useEffect(() => {
        editorRef.current?.setValue(getCode());
        setManualEdited(false);
        // the following actions (force formatting/scroll to top) triggers main editor's onchange event
        editorRef.current?.trigger("editor", "editor.action.formatDocument");
        editorRef.current?.setPosition({ column: 1, lineNumber: 1 });
    }, [editorParams, blocks]);

    // set monaco editor compile options
    // https://microsoft.github.io/monaco-editor/typedoc/interfaces/languages.typescript.CompilerOptions.html
    const setEditorCompileOptions = () => {
        if (monacoRef) {
            const compilerOptions = getCompilerOptions(strictMode);
            monacoRef.current?.languages.typescript.javascriptDefaults.setCompilerOptions(
                {
                    ...compilerOptions,
                    allowJs: true,
                },
            );
            monacoRef.current?.languages.typescript.typescriptDefaults.setCompilerOptions(
                compilerOptions,
            );
        }
    };

    // block add button
    const handleAddBlock = (
        e: React.MouseEvent<HTMLButtonElement>,
        index: number | null,
    ) => {
        if (manualEdited && !window.confirm(syncBlockMsg)) return;
        const newBlock: BlockOption = {
            option: defaultAgentOption,
            editing: false,
            userValue: defaultAgentOption.value.trim(),
        };
        setBlocks(
            index != null
                ? [
                      ...blocks.slice(0, index),
                      newBlock,
                      ...blocks.slice(index, blocks.length + 1),
                  ]
                : [...blocks, newBlock],
        );
    };

    return (
        <div className={styles.container} id="codegen">
            <div className={styles.gridOneSide}>
                <div>
                    <div className="padded-sm">
                        <span className={styles.fonTitle}>➀</span>
                        &nbsp;&nbsp;
                        <span className={styles.fontSubtitle}>
                            Select Type and Language
                        </span>
                        &nbsp;
                        <span className={styles.tooltip}>
                            ⓘ
                            <span className={styles.tooltiptext}>
                                Select a new type/language will reset blocks and
                                code.
                            </span>
                        </span>
                        &nbsp;&nbsp;
                        <button
                            className={setColorStyle(
                                colorMode,
                                styles.btnInfo,
                                styles.btnInfoDark,
                            )}
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "Reset everything to default?",
                                    )
                                ) {
                                    setEditorParams(defaultDefaultEditorParams);
                                    setBlocks([]);
                                }
                            }}
                        >
                            Reset
                        </button>
                    </div>
                    <div className="padded-sm">
                        <span>Logic type</span>
                        <Select
                            options={logicOptions}
                            value={editorParams.type}
                            styles={
                                colorMode === "light"
                                    ? selectStyle
                                    : selectDarkStyle
                            }
                            onChange={(
                                option: Option | null,
                                actionMeta: ActionMeta<Option>,
                            ) => {
                                if (!option) return;
                                if (
                                    (blocks.length > 0 || manualEdited) &&
                                    !window.confirm(changeOptionMsg)
                                )
                                    return;
                                setEditorParams({
                                    ...editorParams,
                                    type: option,
                                });
                                setBlocks([]);
                            }}
                        />
                    </div>
                    <div className="padded-sm">
                        <span>Language</span>
                        <Select
                            options={langOptions}
                            value={editorParams.lang}
                            styles={
                                colorMode === "light"
                                    ? selectStyle
                                    : selectDarkStyle
                            }
                            onChange={(
                                option: Option | null,
                                actionMeta: ActionMeta<Option>,
                            ) => {
                                if (!option) return;
                                if (
                                    (blocks.length > 0 || manualEdited) &&
                                    !window.confirm(changeOptionMsg)
                                )
                                    return;
                                setEditorParams({
                                    ...editorParams,
                                    lang: option,
                                });
                                setBlocks([]);
                            }}
                        />
                    </div>
                    <hr />
                    <div className="padded-sm">
                        <span className={styles.fonTitle}>➁</span>
                        &nbsp;&nbsp;
                        <span className={styles.fontSubtitle}>
                            Set Code Blocks
                        </span>
                        &nbsp;
                        <span className={styles.tooltip}>
                            ⓘ
                            <span className={styles.tooltiptext}>
                                A block is a template snippet to be part of the
                                logic. Modifying blocks will re-sync templates
                                to the logic.
                                <br />
                                <br />
                                {plusSign}: Add a block
                                <br />
                                {editSign}: Edit a block
                                <br />
                                {editOKSign}: Finish editing a block
                                <br />
                                {trashSign}: Delete a block
                            </span>
                        </span>
                        &nbsp;&nbsp;
                        <button
                            className={setColorStyle(
                                colorMode,
                                styles.btnInfo,
                                styles.btnInfoDark,
                            )}
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "Confirm clearing all code blocks?",
                                    )
                                )
                                    setBlocks([]);
                            }}
                        >
                            Clear
                        </button>
                        &nbsp;&nbsp;
                        <button
                            className={setColorStyle(
                                colorMode,
                                styles.btnInfo,
                                styles.btnInfoDark,
                            )}
                            onClick={() => {
                                if (
                                    !window.confirm(
                                        "Your current logic will be overwritten. Continue?",
                                    )
                                )
                                    return;
                                setEditorParams({
                                    ...exampleEditorOption,
                                });
                                setBlocks([
                                    ...exampleBlocks.map((item) => {
                                        return { ...item };
                                    }),
                                ]);
                            }}
                        >
                            <small>Example💡</small>
                        </button>
                    </div>
                    <div className="padded-sm">
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={editorParams.comment}
                            onChange={() => {
                                if (
                                    manualEdited &&
                                    !window.confirm(syncBlockMsg)
                                )
                                    return;
                                setEditorParams({
                                    ...editorParams,
                                    comment: !editorParams.comment,
                                });
                            }}
                        />
                        <span>&nbsp;Block comments</span>
                    </div>
                    <div className="padded-sm">
                        {blocks.map((block, index) => {
                            return (
                                <div>
                                    <div>
                                        <button
                                            className={setColorStyle(
                                                colorMode,
                                                styles.btnAdd,
                                                styles.btnAddDark,
                                            )}
                                            onClick={(e) =>
                                                handleAddBlock(e, index)
                                            }
                                        >
                                            {plusSign}
                                        </button>
                                    </div>
                                    <div className="center">
                                        <span
                                            className={setColorStyle(
                                                colorMode,
                                                styles.spanBlock,
                                                styles.spanBlockDark,
                                            )}
                                        >
                                            {`Block ${index + 1}${block.editing ? " (editing)" : block.userValue != block.option.value ? " (edited)" : ""}`}
                                        </span>
                                    </div>
                                    <div className={styles.gridSelect}>
                                        {block.editing ? (
                                            <div>
                                                <div>
                                                    <Editor
                                                        height={`${Math.ceil(editorOptions.fontSize * editorOptions.lineHeight)}px`}
                                                        theme={setColorStyle(
                                                            colorMode,
                                                            "vs",
                                                            "vs-dark",
                                                        )}
                                                        options={{
                                                            ...editorOptions,
                                                            readOnly: true,
                                                            lineNumbers: "off",
                                                            scrollbar: {
                                                                verticalScrollbarSize: 0,
                                                                horizontalScrollbarSize: 0,
                                                            },
                                                            quickSuggestions:
                                                                false,
                                                        }}
                                                        language={
                                                            defaultLang.value
                                                        }
                                                        defaultValue={`// ${block.option.label}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Editor
                                                        key={index}
                                                        height={calculateCodeHeight(
                                                            block.userValue,
                                                            editorOptions,
                                                            10,
                                                            20,
                                                        )}
                                                        theme={setColorStyle(
                                                            colorMode,
                                                            "vs",
                                                            "vs-dark",
                                                        )}
                                                        options={{
                                                            ...editorOptions,
                                                            lineNumbers: "off",
                                                            scrollbar: {
                                                                verticalScrollbarSize: 6,
                                                                horizontalScrollbarSize: 6,
                                                                alwaysConsumeMouseWheel:
                                                                    false,
                                                            },
                                                            quickSuggestions:
                                                                false,
                                                            scrollBeyondLastLine:
                                                                false,
                                                        }}
                                                        language={
                                                            editorParams.lang
                                                                .value
                                                        }
                                                        value={block.userValue}
                                                        onChange={(
                                                            value: OnChangeTypes[0],
                                                            e: OnChangeTypes[1],
                                                        ) => {
                                                            blocks[
                                                                index
                                                            ].userValue =
                                                                value.trim();
                                                            setBlocks([
                                                                ...blocks,
                                                            ]);
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        styles.fontAlertBg
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.fontAlert
                                                        }
                                                    >
                                                        SDK type errors can be
                                                        ignored.
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <Select
                                                    key={index}
                                                    options={agentOptions}
                                                    value={block.option}
                                                    styles={
                                                        colorMode === "light"
                                                            ? selectStyle
                                                            : selectDarkStyle
                                                    }
                                                    onChange={(
                                                        option: Option | null,
                                                        actionMeta: ActionMeta<Option>,
                                                    ) => {
                                                        if (
                                                            manualEdited &&
                                                            !window.confirm(
                                                                syncBlockMsg,
                                                            )
                                                        )
                                                            return;
                                                        blocks[index].option =
                                                            option;
                                                        blocks[
                                                            index
                                                        ].userValue =
                                                            option.value;
                                                        setBlocks([...blocks]);
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <button
                                                className={setColorStyle(
                                                    colorMode,
                                                    styles.btnEdit,
                                                    styles.btnEditDark,
                                                )}
                                                onClick={(
                                                    e: React.MouseEvent<HTMLButtonElement>,
                                                ) => {
                                                    if (
                                                        manualEdited &&
                                                        !window.confirm(
                                                            syncBlockMsg,
                                                        )
                                                    )
                                                        return;
                                                    blocks[index].editing =
                                                        !blocks[index].editing;
                                                    setBlocks([...blocks]);
                                                }}
                                            >
                                                {!block.editing
                                                    ? editSign
                                                    : editOKSign}
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                className={setColorStyle(
                                                    colorMode,
                                                    styles.btnDel,
                                                    styles.btnDelDark,
                                                )}
                                                onClick={(
                                                    e: React.MouseEvent<HTMLButtonElement>,
                                                ) => {
                                                    if (
                                                        manualEdited &&
                                                        !window.confirm(
                                                            syncBlockMsg,
                                                        )
                                                    )
                                                        return;
                                                    setBlocks([
                                                        ...blocks.slice(
                                                            0,
                                                            index,
                                                        ),
                                                        ...blocks.slice(
                                                            index + 1,
                                                            blocks.length,
                                                        ),
                                                    ]);
                                                }}
                                            >
                                                {trashSign}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div>
                            <button
                                className={setColorStyle(
                                    colorMode,
                                    styles.btnAdd,
                                    styles.btnAddDark,
                                )}
                                onClick={(e) => handleAddBlock(e, null)}
                            >
                                {plusSign}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="padded-sm">
                        <span className={styles.fonTitle}>➂</span>
                        &nbsp;&nbsp;
                        <span className={styles.fontSubtitle}>
                            Preview and Edit Logic
                        </span>
                        &nbsp;&nbsp;
                        <button
                            className={setColorStyle(
                                colorMode,
                                styles.btnInfo,
                                styles.btnInfoDark,
                            )}
                            onClick={() => {
                                navigator.clipboard.writeText(code);
                                alert("Logic code copied!");
                            }}
                        >
                            Copy <b>⏍</b>
                        </button>
                        &nbsp;&nbsp;
                        <button
                            className={setColorStyle(
                                colorMode,
                                styles.btnInfo,
                                styles.btnInfoDark,
                            )}
                            onClick={() =>
                                document
                                    .getElementById("tester")
                                    .scrollIntoView()
                            }
                        >
                            Unit Test <b>▼</b>
                        </button>
                        &nbsp;&nbsp;
                        {!manualEdited ? (
                            <span className={styles.fontOkBg}>
                                <span className={styles.fontOk}>
                                    Synced to blocks <b>⇔</b>
                                </span>
                            </span>
                        ) : (
                            <span className={styles.fontAlertBg}>
                                <span className={styles.fontAlert}>
                                    Manually edited <b>⇎</b>
                                </span>
                            </span>
                        )}
                        &nbsp;
                        <span className={styles.tooltip}>
                            ⓘ
                            <span className={styles.tooltiptext}>
                                Indicates if the editor code is completely
                                generated from blocks of the user has edited the
                                code directly
                            </span>
                        </span>
                    </div>
                    <div className={styles.gridOneSide2}>
                        <div className="padded-sm">
                            <input
                                type="checkbox"
                                checked={editorParams.fullImport}
                                onChange={() => {
                                    if (
                                        manualEdited &&
                                        !window.confirm(syncBlockMsg)
                                    )
                                        return;
                                    setEditorParams({
                                        ...editorParams,
                                        fullImport: !editorParams.fullImport,
                                    });
                                }}
                                className={styles.checkbox}
                            />
                            <span>&nbsp;Full import</span>
                            &nbsp;&nbsp;
                            <input
                                type="checkbox"
                                checked={strictMode}
                                onChange={() => setStrictMode(!strictMode)}
                                className={styles.checkbox}
                            />
                            <span>&nbsp;Strict IntelliSense</span>
                            &nbsp;
                            <span className={styles.tooltip}>
                                ⓘ
                                <span className={styles.tooltiptext}>
                                    Enables a series of strict options in the
                                    editor.
                                    <br />
                                    <br />
                                    Errors or warnings shown in strict
                                    IntelliSense mode do not affect code
                                    execution.
                                </span>
                            </span>
                        </div>
                        <div className="right-padded-sm">
                            {<b>{editorParams.type.label}&nbsp;</b>}
                            {editorParams.lang.label === "JavaScript" ? (
                                <img
                                    src={
                                        require("/img/language/Javascript.png")
                                            .default
                                    }
                                    alt="Javascript"
                                    width="22px"
                                />
                            ) : (
                                <img
                                    src={
                                        require("/img/language/Typescript.png")
                                            .default
                                    }
                                    alt="Typescript"
                                    width="22px"
                                />
                            )}
                        </div>
                        <div className="right-padded-sm">
                            {!manualEdited ? (
                                <span className={styles.fontOkBg}>
                                    <span className={styles.fontOk}>
                                        Synced to blocks <b>⇔</b>
                                    </span>
                                </span>
                            ) : (
                                <span className={styles.fontAlertBg}>
                                    <span className={styles.fontAlert}>
                                        Manually edited <b>⇎</b>
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="padded-sm">
                            <Editor
                                height={calculateCodeHeight(
                                    code,
                                    editorOptions,
                                    20,
                                    null,
                                )}
                                theme={setColorStyle(
                                    colorMode,
                                    "vs",
                                    "vs-dark",
                                )}
                                options={editorOptions}
                                language={editorParams.lang.value}
                                value={code}
                                onMount={(editor, monaco) => {
                                    editorRef.current = editor;
                                    if (monaco) {
                                        monacoRef.current = monaco;
                                        setEditorCompileOptions();
                                        const sdkModule = `declare module '@fstnetwork/loc-logic-sdk' { ${sdkType} };`;
                                        monacoRef.current?.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                                            diagnosticsOptions,
                                        );
                                        monacoRef.current?.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                                            diagnosticsOptions,
                                        );
                                        monacoRef.current?.languages.typescript.javascriptDefaults.addExtraLib(
                                            sdkModule,
                                        );
                                        monacoRef.current?.languages.typescript.typescriptDefaults.addExtraLib(
                                            sdkModule,
                                        );
                                    }
                                    if (code == "") {
                                        setCode(getCode());
                                        setManualEdited(false);
                                    }
                                }}
                                onChange={(value, e) => {
                                    setCode(value);
                                    if (manualEdited) return;
                                    let edited = false;
                                    for (const change of e.changes) {
                                        if (!change?.forceMoveMarkers) {
                                            edited = true;
                                            break;
                                        }
                                    }
                                    if (edited) setManualEdited(true);
                                }}
                            />
                        </div>
                        <div className="right-padded-sm">
                            <DownloadLink
                                raw={code}
                                fileName={`loc-${editorParams.type.value}-logic-${editorParams.lang.value}-${new Date().getTime()}.${editorParams.lang.value === "javascript" ? "js" : "ts"}`}
                                linkText="⇓ Download as file"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <Suspense
                fallback={
                    <div className="padded-sm">Loading unit tester...</div>
                }
            >
                <LogicUnitTesterParams
                    code={code}
                    editorParams={editorParams}
                    editorOptions={editorOptions}
                />
            </Suspense>
            <hr />
        </div>
    );
};

export default LogicCodeGenerator;
