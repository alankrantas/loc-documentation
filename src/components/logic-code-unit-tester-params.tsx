import { FunctionComponent, lazy, Suspense, useState } from "react";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "../css/logic-code-generator.module.css";

// https://react-select.com/home
import Select from "react-select";
import type { ActionMeta } from "react-select";

// https://github.com/suren-atoyan/monaco-react
import Editor from "@monaco-editor/react";

const LogicUnitTester = lazy(() => import("./logic-code-unit-tester"));

import type { Option } from "./logic-code-generator-types/general";
import { setColorStyle } from "./logic-code-generator-types/general";
import type { EditorParamsType } from "./logic-code-generator-types/editor-options";
import { calculateCodeHeight } from "./logic-code-generator-types/editor-options";
import {
    selectStyle,
    selectDarkStyle,
} from "./logic-code-generator-types/select-options";
import {
    inputOptions,
    payloadOptions,
    bodyOptions,
    getDefaultInputs,
    getPayloadDefault,
} from "./logic-code-unit-tester-data/execution-setup";
import type { ExecutionInput } from "./logic-code-unit-tester-data/execution-setup";

interface LogicUnitTesterParamsProps {
    code: string;
    editorParams: EditorParamsType;
    editorOptions: any;
}

// ========== end of imports and constants ==========

const LogicUnitTesterParams: FunctionComponent<LogicUnitTesterParamsProps> = ({
    code,
    editorParams,
    editorOptions,
}) => {
    const inputEditorOptions = {
        ...editorOptions,
        scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
            alwaysConsumeMouseWheel: false,
        },
        quickSuggestions: false,
        scrollBeyondLastLine: false,
    };
    const inputDedault = inputOptions[0];
    const payloadDefault = payloadOptions[0].value;
    const apiBodyFormatDefault = bodyOptions[0].value;

    const { colorMode, setColorMode } = useColorMode();
    const [inputOption, setInputOption] = useState(inputDedault);
    const [apiBodyFormat, setApiBodyFormat] = useState(apiBodyFormatDefault);
    const [executionInputs, setExecutionInputs] = useState<ExecutionInput>(
        getDefaultInputs(
            payloadDefault,
            apiBodyFormatDefault,
            editorParams.type.label,
            true,
        ),
    );

    return (
        <div>
            <div className={styles.gridOneSide2}>
                <div className="padded-sm" id="tester">
                    <span className={styles.fonTitle}>④</span>
                    &nbsp;&nbsp;
                    <span className={styles.fontSubtitle}>Logic Unit Test</span>
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
                                    "Reset all mocked input data to empty?",
                                )
                            ) {
                                setInputOption(inputDedault);
                                setApiBodyFormat(apiBodyFormatDefault);
                                setExecutionInputs({
                                    ...getDefaultInputs(
                                        payloadDefault,
                                        apiBodyFormatDefault,
                                        editorParams.type.label,
                                    ),
                                });
                            }
                        }}
                    >
                        Clear input
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
                                window.confirm(
                                    "Reset all mocked input data to default?",
                                )
                            ) {
                                setInputOption(inputDedault);
                                setApiBodyFormat(apiBodyFormatDefault);
                                setExecutionInputs({
                                    ...getDefaultInputs(
                                        payloadDefault,
                                        apiBodyFormatDefault,
                                        editorParams.type.label,
                                        true,
                                    ),
                                });
                            }
                        }}
                    >
                        Example input
                    </button>
                    &nbsp;&nbsp;
                    <button
                        className={setColorStyle(
                            colorMode,
                            styles.btnInfo,
                            styles.btnInfoDark,
                        )}
                        onClick={() =>
                            document.getElementById("codegen").scrollIntoView()
                        }
                    >
                        Code generator <b>▲</b>
                    </button>
                </div>
                <div className="padded-sm">
                    <div className="padded-sm">
                        <input
                            type="checkbox"
                            checked={executionInputs.verbose}
                            onChange={() => {
                                executionInputs.verbose =
                                    !executionInputs.verbose;
                                setExecutionInputs({ ...executionInputs });
                            }}
                            className={styles.checkbox}
                        />
                        <span>&nbsp;Verbose logging</span>
                        &nbsp;
                        <span className={styles.tooltip}>
                            ⓘ
                            <span className={styles.tooltiptext}>
                                Enable detailed logging from agents. This is
                                implemented in mocked runtime for debugging
                                purpose is not the standard feature of LOC
                                runtime or LOC SDKs.
                                <br />
                                <br />
                                You can also use console.log() or alert() to
                                print custom logs.
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div className={styles.gridOneSide2}>
                <div>
                    <div className={styles.gridOneSide}>
                        <div>
                            <div className="padded">
                                <p>
                                    <b>Setup mock input data</b>
                                    &nbsp;
                                    <span className={styles.tooltip}>
                                        ⓘ
                                        <span className={styles.tooltiptext}>
                                            All mocked data will be bundled in
                                            order to simulate accessible data in
                                            this logic.
                                        </span>
                                    </span>
                                </p>
                                {inputOptions.map((option) => {
                                    return (
                                        <p>
                                            <button
                                                className={setColorStyle(
                                                    colorMode,
                                                    styles.btnOption,
                                                    styles.btnOptionDark,
                                                )}
                                                onClick={() =>
                                                    setInputOption(option)
                                                }
                                            >
                                                {option.value ===
                                                inputOption.value ? (
                                                    <b>
                                                        <u>{option.label}</u>
                                                    </b>
                                                ) : (
                                                    option.label
                                                )}
                                            </button>
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            {(() => {
                                switch (inputOption.value) {
                                    case "payload":
                                        return (
                                            <div>
                                                <div className="padded-sm">
                                                    <span>Trigger type</span>
                                                    <Select
                                                        options={payloadOptions}
                                                        styles={
                                                            colorMode ===
                                                            "light"
                                                                ? selectStyle
                                                                : selectDarkStyle
                                                        }
                                                        value={(() => {
                                                            for (const option of payloadOptions) {
                                                                if (
                                                                    option.value in
                                                                    executionInputs.payload
                                                                )
                                                                    return option;
                                                            }
                                                            return payloadOptions[0];
                                                        })()}
                                                        onChange={(
                                                            option: Option,
                                                            actionMeta: ActionMeta<Option>,
                                                        ) => {
                                                            executionInputs.payload =
                                                                getPayloadDefault(
                                                                    option.value,
                                                                    apiBodyFormat,
                                                                );
                                                            setExecutionInputs({
                                                                ...executionInputs,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {(() => {
                                                    if (
                                                        "http" in
                                                        executionInputs.payload
                                                    ) {
                                                        return (
                                                            <div>
                                                                <div className="padded-sm">
                                                                    <span>
                                                                        QueryString
                                                                        (
                                                                        <code>
                                                                            payload.http.request.query
                                                                        </code>
                                                                        )
                                                                    </span>
                                                                    <br />
                                                                    <input
                                                                        type="text"
                                                                        className={
                                                                            styles.querystring
                                                                        }
                                                                        value={
                                                                            executionInputs
                                                                                .payload
                                                                                .http
                                                                                ?.request
                                                                                ?.query ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e: React.ChangeEvent<HTMLInputElement>,
                                                                        ) => {
                                                                            const querystring =
                                                                                e.target.value.trim();
                                                                            executionInputs.payload.http.request.query =
                                                                                querystring
                                                                                    ? `?${querystring.replace("?", "")}`
                                                                                    : "";
                                                                            setExecutionInputs(
                                                                                {
                                                                                    ...executionInputs,
                                                                                },
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="padded-sm">
                                                                    <span>
                                                                        Request
                                                                        body (
                                                                        <code>
                                                                            payload.http.request.data
                                                                        </code>
                                                                        )
                                                                    </span>
                                                                    &nbsp;
                                                                    <span
                                                                        className={
                                                                            styles.tooltip
                                                                        }
                                                                    >
                                                                        ⓘ
                                                                        <span
                                                                            className={
                                                                                styles.tooltiptext
                                                                            }
                                                                        >
                                                                            Body
                                                                            will
                                                                            be
                                                                            passed
                                                                            as
                                                                            an
                                                                            encoded
                                                                            string
                                                                            regardless
                                                                            of
                                                                            the
                                                                            format
                                                                            (no
                                                                            validation);
                                                                            content
                                                                            type
                                                                            header
                                                                            will
                                                                            be
                                                                            set
                                                                            accordingly
                                                                        </span>
                                                                    </span>
                                                                    <Select
                                                                        options={
                                                                            bodyOptions
                                                                        }
                                                                        styles={
                                                                            colorMode ===
                                                                            "light"
                                                                                ? selectStyle
                                                                                : selectDarkStyle
                                                                        }
                                                                        value={(() => {
                                                                            for (const option of bodyOptions) {
                                                                                if (
                                                                                    option.value ==
                                                                                    apiBodyFormat
                                                                                )
                                                                                    return option;
                                                                            }
                                                                            return bodyOptions[0];
                                                                        })()}
                                                                        onChange={(
                                                                            option: Option,
                                                                            actionMeta: ActionMeta<Option>,
                                                                        ) => {
                                                                            setApiBodyFormat(
                                                                                option.value,
                                                                            );
                                                                            executionInputs.payload.http.request.data =
                                                                                "";
                                                                            setExecutionInputs(
                                                                                {
                                                                                    ...executionInputs,
                                                                                },
                                                                            );
                                                                        }}
                                                                    />
                                                                    <br />
                                                                    <Editor
                                                                        height={calculateCodeHeight(
                                                                            executionInputs
                                                                                .payload
                                                                                .http
                                                                                .request
                                                                                .data,
                                                                            editorOptions,
                                                                            10,
                                                                            50,
                                                                        )}
                                                                        theme={setColorStyle(
                                                                            colorMode,
                                                                            "vs",
                                                                            "vs-dark",
                                                                        )}
                                                                        options={
                                                                            inputEditorOptions
                                                                        }
                                                                        language={
                                                                            apiBodyFormat
                                                                        }
                                                                        value={
                                                                            executionInputs
                                                                                .payload
                                                                                .http
                                                                                .request
                                                                                .data
                                                                        }
                                                                        onChange={(
                                                                            value,
                                                                            e,
                                                                        ) => {
                                                                            switch (
                                                                                apiBodyFormat
                                                                            ) {
                                                                                case "json":
                                                                                    executionInputs.payload.http.request.headers[
                                                                                        "content-type"
                                                                                    ] =
                                                                                        "application/json";
                                                                                    break;
                                                                                case "xml":
                                                                                    executionInputs.payload.http.request.headers[
                                                                                        "content-type"
                                                                                    ] =
                                                                                        "application/xml";
                                                                                    break;
                                                                                default:
                                                                                    executionInputs.payload.http.request.headers[
                                                                                        "content-type"
                                                                                    ] =
                                                                                        "text/plain";
                                                                            }
                                                                            (executionInputs.payload.http.request.data =
                                                                                value.trim() ||
                                                                                ""),
                                                                                setExecutionInputs(
                                                                                    {
                                                                                        ...executionInputs,
                                                                                    },
                                                                                );
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div className="padded-sm">
                                                                <p>
                                                                    <small>
                                                                        ⓘ The
                                                                        payload
                                                                        will be{" "}
                                                                        <code>{`{ event: {} }`}</code>
                                                                        .
                                                                    </small>
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        );
                                    case "logicVar":
                                        return (
                                            <div className="padded-sm">
                                                <p>
                                                    Logic variables (environment
                                                    variables) &nbsp;
                                                    <span
                                                        className={
                                                            styles.tooltip
                                                        }
                                                    >
                                                        ⓘ
                                                        <span
                                                            className={
                                                                styles.tooltiptext
                                                            }
                                                        >
                                                            Values will be
                                                            force-converted to
                                                            string
                                                        </span>
                                                    </span>
                                                </p>
                                                <Editor
                                                    height={calculateCodeHeight(
                                                        executionInputs.logicVar,
                                                        editorOptions,
                                                        10,
                                                        50,
                                                    )}
                                                    theme={setColorStyle(
                                                        colorMode,
                                                        "vs",
                                                        "vs-dark",
                                                    )}
                                                    options={inputEditorOptions}
                                                    language={"json"}
                                                    value={
                                                        executionInputs.logicVar
                                                    }
                                                    onChange={(value, e) => {
                                                        executionInputs.logicVar =
                                                            value;
                                                        setExecutionInputs({
                                                            ...executionInputs,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        );
                                    case "session":
                                        return (
                                            <div className="padded-sm">
                                                <p>
                                                    JSON/string session data
                                                    &nbsp;
                                                    <span
                                                        className={
                                                            styles.tooltip
                                                        }
                                                    >
                                                        ⓘ
                                                        <span
                                                            className={
                                                                styles.tooltiptext
                                                            }
                                                        >
                                                            A object value for a
                                                            key will be a JSON
                                                            session data.
                                                            Otherwise it will be
                                                            a string session
                                                            data
                                                        </span>
                                                    </span>
                                                </p>
                                                <Editor
                                                    height={calculateCodeHeight(
                                                        executionInputs.session,
                                                        editorOptions,
                                                        10,
                                                        50,
                                                    )}
                                                    theme={setColorStyle(
                                                        colorMode,
                                                        "vs",
                                                        "vs-dark",
                                                    )}
                                                    options={inputEditorOptions}
                                                    language={"json"}
                                                    value={
                                                        executionInputs.session
                                                    }
                                                    onChange={(value, e) => {
                                                        executionInputs.session =
                                                            value;
                                                        setExecutionInputs({
                                                            ...executionInputs,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        );
                                    case "events":
                                        return (
                                            <div className="padded-sm">
                                                <p>
                                                    Events (before execution)
                                                    &nbsp;
                                                    <span
                                                        className={
                                                            styles.tooltip
                                                        }
                                                    >
                                                        ⓘ
                                                        <span
                                                            className={
                                                                styles.tooltiptext
                                                            }
                                                        >
                                                            Events will be
                                                            "emitted" with
                                                            current timestamp
                                                            and the
                                                            corresponding
                                                            sequence number
                                                        </span>
                                                    </span>
                                                </p>
                                                <Editor
                                                    height={calculateCodeHeight(
                                                        executionInputs.events,
                                                        editorOptions,
                                                        10,
                                                        50,
                                                    )}
                                                    theme={setColorStyle(
                                                        colorMode,
                                                        "vs",
                                                        "vs-dark",
                                                    )}
                                                    options={inputEditorOptions}
                                                    language={"json"}
                                                    value={
                                                        executionInputs.events
                                                    }
                                                    onChange={(value, e) => {
                                                        executionInputs.events =
                                                            value;
                                                        setExecutionInputs({
                                                            ...executionInputs,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        );
                                    case "httpRes":
                                        return (
                                            <div>
                                                <div className="padded-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            executionInputs.realFetch
                                                        }
                                                        onChange={() => {
                                                            executionInputs.realFetch =
                                                                !executionInputs.realFetch;
                                                            setExecutionInputs({
                                                                ...executionInputs,
                                                            });
                                                        }}
                                                        className={
                                                            styles.checkbox
                                                        }
                                                    />
                                                    <span>
                                                        ❗Use real fetch API❗
                                                    </span>
                                                    &nbsp;
                                                    <span
                                                        className={
                                                            styles.tooltip
                                                        }
                                                    >
                                                        ⓘ
                                                        <span
                                                            className={
                                                                styles.tooltiptext
                                                            }
                                                        >
                                                            <b>Warning:</b> by
                                                            enabling this mode,
                                                            the HTTP agent
                                                            client will send{" "}
                                                            <i>actual</i> HTTP
                                                            requests (use it at
                                                            your own risk) and
                                                            may take time to
                                                            return result(s)
                                                        </span>
                                                    </span>
                                                </div>
                                                {executionInputs.realFetch ? (
                                                    <div className="padded-sm">
                                                        <p>
                                                            HTTP host (with{" "}
                                                            <code>http://</code>{" "}
                                                            or{" "}
                                                            <code>
                                                                https://
                                                            </code>
                                                            )
                                                        </p>
                                                        <Editor
                                                            height={calculateCodeHeight(
                                                                executionInputs.realFetchHost,
                                                                editorOptions,
                                                                10,
                                                                50,
                                                            )}
                                                            theme={setColorStyle(
                                                                colorMode,
                                                                "vs",
                                                                "vs-dark",
                                                            )}
                                                            options={
                                                                inputEditorOptions
                                                            }
                                                            language={"json"}
                                                            value={
                                                                executionInputs.realFetchHost
                                                            }
                                                            onChange={(
                                                                value,
                                                                e,
                                                            ) => {
                                                                executionInputs.realFetchHost =
                                                                    value;
                                                                setExecutionInputs(
                                                                    {
                                                                        ...executionInputs,
                                                                    },
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="padded-sm">
                                                        <p>
                                                            Mock HTTP responses
                                                            (for{" "}
                                                            <code>
                                                                httpClient.fetch
                                                            </code>
                                                            ) &nbsp;
                                                            <span
                                                                className={
                                                                    styles.tooltip
                                                                }
                                                            >
                                                                ⓘ
                                                                <span
                                                                    className={
                                                                        styles.tooltiptext
                                                                    }
                                                                >
                                                                    The HTTP
                                                                    agent client
                                                                    will try to
                                                                    match a path
                                                                    and method
                                                                    in here for
                                                                    a response
                                                                </span>
                                                            </span>
                                                        </p>
                                                        <Editor
                                                            height={calculateCodeHeight(
                                                                executionInputs.httpRes,
                                                                editorOptions,
                                                                10,
                                                                50,
                                                            )}
                                                            theme={setColorStyle(
                                                                colorMode,
                                                                "vs",
                                                                "vs-dark",
                                                            )}
                                                            options={
                                                                inputEditorOptions
                                                            }
                                                            language={"json"}
                                                            value={
                                                                executionInputs.httpRes
                                                            }
                                                            onChange={(
                                                                value,
                                                                e,
                                                            ) => {
                                                                executionInputs.httpRes =
                                                                    value;
                                                                setExecutionInputs(
                                                                    {
                                                                        ...executionInputs,
                                                                    },
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    case "dbRes":
                                        return (
                                            <div className="padded-sm">
                                                <p>
                                                    Mock database responses (for{" "}
                                                    <code>dbClient.query</code>)
                                                    &nbsp;
                                                    <span
                                                        className={
                                                            styles.tooltip
                                                        }
                                                    >
                                                        ⓘ
                                                        <span
                                                            className={
                                                                styles.tooltiptext
                                                            }
                                                        >
                                                            The DB agent client
                                                            will return results
                                                            with a matched SQL
                                                            statement. The
                                                            column definition
                                                            will not be checked
                                                        </span>
                                                    </span>
                                                </p>
                                                <Editor
                                                    height={calculateCodeHeight(
                                                        executionInputs.dbRes,
                                                        editorOptions,
                                                        10,
                                                        50,
                                                    )}
                                                    theme={setColorStyle(
                                                        colorMode,
                                                        "vs",
                                                        "vs-dark",
                                                    )}
                                                    options={inputEditorOptions}
                                                    language={"json"}
                                                    value={
                                                        executionInputs.dbRes
                                                    }
                                                    onChange={(value, e) => {
                                                        executionInputs.dbRes =
                                                            value;
                                                        setExecutionInputs({
                                                            ...executionInputs,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        );
                                    case "fileRes":
                                        return (
                                            <div className="padded-sm">
                                                <p>
                                                    Mock file storage responses
                                                    (for <code>fileClient</code>{" "}
                                                    methods) &nbsp;
                                                    <span
                                                        className={
                                                            styles.tooltip
                                                        }
                                                    >
                                                        ⓘ
                                                        <span
                                                            className={
                                                                styles.tooltiptext
                                                            }
                                                        >
                                                            A key with a string
                                                            value will be a
                                                            "file". A key with a
                                                            object value will be
                                                            a "directory".
                                                        </span>
                                                    </span>
                                                </p>
                                                <Editor
                                                    height={calculateCodeHeight(
                                                        executionInputs.fileRes,
                                                        editorOptions,
                                                        10,
                                                        50,
                                                    )}
                                                    theme={setColorStyle(
                                                        colorMode,
                                                        "vs",
                                                        "vs-dark",
                                                    )}
                                                    options={inputEditorOptions}
                                                    language={"json"}
                                                    value={
                                                        executionInputs.fileRes
                                                    }
                                                    onChange={(value, e) => {
                                                        executionInputs.fileRes =
                                                            value;
                                                        setExecutionInputs({
                                                            ...executionInputs,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        );
                                    default:
                                        return <div></div>;
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="padded-sm">
                        <Suspense
                            fallback={
                                <div className="padded-sm">
                                    Loading mock runtime...
                                </div>
                            }
                        >
                            <LogicUnitTester
                                code={code}
                                type={editorParams.type.value}
                                executionInputs={executionInputs}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogicUnitTesterParams;
