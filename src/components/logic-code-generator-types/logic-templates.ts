import { Option } from "./general";

export const genericModuleListJS = [
    "GenericContext",
    "AggregatorContext",
    "RailwayError",
    "LoggingAgent",
    "LogicVariable",
    "SessionStorageAgent",
    "LocalStorageAgent",
    "EventAgent",
    "HttpAgent",
    "HttpAgentClient",
    "DatabaseAgent",
    "DatabaseClient",
    "FileStorageAgent",
    "FileStorageAgentClient",
    "Mail",
    "MailAgent",
    "MailAgentClient",
];

export const genericModuleListTS = [
    "GenericContext",
    "AggregatorContext",
    "RailwayError",
    "LoggingAgent",
    "LogicVariable",
    "SessionStorageAgent",
    "LocalStorageAgent",
    "EventAgent",
    "Event",
    "Search",
    "Pattern",
    "HttpAgent",
    "HttpAgentClient",
    "DatabaseAgent",
    "DatabaseClient",
    "FileStorageAgent",
    "FileStorageAgentClient",
    "Mail",
    "MailAgent",
    "MailAgentClient",
];

export const aggregatorModuleList = [
    "GenericContext",
    "AggregatorContext",
    "RailwayError",
    "LoggingAgent",
    "LogicVariable",
    "ResultAgent",
    "SessionStorageAgent",
];

export const templateGenericJS = `import {
    <modules>
} from '@fstnetwork/loc-logic-sdk';

/** @param {import('@fstnetwork/loc-logic-sdk').GenericContext} ctx */
export async function run(ctx) {
    <code>
}

/**
 * @param {import('@fstnetwork/loc-logic-sdk').GenericContext} ctx
 * @param {import('@fstnetwork/loc-logic-sdk').RailwayError} error
 */
export async function handleError(ctx, error) {
    LoggingAgent.error({
        errorMessage: error.message,
        stack: error.stack,
        taskId: ctx.task.taskKey,
    });
}`;

export const templateAggregatorJS = `import {
    <modules>
} from '@fstnetwork/loc-logic-sdk';

/** @param {import('@fstnetwork/loc-logic-sdk').AggregatorContext} ctx */
export async function run(ctx) {
    <code>
}

/**
 * @param {import('@fstnetwork/loc-logic-sdk').AggregatorContext} ctx
 * @param {import('@fstnetwork/loc-logic-sdk').RailwayError} error
 */
export async function handleError(ctx, error) {
    const err = {
        status: "error",
        errorMessage: error.message,
        stack: error.stack,
        taskId: ctx.task.taskKey,
    };
    LoggingAgent.error(err);
    ResultAgent.finalize(err).httpStatusCode(500);
}`;

export const templateGenericTS = `import {
    <modules>
} from '@fstnetwork/loc-logic-sdk';

export async function run(ctx: GenericContext) {
    <code>
}

export async function handleError(ctx: GenericContext, error: RailwayError) {
    LoggingAgent.error({
        errorMessage: error.message,
        stack: error.stack,
        taskId: ctx.task.taskKey,
    });
}`;

export const templateAggregatorTS = `import {
    <modules>
} from '@fstnetwork/loc-logic-sdk';

export async function run(ctx: AggregatorContext) {
    <code>
}

export async function handleError(ctx: AggregatorContext, error: RailwayError) {
    const err = {
        status: "error",
        errorMessage: error.message,
        stack: error.stack,
        taskId: ctx.task.taskKey,
    };
    LoggingAgent.error(err);
    ResultAgent.finalize(err).httpStatusCode(500);
}`;

export interface AgentOptionsType extends Option {
    readonly type: string;
}

export const agentOptionsJS: AgentOptionsType[] = [
    {
        label: "Custom block",
        type: "both",
        value: ``,
    },
    {
        label: "[Task Result] finalise result",
        type: "aggregator",
        value: `ResultAgent.finalize({
    status: "ok",
    taskId: ctx.task.taskKey,
    data: {
        // data
    },
});`,
    },
    {
        label: "[Task Result] finalise result with HTTP code",
        type: "aggregator",
        value: `ResultAgent.finalize({
    status: "ok",
    taskId: ctx.task.taskKey,
    data: {
        // data
    },
}).httpStatusCode(200);`,
    },
    {
        label: "[Logging] log a string",
        type: "both",
        value: `LoggingAgent.info("message");`,
    },
    {
        label: "[Logging] log a JSON object",
        type: "both",
        value: `LoggingAgent.info({
    message: "message"
});`,
    },
    {
        label: "[Logging] log an error string",
        type: "both",
        value: `LoggingAgent.error("error message");`,
    },
    {
        label: "[Logging] log an error JSON object",
        type: "both",
        value: `LoggingAgent.error({
    error: "error message"
});`,
    },
    {
        label: "[Task] get task info",
        type: "both",
        value: `const taskId = ctx.task.taskKey.taskId;
const executionId = ctx.task.taskKey.executionId;
const dp_name = ctx.task.dataProcess.name;
const logic_name = ctx.task.currentLogic?.name;
const logic_revision = ctx.task.currentLogic?.revision;
`,
    },
    {
        label: "[Payload] load payload",
        type: "both",
        value: `const payload = await ctx.payload();`,
    },
    {
        label: "[Payload] read payload body",
        type: "both",
        value: `const payload = await ctx.payload();
/** @type {number[]} */
let data;
if ("http" in payload) {  // check if it's HTTP payload
    data = payload.http.request.data;
} else if ("messageQueue" in payload) {  // check if it's MQ payload
    data = payload.messageQueue.data;
} else {  // if none of above, throw an error
    throw new Error("this logic only accepts http/mq payload");
}`,
    },
    {
        label: "[Payload] read payload body and parse as JSON",
        type: "both",
        value: `const payload = await ctx.payload();
/** @type {number[]} */
let data;
if ("http" in payload) {  // check if it's HTTP payload
    data = payload.http.request.data;
} else if ("messageQueue" in payload) {  // check if it's MQ payload
    data = payload.messageQueue.data;
} else {  // if none of above, throw an error
    throw new Error("this logic only accepts http/mq payload");
}

let parsed;
try {
    parsed = JSON.parse(new TextDecoder().decode(new Uint8Array(data)));
} catch (e) {
    throw new Error(${"`error on parsing payload to JSON: ${e.message}`"});
}`,
    },
    {
        label: "[Logic Variable] read logic variable",
        type: "both",
        value: `const value = LogicVariable.get("variable");`,
    },
    {
        label: "[Session Storage] Write a string value",
        type: "both",
        value: `await SessionStorageAgent.putString("key", "value");`,
    },
    {
        label: "[Session Storage] write a JSON value",
        type: "both",
        value: `await SessionStorageAgent.putJson("key", {
    value: "value"
});`,
    },
    {
        label: "[Session Storage] read a value",
        type: "both",
        value: `const value = await SessionStorageAgent.get("key");`,
    },
    {
        label: "[Event Store] emit event(s)",
        type: "generic",
        value: `await EventAgent.emit([
    { 
        labelName: "Event name",
        sourceDID: "Event source",
        targetDID: "Event target",
        meta: "",
        type: "default",
    },
]);`,
    },
    {
        label: "[Event Store] query event(s)",
        type: "generic",
        value: `const query = await EventAgent.search({
    queries: [
        {
            field: "label_name", 
            type: "match",
            value: "Event name" 
        }
    ],
    excludes: [],
    filters: [],
    sorts: [],
    aggregation: null,
    from: 0,
    size: 1000,
});

const events = query?.events;`,
    },
    {
        label: "[Event Store] filter event(s)",
        type: "generic",
        value: `const query = await EventAgent.search({
    queries: [
        {
            field: "label_name", 
            type: "match",
            value: "Event name" 
        }
    ],
    excludes: [],
    filters: [
        {
            field: "timestamp",
            gte: Date.now() - 60 * 60 * 1000,  // starts from 1 hour ago
            lte: Date.now(),
            type: "range",
        }
    ],
    sorts: [],
    aggregation: null,
    from: 0,
    size: 1000,
});

const events = query?.events;`,
    },
    {
        label: "[Event Store] query event sequence(s)",
        type: "generic",
        value: `const query = await EventAgent.searchWithPattern({
    sequences: [
        {  // sequence 1
            conditions: [
                {
                    field: "label_name",
                    op: "eq",
                    value: "label name",
                },
            ],
            sharedFields: [],
            type: "any",
        },
        {  // sequence 2
            conditions: [
                {
                    field: "label_name",
                    op: "eq",
                    value: "label name",
                },
            ],
            sharedFields: [],
            type: "any",
        },
    ],
    filter: null,
    maxSpan: null,
});
        
const sequences = query?.sequences;`,
    },
    {
        label: "[HTTP] send POST request",
        type: "generic",
        value: `const path = "/api/path";
const data = {};
    
const httpClient = await HttpAgent.acquire("my-http-config-ref");
const response = await httpClient?.fetch(path, {
    method: "POST",
    headers: {
        "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
});`,
    },
    {
        label: "[HTTP] send POST request and read JSON response",
        type: "generic",
        value: `const path = "/api/path";
const data = {};
    
const httpClient = await HttpAgent.acquire("my-http-config-ref");
const response = await httpClient?.fetch(path, {
    method: "POST",
    headers: {
        "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
});

let body;
if ( response.ok ) {
    body = await response.json();
    console.log(body);
}`,
    },
    {
        label: "[HTTP] send GET request and read JSON response",
        type: "generic",
        value: `const path = "/api/path";
    
const httpClient = await HttpAgent.acquire("my-http-config-ref");
const response = await httpClient?.fetch(path);

let body;
if ( response.ok ) {
    body = await response.json();
    console.log(body);
}`,
    },
    {
        label: "[HTTP] send GET request with QueryString",
        type: "generic",
        value: `const path = "/api/path";
const data = {
    param: "value"
};

const queryString = new URLSearchParams(data).toString();
const httpClient = await HttpAgent.acquire("my-http-config-ref");
const response = await httpClient?.fetch(${"`${path}?${queryString}`"});

let body;
if ( response.ok ) {
    body = await response.json();
    console.log(body);
}`,
    },
    {
        label: "[Database] select query",
        type: "generic",
        value: `const dbClient = await DatabaseAgent.acquire("my-db-config-ref");

const resp = await dbClient?.query(
    "SELECT * FROM table1 WHERE col_1 = ? AND col_2 = ?;",
    ["value1", "value2"]
);
        
const rows = resp?.rows;
        
rows.forEach(row => {
    const value_1 = row.col_1;
    const value_2 = row.col_2;
});
        
    await dbClient?.release();`,
    },
    {
        label: "[Database] select query with error handling",
        type: "generic",
        value: `/** @type {import('@fstnetwork/loc-logic-sdk').DatabaseClient | null} */
let dbClient = null;
try {
    dbClient = await DatabaseAgent.acquire("my-db-config-ref");
    
    const resp = await dbClient?.query(
        "SELECT * FROM table1 WHERE col_1 = ? AND col_2 = ?;",
        ["value1", "value2"]
    );
    
    const rows = resp?.rows;
    
    rows.forEach(row => {
        const value_1 = row.col_1;
        const value_2 = row.col_2;
    });
    
} catch (e) {
    throw new Error(${"`database query error: ${e.message}`"});
} finally {
    await dbClient?.release();
}`,
    },
    {
        label: "[Database] action query",
        type: "generic",
        value: `const dbClient = await DatabaseAgent.acquire("my-db-config-ref");

await dbClient?.execute(
    "INSERT INTO table1 (col_1, col_2) VALUES (?, ?);",
    ["value_1", "value_2"]
);
        
await dbClient?.release();`,
    },
    {
        label: "[Database] action query with error handling",
        type: "generic",
        value: `/** @type {import('@fstnetwork/loc-logic-sdk').DatabaseClient | null} */
let dbClient = null;
try {
    dbClient = await DatabaseAgent.acquire("my-db-config-ref");
    
    await dbClient?.execute(
        "INSERT INTO table1 (col_1, col_2) VALUES (?, ?);",
        ["value_1", "value_2"]
    );
    
} catch (e) {
    throw new Error(${"`database query error: ${e.message}`"});
} finally {
    await dbClient?.release();
}`,
    },
    {
        label: "[Database] action query with transaction",
        type: "generic",
        value: `/** @type {import('@fstnetwork/loc-logic-sdk').DatabaseClient | null} */
let dbClient = null;
try {
    dbClient = await DatabaseAgent.acquire("my-db-config-ref");
    await dbClient?.beginTransaction();
    
    await dbClient?.execute(
        "INSERT INTO table1 (col_1, col_2) VALUES (?, ?);",
        ["value_1", "value_2"]
    );
    
    await dbClient?.commitTransaction();
    
} catch (e) {
    try {
        await dbClient?.rollbackTransaction();
        throw new Error(${"`database query error: ${e.message}`"});
    } catch (e) {
        throw new Error(${"`database commit error: ${e.message}`"});
    }
} finally {
    await dbClient?.release();
}`,
    },
    {
        label: "[File Storage] read a file",
        type: "generic",
        value: `const path = "dir/test.txt";

const fileClient = await FileStorageAgent.acquire("my-file-config-ref");
const file = await fileClient?.simpleGet("dir/test.txt");
const data = new TextDecoder().decode(file);`,
    },
    {
        label: "[File Storage] write a file",
        type: "generic",
        value: `const path = "dir/test.txt";
const data = "new content";

const fileClient = await FileStorageAgent.acquire("my-file-config-ref");
await fileClient?.simplePut(path, data);`,
    },
    {
        label: "[File Storage] list directories/files",
        type: "generic",
        value: `const path = "";

const fileClient = await FileStorageAgent.acquire("my-file-config-ref");
const list = await fileClient?.list(path);`,
    },
    {
        label: "[File Storage] create a directory",
        type: "generic",
        value: `const path = "dir2";

const fileClient = await FileStorageAgent.acquire("my-file-config-ref");
await fileClient?.createDirAll(path);`,
    },
    {
        label: "[Mail] Send a email",
        type: "generic",
        value: `const mailClient = await MailAgent.acquire("my-mail-config-ref");

const mail = new Mail.Mail()
    .setSender("sender@example.com", "sender name")
    .setSubject("Mail subject")
    .setReceivers("receiver1@example.com", "receiver 1 name")
    .setReceivers("receiver2@example.com", "receiver 2 name")
    .setBody("Mail body\\nLine two")
        
    // optional fields
    .setReplyTo("reply@example.com", "reply name")
    .setCC("cc@example.com", "cc name")
    .setBCC("bcc@example.com", "bcc name")
        
    ; // end of mail object
 
await mailClient?.send(mail);`,
    },
];

export const agentOptionsTS: AgentOptionsType[] = [
    {
        label: "Custom block",
        type: "both",
        value: ``,
    },
    {
        label: "[Task Result] finalise result",
        type: "aggregator",
        value: `ResultAgent.finalize({
    status: "ok",
    taskId: ctx.task.taskKey,
    data: {
        // data
    },
});`,
    },
    {
        label: "[Task Result] finalise result with HTTP code",
        type: "aggregator",
        value: `ResultAgent.finalize({
    status: "ok",
    taskId: ctx.task.taskKey,
    data: {
        // data
    },
}).httpStatusCode(200);`,
    },
    {
        label: "[Logging] log a string",
        type: "both",
        value: `LoggingAgent.info("message");`,
    },
    {
        label: "[Logging] log a JSON object",
        type: "both",
        value: `LoggingAgent.info({
    message: "message"
});`,
    },
    {
        label: "[Logging] log an error string",
        type: "both",
        value: `LoggingAgent.error("error message");`,
    },
    {
        label: "[Logging] log an error JSON object",
        type: "both",
        value: `LoggingAgent.error({
    error: "error message"
});`,
    },
    {
        label: "[Task] get task info",
        type: "both",
        value: `const taskId = ctx.task.taskKey.taskId;
const executionId = ctx.task.taskKey.executionId;
const dp_name = ctx.task.dataProcess.name;
const logic_name = ctx.task.currentLogic?.name;
const logic_revision = ctx.task.currentLogic?.revision;
`,
    },
    {
        label: "[Payload] load payload",
        type: "both",
        value: `const payload = await ctx.payload();`,
    },
    {
        label: "[Payload] read payload body",
        type: "both",
        value: `const payload = await ctx.payload();
let data: number[];
if ("http" in payload) {  // check if it's HTTP payload
    data = payload.http.request.data;
} else if ("messageQueue" in payload) {  // check if it's MQ payload
    data = payload.messageQueue.data;
} else {  // if none of above, throw an error
    throw new Error("this logic only accepts http/mq payload");
}`,
    },
    {
        label: "[Payload] read payload body and parse as JSON",
        type: "both",
        value: `const payload = await ctx.payload();
let data: number[];
if ("http" in payload) {  // check if it's HTTP payload
    data = payload.http.request.data;
} else if ("messageQueue" in payload) {  // check if it's MQ payload
    data = payload.messageQueue.data;
} else {  // if none of above, throw an error
    throw new Error("this logic only accepts http/mq payload");
}

let parsed;
try {
    parsed = JSON.parse(new TextDecoder().decode(new Uint8Array(data)));
} catch (e) {
    throw new Error(${"`error on parsing payload to JSON: ${e.message}`"});
}`,
    },
    {
        label: "[Logic Variable] read logic variable",
        type: "both",
        value: `const value = LogicVariable.get("variable");`,
    },
    {
        label: "[Session Storage] Write a string value",
        type: "both",
        value: `await SessionStorageAgent.putString("key", "value");`,
    },
    {
        label: "[Session Storage] write a JSON value",
        type: "both",
        value: `await SessionStorageAgent.putJson("key", {
    value: "value"
});`,
    },
    {
        label: "[Session Storage] read a value",
        type: "both",
        value: `const value = await SessionStorageAgent.get("key");`,
    },
    {
        label: "[Event Store] emit event(s)",
        type: "generic",
        value: `await EventAgent.emit([
    { 
        labelName: "Event name",
        sourceDID: "Event source",
        targetDID: "Event target",
        meta: "",
        type: "default",
    },
]);`,
    },
    {
        label: "[Event Store] query event(s)",
        type: "generic",
        value: `const query = await EventAgent.search({
    queries: [
        {
            field: "label_name", 
            type: "match",
            value: "Event name" 
        }
    ],
    excludes: [],
    filters: [],
    sorts: [],
    aggregation: null,
    from: 0,
    size: 1000,
});

const events = query?.events;`,
    },
    {
        label: "[Event Store] filter event(s)",
        type: "generic",
        value: `const query = await EventAgent.search({
    queries: [
        {
            field: "label_name", 
            type: "match",
            value: "Event name" 
        }
    ],
    excludes: [],
    filters: [
        {
            field: "timestamp",
            gte: Date.now() - 60 * 60 * 1000,  // starts from 1 hour ago
            lte: Date.now(),
            type: "range",
        }
    ],
    sorts: [],
    aggregation: null,
    from: 0,
    size: 1000,
});

const events = query?.events;`,
    },
    {
        label: "[Event Store] query event sequence(s)",
        type: "generic",
        value: `const query = await EventAgent.searchWithPattern({
    sequences: [
        {  // sequence 1
            conditions: [
                {
                    field: "label_name",
                    op: "eq",
                    value: "label name",
                },
            ],
            sharedFields: [],
            type: "any",
        },
        {  // sequence 2
            conditions: [
                {
                    field: "label_name",
                    op: "eq",
                    value: "label name",
                },
            ],
            sharedFields: [],
            type: "any",
        },
    ],
    filter: null,
    maxSpan: null,
});
        
const sequences = query?.sequences;`,
    },
    {
        label: "[HTTP] send POST request",
        type: "generic",
        value: `const path = "/api/path";
const data = {};
    
const httpClient: HttpAgentClient = await HttpAgent.acquire("my-http-config-ref");
const response = await httpClient?.fetch(path, {
    method: "POST",
    headers: {
        "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
});`,
    },
    {
        label: "[HTTP] send POST request and read JSON response",
        type: "generic",
        value: `const path = "/api/path";
const data = {};
    
const httpClient: HttpAgentClient = await HttpAgent.acquire("my-http-config-ref");
const response = await httpClient?.fetch(path, {
    method: "POST",
    headers: {
        "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
});

let body;
if ( response.ok ) {
    body = await response.json();
    console.log(body);
}`,
    },
    {
        label: "[HTTP] send GET request and read JSON response",
        type: "generic",
        value: `const path = "/api/path";
    
const httpClient = await HttpAgent.acquire("my-http-config-ref");
const response = await httpClient?.fetch(path);

let body;
if ( response.ok ) {
    body = await response.json();
    console.log(body);
}`,
    },
    {
        label: "[HTTP] send GET request with QueryString",
        type: "generic",
        value: `const path = "/api/path";
const data = {
    param: "value"
};

const queryString = new URLSearchParams(data).toString();
const httpClient = await HttpAgent.acquire("my-http-config-ref");
const response = await httpClient?.fetch(${"`${path}?${queryString}`"});

let body;
if ( response.ok ) {
    body = await response.json();
    console.log(body);
}`,
    },
    {
        label: "[Database] select query",
        type: "generic",
        value: `const dbClient: DatabaseClient = await DatabaseAgent.acquire("my-db-config-ref");

const resp = await dbClient.query(
    "SELECT * FROM table1 WHERE col_1 = ? AND col_2 = ?;",
    ["value1", "value2"]
);
        
const rows = resp?.rows;
        
rows.forEach(row => {
    const value_1 = row.col_1;
    const value_2 = row.col_2;
});
        
await dbClient?.release();`,
    },
    {
        label: "[Database] select query with error handling",
        type: "generic",
        value: `let dbClient: DatabaseClient = null;
try {
    dbClient = await DatabaseAgent.acquire("my-db-config-ref");
    
    const resp = await dbClient?.query(
        "SELECT * FROM table1 WHERE col_1 = ? AND col_2 = ?;",
        ["value1", "value2"]
    );
    
    const rows = resp?.rows;
    
    rows.forEach(row => {
        const value_1 = row.col_1;
        const value_2 = row.col_2;
    });
    
} catch (e) {
    throw new Error(${"`database query error: ${e.message}`"});
} finally {
    await dbClient?.release();
}`,
    },
    {
        label: "[Database] action query",
        type: "generic",
        value: `const dbClient: DatabaseClient = await DatabaseAgent.acquire("my-db-config-ref");

await dbClient?.execute(
    "INSERT INTO table1 (col_1, col_2) VALUES (?, ?);",
    ["value_1", "value_2"]
);
        
await dbClient?.release();`,
    },
    {
        label: "[Database] action query with error handling",
        type: "generic",
        value: `let dbClient: DatabaseClient = null;
try {
    dbClient = await DatabaseAgent.acquire("my-db-config-ref");
    
    await dbClient?.execute(
        "INSERT INTO table1 (col_1, col_2) VALUES (?, ?);",
        ["value_1", "value_2"]
    );
    
} catch (e) {
    throw new Error(${"`database query error: ${e.message}`"});
} finally {
    await dbClient?.release();
}`,
    },
    {
        label: "[Database] action query with transaction",
        type: "generic",
        value: `let dbClient: DatabaseClient = null;
try {
    dbClient = await DatabaseAgent.acquire("my-db-config-ref");
    await dbClient?.beginTransaction();
    
    await dbClient?.execute(
        "INSERT INTO table1 (col_1, col_2) VALUES (?, ?);",
        ["value_1", "value_2"]
    );
    
    await dbClient?.commitTransaction();
    
} catch (e) {
    try {
        await dbClient?.rollbackTransaction();
        throw new Error(${"`database query error: ${e.message}`"});
    } catch (e) {
        throw new Error(${"`database commit error: ${e.message}`"});
    }
} finally {
    await dbClient?.release();
}`,
    },
    {
        label: "[File Storage] read a file",
        type: "generic",
        value: `const path = "dir/test.txt";

const fileClient: FileStorageAgentClient = await FileStorageAgent.acquire("my-file-config-ref");
const file = await fileClient.simpleGet(path);
const data = new TextDecoder().decode(file);`,
    },
    {
        label: "[File Storage] write a file",
        type: "generic",
        value: `const path = "dir/test.txt";
const data = "new content";

const fileClient: FileStorageAgentClient = await FileStorageAgent.acquire("my-file-config-ref");
await fileClient?.simplePut(path, data);`,
    },
    {
        label: "[File Storage] list directories/files",
        type: "generic",
        value: `const path = "";

const fileClient = await FileStorageAgent.acquire("my-file-config-ref");
const list = await fileClient?.list(path);`,
    },
    {
        label: "[File Storage] create a directory",
        type: "generic",
        value: `const path = "dir2";

const fileClient = await FileStorageAgent.acquire("my-file-config-ref");
await fileClient?.createDirAll(path);`,
    },
    {
        label: "[Mail] Send a email",
        type: "generic",
        value: `const mailClient: MailAgentClient = await MailAgent.acquire("my-mail-config-ref");

const mail = new Mail.Mail()
    .setSender("sender@example.com", "sender name")
    .setSubject("Mail subject")
    .setReceivers("receiver1@example.com", "receiver 1 name")
    .setReceivers("receiver2@example.com", "receiver 2 name")
    .setBody("Mail body\\nLine two")
        
    // optional fields
    .setReplyTo("reply@example.com", "reply name")
    .setCC("cc@example.com", "cc name")
    .setBCC("bcc@example.com", "bcc name")

    ; // end of mail object

await mailClient?.send(mail);`,
    },
];
