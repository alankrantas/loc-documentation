import type { Option } from "../logic-code-generator-types/general";

export const completeSign = "✅";
export const completeErrorSign = "❌";

export const inputOptions: Option[] = [
    {
        label: "Trigger/Payload",
        value: "payload",
    },
    {
        label: "Logic Variable",
        value: "logicVar",
    },
    {
        label: "Session Storage",
        value: "session",
    },
    {
        label: "Events",
        value: "events",
    },
    {
        label: "HTTP Responses",
        value: "httpRes",
    },
    {
        label: "Database Responses",
        value: "dbRes",
    },
    {
        label: "File Responses",
        value: "fileRes",
    },
];

export const payloadOptions: Option[] = [
    {
        label: "API Route (HttpPayload)",
        value: "http",
    },
    {
        label: "Schedule (empty payload)",
        value: "event",
    },
];

export const bodyOptions: Option[] = [
    {
        label: "JSON (application/json)",
        value: "json",
    },
    {
        label: "XML (application/xml)",
        value: "xml",
    },
    {
        label: "Plaintext (text/plain)",
        value: "",
    },
];

export interface ExecutionOutput {
    logs: any[];
    success: boolean;
    timestamp: string;
}

export interface ExecutionInput {
    verbose: boolean;
    payload: {
        http?: {
            request: {
                headers?: {
                    [k: string]: unknown;
                };
                query?: string;
                data?: string;
            };
        };
        event?: {};
    };
    logicVar: string;
    session: string;
    events: string;
    realFetch: boolean;
    realFetchHost: string;
    httpRes: string;
    dbRes: string;
    fileRes: string;
}

const queryDefault = "?param1=value1&param2=value2";

const bodyDefault = `{
    "field1": "value a",
    "field2": {
        "field3": "value b",
        "field4": "value c"
    }
}`;

const logicVarDefault = `{
    "key": "value 1",
    "key2": "value 2"
}`;

const sessionDefault = `{
    "key": {
       "field1": "json value a",
       "field2": "json value b"
    },
    "key2": "string value"
}`;

const eventDefault = `[
    {
        "labelName": "label name 1",
        "sourceDID": "source DID 1",
        "targetDID": "target DID 1",
        "meta": "",
        "type": "default"
    },
    {
        "labelName": "label name 2",
        "sourceDID": "source DID 2",
        "targetDID": "target DID 2",
        "meta": "",
        "type": "default"
    }
]`;

const httpHostDefault = `{
    "my-http-config-ref": "https://httpbin.org/anything"
}`;

const httpResDefault = `{
    "/api/path": {
         "POST": {
            "body": {
                "field1": "value a",
                "field2": {
                    "field3": "value b",
                    "field4": "value c"
                }
            },
            "headers": {
                "content-type": "application/json"
            }
        },
        "GET": {
            "body": {
                "field5": "value d"
            },
            "headers": {
                "content-type": "application/json"
            }
        }
    }
}`;

const dbResDefault = `{
    "SELECT * FROM table1;": {
        "columns": [
            {
                "name": "colName1",
                "type": "TEXT"
            },
            {
                "name": "colName2",
                "type": "TEXT"
            }
        ],
        "rows": [
            {
                "ColName1": "value 1",
                "ColName2": "value 2"
            },
            {
                "ColName1": "value 3",
                "ColName2": "value 4"
            }
        ]
    }
}`;

const fileResDefault = `{
    "file": "content",
    "dir": {
        "test.txt": "content\\nline 2"
    }
}`;

const emptyJSON = `{

}`;

const emptyEvents = `[

]`;

// setup default payload
export const getPayloadDefault = (
    payloadType: string,
    contentType: string,
    example: boolean = false,
): any => {
    switch (payloadType) {
        case "http":
            return {
                http: {
                    request: {
                        headers: {
                            "content-type": () => {
                                switch (contentType) {
                                    case "json":
                                        return "application/json";
                                    case "xml":
                                        return "application/xml";
                                    default:
                                        return "text/plain";
                                }
                            },
                        },
                        query: example ? queryDefault : "",
                        data: example ? bodyDefault : "",
                    },
                },
            };
        case "schedule":
        default:
            return { event: {} };
    }
};

// setup default tester inputs
export const getDefaultInputs = (
    payloadType: string,
    contentType: string,
    logicType: string,
    example: boolean = false,
): ExecutionInput => {
    const newInput = {
        verbose: true,
        payload: getPayloadDefault(payloadType, contentType, example),
        logicVar: example ? logicVarDefault : emptyJSON,
        session: example ? sessionDefault : emptyJSON,
        events: example ? eventDefault : emptyEvents,
        realFetch: false,
        realFetchHost: example ? httpHostDefault : emptyJSON,
        httpRes: example ? httpResDefault : emptyJSON,
        dbRes: example ? dbResDefault : emptyJSON,
        fileRes: example ? fileResDefault : emptyJSON,
    };
    return newInput;
};

export const defaultOutputs: ExecutionOutput = {
    logs: [],
    success: false,
    timestamp: "",
};

export const emptyLogic = `export async function run(ctx) {
    console.log("[LOGIC TEST]\n\nWarning: your logic is either empty or missing run() and/or handleError().");
}

export async function handleError(ctx, error) {}`;

export const logicValidate = (source: string): boolean => {
    return (
        source.trim() != "" &&
        (source.includes("export async function run(ctx)") ||
            source.includes(
                "export async function run(ctx: GenericContext)",
            )) &&
        (source.includes("export async function handleError(ctx, error) ") ||
            source.includes(
                "export async function handleError(ctx: GenericContext, error: RailwayError)",
            ))
    );
};

export const formatLogicTesterLog = (msg: any): string => {
    let msgString = "";
    if (msg) {
        if (Array.isArray(msg)) {
            msgString = `[${msg.join(", ")}]`;
        } else if (typeof msg == "object") {
            try {
                msgString = JSON.stringify(msg, null, 4);
            } catch (e) {
                msgString = String(msg);
            }
        } else {
            msgString = String(msg);
        }
    }
    return msgString;
};
