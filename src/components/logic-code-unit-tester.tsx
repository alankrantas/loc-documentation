import { FunctionComponent, useState } from "react";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "../css/logic-code-generator.module.css";

import { rollup } from "@rollup/browser"; // https://rollupjs.org/faqs/#how-do-i-run-rollup-itself-in-a-browser
import ts from "typescript"; // https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

import { setColorStyle } from "./logic-code-generator-types/general";
import {
    completeSign,
    completeErrorSign,
    emptyLogic,
    defaultOutputs,
    logicValidate,
    formatLogicTesterLog,
} from "./logic-code-unit-tester-data/execution-setup";
import type {
    ExecutionInput,
    ExecutionOutput,
} from "./logic-code-unit-tester-data/execution-setup";

// @ts-ignore
import main from "!!raw-loader!./logic-code-unit-tester-data/mock-runtime/main.js";
// @ts-ignore
import sdk from "!!raw-loader!./logic-code-unit-tester-data/mock-runtime/sdk.js";
// @ts-ignore
import deno from "!!raw-loader!./logic-code-unit-tester-data/mock-runtime/deno.js";

let modules = {
    "main.js": main,
    logic: "",
    sdk: sdk,
    deno: deno,
};

interface LogicUnitTesterProps {
    code: string;
    type: string;
    executionInputs: ExecutionInput;
}

// ========== end of imports and constants ==========

const LogicUnitTester: FunctionComponent<LogicUnitTesterProps> = ({
    code,
    type,
    executionInputs,
}) => {
    const { colorMode, setColorMode } = useColorMode();
    const [firstExecution, setFirstExecution] = useState(true);
    const [executing, setExecuting] = useState(false);
    const [executionOutput, SetExecutionOutput] =
        useState<ExecutionOutput>(defaultOutputs);

    // logic bundler
    const logicBundler = async (): Promise<string> => {
        // transpile JS/TS to JS
        modules["logic"] = ts
            .transpileModule(logicValidate(code) ? code : emptyLogic, {
                compilerOptions: {
                    target: ts.ScriptTarget.ESNext,
                    module: ts.ModuleKind.ESNext,
                },
            })
            .outputText.replace(
                new RegExp("@fstnetwork/loc-logic-sdk", "g"),
                "sdk",
            );

        // generate bundled code
        const bundler = await rollup({
            input: "main.js",
            plugins: [
                {
                    name: "loader",
                    resolveId(source) {
                        if (modules.hasOwnProperty(source)) return source;
                        else return null;
                    },
                    load(id) {
                        if (modules.hasOwnProperty(id)) return modules[id];
                        else return null;
                    },
                },
            ],
        });
        return (await bundler.generate({ format: "es" })).output[0].code;
    };

    // generate bundled code, execute and collect console logs
    const logicTester = async () => {
        SetExecutionOutput(defaultOutputs);

        const consoleOutput: string[] = [];
        const consoleOriginal = console.log;
        console.log = (...msg: any) => {
            msg.forEach((m: any) =>
                consoleOutput.push(formatLogicTesterLog(m)),
            );
        };

        let logic: (
            type: string,
            executionInputs: ExecutionInput,
        ) => Promise<null> = null;
        try {
            logic = await eval(await logicBundler());
        } catch (e) {
            console.log(`[LOGIC BUNDLER]\n\nbundling error:\n\n${e.stack}`);
        }

        let status = false;
        try {
            status = await logic(type, executionInputs);
        } catch (e) {
            console.log(`[LOGIC BUNDLER]\n\nsystem error:\n\n${e.stack}`);
        }

        console.log = consoleOriginal;
        SetExecutionOutput({
            logs: consoleOutput,
            success: status,
            timestamp: new Date().toLocaleString("en-us"),
        });
    };

    return (
        <div>
            <div className="padded-sm">
                <button
                    className={setColorStyle(
                        colorMode,
                        styles.btnExecute,
                        styles.btnExecuteDark,
                    )}
                    onClick={async (e) => {
                        if (executing) return;
                        setExecuting(true);
                        await logicTester();
                        setExecuting(false);
                        if (firstExecution) setFirstExecution(false);
                    }}
                    disabled={executing}
                >
                    {executing
                        ? !firstExecution
                            ? "Executing...⌛"
                            : "Loading and executing...⌛"
                        : "Execute ➽"}
                </button>
            </div>
            {executionOutput.timestamp ? (
                <div>
                    <div className="padded-sm">
                        <span>
                            <b>Test result</b>&nbsp;
                            {executionOutput.success
                                ? completeSign
                                : completeErrorSign}
                        </span>
                        <br />
                        <span>
                            (last executed: {executionOutput.timestamp})
                        </span>
                    </div>
                    <div className="padded-sm">
                        <button
                            className={setColorStyle(
                                colorMode,
                                styles.btnInfo,
                                styles.btnInfoDark,
                            )}
                            onClick={() =>
                                document
                                    .getElementById("execution-result-end")
                                    .scrollIntoView()
                            }
                        >
                            Scroll to end <b>▼</b>
                        </button>
                        &nbsp;&nbsp;
                        <button
                            className={setColorStyle(
                                colorMode,
                                styles.btnInfo,
                                styles.btnInfoDark,
                            )}
                            onClick={() => SetExecutionOutput(defaultOutputs)}
                        >
                            Clear
                        </button>
                    </div>
                    <div className="padded-sm">
                        <div
                            className={setColorStyle(
                                colorMode,
                                styles.fontValidateColor,
                                styles.fontValidateColorDark,
                            )}
                        >
                            {executionOutput.logs.map((log) => (
                                <p>
                                    <pre>{log}</pre>
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="padded-sm" id="execution-result-end">
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
                            Back to top <b>▲</b>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="padded-sm"></div>
            )}
        </div>
    );
};

export default LogicUnitTester;
