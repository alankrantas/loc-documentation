// mocked Deno core API

let _mockRuntime = {
    logicType: "",
    verbose: false,
    payload: {},
    task: {},
    logicVar: {},
    session: {},
    local: {},
    events: [],
    realFetch: false,
    realFetchHost: {},
    httpRes: {},
    dbRes: {},
    fileRes: {},
    configPool: {},
};

const init = (type, inputs) => {
    // logic type
    _mockRuntime.logicType = type;

    // verbose mode
    _mockRuntime.verbose = inputs.verbose;

    // payload
    if ("http" in inputs.payload) {
        _mockRuntime.payload = {
            http: {
                apiGatewayIdentityContext: {
                    id: "mocked-api-gateway-id",
                    name: "mocked-api-gateway",
                },
                apiGatewayIdentityContext: {
                    id: "mocked-api-route-id",
                    name: "mocked-api-route",
                },
                requestId: "mocked-request-id",
                request: {
                    host: "mocked-http-host",
                    path: "/api/path",
                    scheme: "https",
                    method: "POST",
                    version: "HTTP/1.1",
                    headers: {
                        "content-type":
                            inputs.payload.http.request?.headers[
                                "content-type"
                            ] || "application/json",
                        authorization: "Basic mocked-credentials-base64-string",
                    },
                    query: (inputs.payload.http.request.query || "").replace(
                        "?",
                        "",
                    ),
                    data: Deno.core.encode(
                        inputs.payload.http.request.data || "",
                    ),
                },
                source: {
                    socketAddr: {
                        address: "0.0.0.0",
                        protocol: "tcp",
                    },
                },
                destination: {
                    socketAddr: {
                        address: "0.0.0.0",
                        protocol: "tcp",
                    },
                },
            },
        };
    } else if ("messageQueue" in inputs.payload) {
        _mockRuntime.payload = {
            messageQueue: {
                clientIdentityContext: {
                    id: "mocked-mq-client-id",
                    name: "mocked-mq-client-route",
                },
                subscriber: {
                    brokers: ["mocked-mq-broker"],
                    groupId: "mocked-mq-group=id",
                    topic:
                        inputs.payload?.messageQueue?.subscriber?.topic ||
                        "mocked-mq-topic",
                    partition:
                        inputs.payload?.messageQueue?.subscriber?.partition ||
                        0,
                    offset:
                        inputs.payload?.messageQueue?.subscriber?.topic || 0,
                },
                data: inputs.payload?.messageQueue?.subscriber?.data || "",
            },
        };
    } else {
        _mockRuntime.payload = {
            event: {},
        };
    }

    // task
    _mockRuntime.task = {
        taskKey: {
            taskId: "mocked-task-id",
            executionId: "mocked-execution-id",
        },
        taskId: {
            id: "mocked-task-id",
            executionId: "mocked-execution-id",
        },
        startTimestamp: "1970-01-01T00:00:00Z",
        startAt: "1970-01-01T00:00:00Z",
        dataProcess: {
            name: "mocked-data-process",
            permanentIdentity: "mocked-data-process-pid",
            revision: 1,
        },
        currentLogic: {
            name: "mocked-logic",
            permanentIdentity: "mocked-logic-pid",
            revision: 1,
        },
        executedLogics: [
            {
                name: "mocked-executed-logic-1",
                permanentIdentity: "mocked-executed-logic-pid-1",
                revision: 1,
            },
            {
                name: "mocked-executed-logic-2",
                permanentIdentity: "mocked-executed-logic-pid-2",
                revision: 1,
            },
        ],
    };

    // logic variable
    try {
        _mockRuntime.logicVar = JSON.parse(inputs.logicVar);
    } catch (e) {
        throw new Error(
            "[LOGIC BUNDLER]: logic variable input data is not valid JSON",
        );
    }
    for (const key in _mockRuntime.logicVar) {
        if (typeof _mockRuntime.logicVar[key] === "object") {
            _mockRuntime.logicVar[key] = JSON.stringify(
                _mockRuntime.logicVar[key],
                null,
                0,
            );
        } else {
            _mockRuntime.logicVar[key] = String(_mockRuntime.logicVar[key]);
        }
    }

    // session storage
    let sessionData = {};
    try {
        sessionData = JSON.parse(inputs.session);
    } catch (e) {
        throw new Error(
            `<LOGIC BUNDLER>: session input data is not valid JSON: ${e}`,
        );
    }
    for (const key in sessionData) {
        if (typeof sessionData[key] === "object") {
            _mockRuntime.session[key] = {
                Json: sessionData[key],
            };
        } else {
            _mockRuntime.session[key] = {
                String: String(sessionData[key]),
            };
        }
    }

    // local storage
    _mockRuntime.local = {};

    // events
    let events = [];
    try {
        events = JSON.parse(inputs.events);
        if (!Array.isArray(events))
            throw new Error(
                "<LOGIC BUNDLER>: mocked event data is not an array",
            );
    } catch (e) {
        throw new Error(
            `<LOGIC BUNDLER>: mocked event data is not valid JSON: ${e}`,
        );
    }
    let eventId = 0;
    for (const event of events) {
        ["labelName", "sourceDID", "targetDID", "meta", "type"].forEach(
            (field) => {
                if (!(field in event)) {
                    throw new Error(
                        `<LOGIC BUNDLER>: mocked event missing field: ${field}`,
                    );
                }
            },
        );
        _mockRuntime.events.push({
            label: {
                name: event.labelName,
                id: genMockPID(),
            },
            sourceDigitalIdentity: event.sourceDID,
            targetDigitalIdentity: event.targetDID,
            meta: event.meta || "",
            type: event.type || "default",
            sequence: ++eventId,
            timestamp: new Date().toISOString(),
            taskId: _mockRuntime.task.taskKey.taskId,
            executionId: _mockRuntime.task.taskKey.executionId,
            dataProcessIdentityContext: _mockRuntime.task.dataProcess,
            logicIdentityContext: _mockRuntime.task.currentLogic,
        });
    }

    // http responses
    _mockRuntime.realFetch = inputs.realFetch;
    try {
        _mockRuntime.realFetchHost = JSON.parse(inputs.realFetchHost);
    } catch (e) {
        throw new Error(
            `<LOGIC BUNDLER>: mocked HTTP response data is not valid JSON: ${e}`,
        );
    }
    try {
        _mockRuntime.httpRes = JSON.parse(inputs.httpRes);
    } catch (e) {
        throw new Error(
            `<LOGIC BUNDLER>: mocked HTTP response data is not valid JSON: ${e}`,
        );
    }

    // db responses
    try {
        _mockRuntime.dbRes = JSON.parse(inputs.dbRes);
    } catch (e) {
        throw new Error(
            `<LOGIC BUNDLER>: mocked DB response data is not valid JSON: ${e}`,
        );
    }

    // file responses
    try {
        _mockRuntime.fileRes = JSON.parse(inputs.fileRes);
    } catch (e) {
        throw new Error(
            `<LOGIC BUNDLER>: mocked file response data is not valid JSON: ${e}`,
        );
    }
};

// ========== agent implementation ==========

// AggregatorContext.initializePayload
const op_fetch_payload = async () => _mockRuntime.payload;

// AggregatorContext.initializeTask
const op_fetch_task = () => _mockRuntime.task;

// LogicVariable.get
const op_logic_variable_get = (name) => _mockRuntime.logicVar[name] || null;

// ResultAgent.finalize
const op_result_agent_set = (value) => {
    if (_mockRuntime.logicType != "aggregator")
        throw new Error(
            "<LOGIC TESTER> result agent is only available in aggregator logic",
        );
    console.log(
        `[RESULT AGENT]\n\ntask result:\n\n${JSON.stringify(value, null, 4)}\n\n(If the HTTP code is not overridden using httpStatusCode(), it will be 200)`,
    );
};

// ResultAgent.httpStatusCode
const op_result_agent_set_http_status_code = (statusCode) => {
    console.log(
        `[RESULT AGENT]\n\ntask result HTTP status code is set to ${statusCode}`,
    );
};

// LoggingAgent.log
const op_log = (record) => {
    let msgType;
    let msg;
    if ("Plaintext" in record.message) {
        msgType = "plaintext";
        msg = record.message.Plaintext;
    } else {
        msgType = "json";
        msg = JSON.stringify(record.message.Json, null, 0);
        try {
            JSON.parse(msg);
        } catch (e) {
            throw new Error(
                `<LOGGING AGENT>: cannot write non-JSON object to log (value: ${msg})`,
            );
        }
    }
    const log = `${new Date().toISOString()}\t${record.level.toLowerCase()}\t${msgType}\t${msg}\n`;
    console.log(`[LOGGING AGENT]\n\n${log}`);
};

// SessionStorageAgent.get
const op_session_storage_agent_get = async (key) => {
    const value = _mockRuntime.session[key] || null;
    if (value) {
        if ("Json" in value) {
            if (_mockRuntime.verbose)
                console.log(
                    `[SESSION STORAGE AGENT]\n\nreading session (key: '${key}', Json value: ${JSON.stringify(
                        value.Json,
                        null,
                        0,
                    )})`,
                );
            return value.Json;
        } else if ("String" in value) {
            if (_mockRuntime.verbose)
                console.log(
                    `[SESSION STORAGE AGENT]\n\nreading session (key: '${key}', string value: ${value.String})`,
                );
            return value.String;
        } else if ("ByteArray" in value) {
            if (_mockRuntime.verbose)
                console.log(
                    `[SESSION STORAGE AGENT]\n\nreading session (key: '${key}', bytearray value: ${JSON.stringify(
                        value.ByteArray,
                    )})`,
                );
            return value.ByteArray;
        }
    }
    console.log(
        `[SESSION STORAGE AGENT]\n\nwarning: key ${key} not found in session storage`,
    );
    return null;
};

// SessionStorageAgent.put
const op_session_storage_agent_put = async (input) => {
    let { key, value } = input;
    if (!value)
        throw new Error(
            `<SESSION STORAGE AGENT>: cannot write null or undefined value to session storage (key: '${key}')`,
        );
    if ("Json" in value) {
        try {
            JSON.parse(JSON.stringify(value.Json));
        } catch (e) {
            console.log(
                `[SESSION STORAGE AGENT]\n\nwarning: invalid JSON value (key: '${key}').\nThis will cause an error thrown from LOC runtime`,
            );
            return;
        }
        if (_mockRuntime.verbose)
            console.log(
                `[SESSION STORAGE AGENT]\n\nwriting session (key: '${key}', Json value: ${JSON.stringify(
                    value.Json,
                    null,
                    0,
                )})`,
            );
    } else if ("String" in value) {
        if (typeof value.String != "string")
            throw new Error(
                `<SESSION STORAGE AGENT>: writing non-string as string to session storage (key: ${key}, value: ${value.String})`,
            );
        if (_mockRuntime.verbose)
            console.log(
                `[SESSION STORAGE AGENT]\n\nwriting session (key: '${key}', string value: ${value.String})`,
            );
    } else if ("ByteArray" in value) {
        if (_mockRuntime.verbose)
            console.log(
                `[SESSION STORAGE AGENT]\n\nwriting session (key: '${key}', bytearray value: ${JSON.stringify(
                    value.ByteArray,
                )})`,
            );
    }
    _mockRuntime.session[key] = value;
    return true;
};

// SessionStorageAgent.delete
const op_session_storage_agent_delete = async (key) => {
    if (_mockRuntime.verbose)
        console.log(
            `[SESSION STORAGE AGENT]\n\ndeleting value in session (key: '${key}')`,
        );
    try {
        delete _mockRuntime.session[key];
    } catch (e) {
        console.log(
            `[SESSION STORAGE AGENT]\n\nwarning: key '${key}' not found in session storage`,
        );
    }
};

// LocalStorageAgent.get
const op_local_storage_agent_get = async (key) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> local storage agent is only available in generic logic",
        );
    const value = _mockRuntime.local[key] || null;
    if (value) {
        if ("Json" in value) {
            if (_mockRuntime.verbose)
                console.log(
                    `[LOCAL STORAGE AGENT]\n\nreading local storage (key: '${key}', value: ${JSON.stringify(
                        value.Json,
                        null,
                        0,
                    )})`,
                );
            return value.Json;
        } else if ("String" in value) {
            if (_mockRuntime.verbose)
                console.log(
                    `[LOCAL STORAGE AGENT]\n\nreading local storage (key: '${key}', value: ${value.String})`,
                );
            return value.String;
        } else {
            if (_mockRuntime.verbose)
                console.log(
                    `[LOCAL STORAGE AGENT]\n\nreading local storage (key: '${key}', value: ${JSON.stringify(
                        value.Json,
                    )})`,
                );
            return value.ByteArray;
        }
    }
    console.log(
        `[LOCAL STORAGE AGENT]\n\nwarning: key '${key}' not found in local storage`,
    );
    return null;
};

// LocalStorageAgent.put
const op_local_storage_agent_put = async (input) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> local storage agent is only available in generic logic",
        );
    let { key, value } = input;
    if (!value)
        throw new Error(
            `<LOCAL STORAGE AGENT>: cannot write null or undefined value to local storage (key: '${key}')`,
        );
    if ("Json" in value) {
        try {
            JSON.parse(JSON.stringify(value.Json));
        } catch (e) {
            console.log(
                `[LOCAL STORAGE AGENT]\n\nwarning: invalid JSON value (key: '${key}').\nThis will cause an error thrown from LOC runtime.`,
            );
            return;
        }
        f(_mockRuntime.verbose);
        console.log(
            `[LOCAL STORAGE AGENT]\n\nwriting local storage (key: '${key}', Json value: ${JSON.stringify(
                value.Json,
                null,
                0,
            )})`,
        );
    } else if ("String" in value) {
        if (typeof value.String != "string")
            throw new Error(
                `<LOCAL STORAGE AGENT>: writing non-string as string to local storage (key: '${key}', value: ${value.String})`,
            );
        f(_mockRuntime.verbose);
        console.log(
            `[LOCAL STORAGE AGENT]\n\nwriting local storage (key: '${key}', string value: ${value.String})`,
        );
    } else if ("ByteArray" in value) {
        if (_mockRuntime.verbose)
            console.log(
                `[LOCAL STORAGE AGENT]\n\nwriting local storage (key: '${key}', bytearray value: ${JSON.stringify(
                    value.ByteArray,
                )})`,
            );
    }
    _mockRuntime.local[key] = value;
    return true;
};

// LocalStorageAgent.delete
const op_local_storage_agent_delete = async (key) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> local storage agent is only available in generic logic",
        );
    if (_mockRuntime.verbose)
        console.log(
            `[LOCAL STORAGE AGENT]\n\ndeleting value in local storage (key: '${key}')`,
        );
    try {
        delete _mockRuntime.session[key];
    } catch (e) {
        console.log(
            `[LOCAL STORAGE AGENT]\n\nwarning: key '${key}' not found in local storage`,
        );
    }
};

// EvengAgent.emit
const op_event_agent_emit = async (eventsArgs) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> event agent is only available in generic logic",
        );
    if (_mockRuntime.verbose)
        console.log(
            `[EVENT AGENT]\n\nemitting event(s):\n\n${JSON.stringify(
                eventsArgs,
                null,
                4,
            )}`,
        );
    let eventId = 0;
    for (const event of eventsArgs) {
        _mockRuntime.events.push({
            label: {
                name: event.labelName,
                id: genMockPID(),
            },
            sourceDigitalIdentity: event.sourceDigitalIdentity,
            targetDigitalIdentity: event.targetDigitalIdentity,
            meta: event.meta || "",
            type: event.type || "default",
            sequence: ++eventId,
            timestamp: new Date().toISOString(),
            taskId: _mockRuntime.task.taskKey.taskId,
            executionId: _mockRuntime.task.taskKey.executionId,
            dataProcessIdentityContext: _mockRuntime.task.dataProcess,
            logicIdentityContext: _mockRuntime.task.currentLogic,
        });
    }
};

// EvengAgent.search
const op_event_agent_search = async (request) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> event agent is only available in generic logic",
        );
    let searchedEvents = [..._mockRuntime.events];
    if (request.queries && searchedEvents) {
        request.queries.forEach((query) => {
            searchedEvents = searchedEvents.filter((event) => {
                return compareField(
                    query.type,
                    query.value,
                    getEventValue(event, query.field),
                );
            });
        });
    }
    if (request.excludes && searchedEvents) {
        request.excludes.forEach((query) => {
            searchedEvents = searchedEvents.filter((event) => {
                return !compareField(
                    query.type,
                    query.value,
                    getEventValue(event, query.field),
                );
            });
        });
    }
    if (request.filters && searchedEvents) {
        request.filters.forEach((query) => {
            searchedEvents = searchedEvents.filter((event) => {
                return filterField(
                    query.type,
                    query?.gte,
                    query?.lte,
                    query.value,
                    getEventValue(event, query.field),
                );
            });
        });
    }
    if (request.sorts && searchedEvents) {
        request.sorts.forEach((sort) => {
            searchedEvents.sort((a, b) => {
                const valueA = getEventValue(a, sort.field);
                const valueB = getEventValue(b, sort.field);
                switch (request.sorts.order) {
                    case "asc":
                        return valueA > valueB ? 1 : -1;
                    case "desc":
                        return valueA < valueB ? 1 : -1;
                    default:
                        throw new Error(
                            `<EVENT AGENT>: invalid event sort parameter: ${request.sorts.order}`,
                        );
                }
            });
        });
    }
    if (request.from) {
        searchedEvents = searchedEvents.slice(
            request.from,
            request.size
                ? request.from + request.size < searchedEvents.length
                    ? request.from + request.size + 1
                    : searchedEvents.length
                : searchedEvents.length,
        );
    }
    if (_mockRuntime.verbose)
        console.log(
            `[EVENT AGENT]\n\nqueried event(s):\n\n${JSON.stringify(
                searchedEvents.map((event) => {
                    return {
                        label_name: event.label.name,
                        source_digital_identity: event.sourceDigitalIdentity,
                        target_digital_identity: event.targetDigitalIdentity,
                        meta: event.meta,
                        type: event.type,
                    };
                }),
                null,
                4,
            )}`,
        );
    return {
        events: searchedEvents,
        counts: request.size,
        total: searchedEvents.length,
        took: 0,
        aggregation: null,
    };
};

// EvengAgent.searchWithPattern
const op_event_agent_search_with_pattern = async (request) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> event agent is only available in generic logic",
        );
    console.log(
        "[EVENT AGENT]\n\nwarning: search event sequence is not implemented and only returns an empty array",
    );
    return {
        events: [],
        counts: 0,
        total: 0,
        took: 0,
        aggregation: null,
    };
};

// EventAgent helpers
const getEventValue = (event, field) => {
    switch (field) {
        case "data_process_permanent_identity":
            return event.dataProcessIdentityContext.permanentIdentity;
        case "data_process_name":
            return event.dataProcessIdentityContext.name;
        case "data_process_revision":
            return event.dataProcessIdentityContext.revision;
        case "logic_permanent_identity":
            return event.logicIdentityContext.permanentIdentity;
        case "logic_name":
            return event.logicIdentityContext.name;
        case "execution_id":
            return event.executionId;
        case "task_id":
            return event.taskId;
        case "sequence":
            return event.sequence;
        case "label_id":
            return event.label.id;
        case "label_name":
            return event.label.name;
        case "source_digital_identity":
            return event.sourceDigitalIdentity;
        case "target_digital_identity":
            return event.targetDigitalIdentity;
        case "type":
            return event.type;
        case "timestamp":
            return event.timestamp;
        default:
            throw new Error(
                `<EVENT AGENT>: invalid event field name for query/exclude/filter/sort: ${field}`,
            );
    }
};
const compareField = (type, valueQuery, valueEvent) => {
    switch (type) {
        case "match":
            return valueEvent.trim().includes(valueQuery.trim());
        case "match_phrase":
            return valueEvent.trim().includes(valueQuery.trim());
        case "term":
            return valueEvent === valueQuery;
        default:
            throw new Error(
                `<EVENT AGENT>: incorrect event query/exclude type: ${type}`,
            );
    }
};
const filterField = (type, gte, lte, valueQuery, valueEvent) => {
    switch (type) {
        case "range":
            if (gte && valueEvent < valueQuery) return false;
            if (lte && valueEvent > valueQuery) return false;
            return true;
        case "wildcard":
            const regex = new RegExp(
                "^" + valueQuery.replace(/\*/g, ".*").replace(/\?/g, ".") + "$",
            );
            return regex.test(valueEvent);
        default:
            throw new Error(`<EVENT AGENT>: invalid filter type: ${type}`);
    }
};

// HTTP/Database/FileStorage/MailAgent.acquire
const op_agent_acquire = async (configurationName) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> HTTP/database/file storage/mail agent are only available in generic logic",
        );
    const uid = genMockPID();
    _mockRuntime.configPool[uid] = configurationName;
    return uid;
};

// mocked fetch for HttpAgentClient.fetch
export const sdkFetch = async (configurationId, input, init) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> HTTP agent is only available in generic logic",
        );
    let path = "";
    let method = "GET";
    if (typeof input != "string" && input?.method) {
        method = input.method;
    } else if (init?.method) {
        method = init.method;
    }
    method = method.toUpperCase();
    if (_mockRuntime.realFetch) {
        // use real fetch
        let host = "";
        const configRef = _mockRuntime.configPool[configurationId];
        if (configRef) {
            host = _mockRuntime.realFetchHost[configRef];
            if (!host)
                throw new Error(
                    `<HTTP AGENT>: configure reference '${configRef}' not found`,
                );
        }
        if (typeof input === "string") {
            path = host + input;
            input = path;
        } else if (input?.url) {
            path = host + input.url;
            input = path;
        } else if (init?.url) {
            path = host + init.url;
            input = path;
        }
        if (_mockRuntime.verbose)
            console.log(
                `[HTTP AGENT]\n\nsending actual HTTP request:\n\n${method} ${path}`,
            );
        const res = await fetch(input, init);
        if (_mockRuntime.verbose)
            console.log(
                `[HTTP AGENT]\n\n${httpRawResponse(res)} ${
                    res.ok
                        ? "✓\n\n(info: to read the response body (a ReadableStream object or null), use 'await response.text()' or 'await response.json()"
                        : "✗"
                }`,
            );
        return res;
    } else {
        // use mock fetch
        if (typeof input === "string") {
            path = input;
        } else if (input?.url) {
            path = input.url;
        } else if (init?.url) {
            path = init.url;
        }
        const pathNoParam = path.split("?")[0];
        if (pathNoParam in _mockRuntime.httpRes) {
            if (_mockRuntime.verbose)
                console.log(
                    `[HTTP AGENT]\n\nsending mocked HTTP request:\n\n${method} ${path}`,
                );
            const response = _mockRuntime.httpRes[pathNoParam];
            if (method in response) {
                const rawBody = response[method]?.body || null;
                let body = "";
                let headers = {};
                if (rawBody) {
                    body =
                        typeof rawBody === "object"
                            ? JSON.stringify(rawBody)
                            : String(rawBody);
                    headers =
                        response[method]?.headers ||
                        new Headers({
                            "Content-Type": "text/plain",
                        });
                }
                const res = new Response(body, {
                    status: 200,
                    statusText: "OK",
                    headers: headers,
                });
                if (_mockRuntime.verbose)
                    console.log(
                        `[HTTP AGENT]\n\n${httpRawResponse(
                            res,
                        )} ✓\n\n(info: to read the response body (a ReadableStream object or null), use 'await response.text()' or 'await response.json()'.`,
                    );
                return res;
            } else {
                const res = new Response(null, {
                    status: 405,
                    statusText: "Method Not Allowed",
                    headers: {},
                });
                if (_mockRuntime.verbose)
                    console.log(`[HTTP AGENT]\n\n${httpRawResponse(res)} ✗`);
                return res;
            }
        } else {
            const res = new Response(null, {
                status: 404,
                statusText: "Not found",
                headers: {},
            });
            if (_mockRuntime.verbose)
                console.log(`[HTTP AGENT]\n\n${httpRawResponse(res)} ✗`);
            return res;
        }
    }
};

const httpRawResponse = (res) => `HTTP/1.1 ${res.status} ${res.statusText}`;

// DatabaseClient.query
const op_database_agent_query = async (query) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> database agent is only available in generic logic",
        );
    if (!_mockRuntime.configPool[query.uid])
        throw new Error(
            "<DATABASE AGENT>: database client is already released",
        );
    const results = _mockRuntime.dbRes[query.rawSql] || {};
    if (_mockRuntime.verbose)
        console.log(
            `[DATABASE AGENT]\n\nquery mock database: (statement: '${
                query.rawSql
            }')\n\nResult(s):\n\n${JSON.stringify(results, null, 4)}`,
        );
    return results;
};

// DatabaseClient.execute
const op_database_agent_execute = async (query) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> database agent is only available in generic logic",
        );
    if (!_mockRuntime.configPool[query.uid])
        throw new Error(
            "<DATABASE AGENT>: database client is already released",
        );
    if (_mockRuntime.verbose)
        console.log(
            `[DATABASE AGENT]\n\nquery mock database: (statement: '${query.rawSql}')`,
        );
};

// DatabaseClient.release
const op_database_agent_release = async (uid) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> database agent is only available in generic logic",
        );
    if (!_mockRuntime.configPool[uid])
        throw new Error(
            "<DATABASE AGENT>: database client is already released",
        );
    delete _mockRuntime.configPool[uid];
    if (_mockRuntime.verbose)
        console.log("[DATABASE AGENT]\n\ndatabase client released");
};

// DatabaseClient.beginTransaction
const op_database_agent_begin_transaction = async (uid) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> database agent is only available in generic logic",
        );
    if (!_mockRuntime.configPool[uid])
        throw new Error(
            "<DATABASE AGENT>: database client is already released",
        );
    if (_mockRuntime.verbose)
        console.log(
            "[DATABASE AGENT]\n\nbegan a transaction\nwarning: the logic tester does not track transactions",
        );
};

// DatabaseClient.commitTransaction
const op_database_agent_commit_transaction = async (uid) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> database agent is only available in generic logic",
        );
    if (!_mockRuntime.configPool[uid])
        throw new Error(
            "<DATABASE AGENT>: database client is already released",
        );
    if (_mockRuntime.verbose)
        console.log(
            "[DATABASE AGENT]\n\ncommitted a transaction\nwarning: the logic tester does not track transactions",
        );
};

// DatabaseClient.rollbackTransaction
const op_database_agent_rollback_transaction = async (uid) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> database agent is only available in generic logic",
        );
    if (!_mockRuntime.configPool[uid])
        throw new Error(
            "<DATABASE AGENT>: database client is already released",
        );
    if (_mockRuntime.verbose)
        console.log(
            "[DATABASE AGENT]\n\nrollback a transaction\nwarning: the logic tester does not track transactions",
        );
};

// FileStorageAgentClient.simpleGet
const op_file_storage_agent_simple_get = async (options) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> file storage agent is only available in generic logic",
        );
    let { uid, path } = options;
    let currentTarget = _mockRuntime.fileRes;
    if (path.trim()) {
        const parhArray = path.trim().split("/");
        for (const [index, pathTarget] of parhArray.entries()) {
            if (pathTarget in currentTarget) {
                currentTarget = currentTarget[pathTarget];
            } else {
                throw new Error(
                    `<FILE STORAGE AGENT>: cannot get file at '${path}': invalid path`,
                );
            }
        }
    }
    if (!isFile(currentTarget))
        throw new Error(`cannot get '${path}': not a file`);
    if (_mockRuntime.verbose)
        console.log(
            `[FILE STORAGE AGENT]\n\nfile found at '${path}':\n\n${currentTarget}`,
        );
    return (typeof currentTarget) instanceof Uint8Array
        ? currentTarget
        : Deno.core.encode(String(currentTarget));
};

// FileStorageAgentClient.simplePut
const op_file_storage_agent_simple_put = async (options, content) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> file storage agent is only available in generic logic",
        );
    let { uid, path } = options;
    let currentTarget = _mockRuntime.fileRes;
    if (path.trim()) {
        const parhArray = path.trim().split("/");
        for (const [index, pathTarget] of parhArray.entries()) {
            if (pathTarget in currentTarget && index < parhArray.length - 1) {
                currentTarget = currentTarget[pathTarget];
            } else if (index === parhArray.length - 1) {
                if (
                    currentTarget[pathTarget] &&
                    !isFile(currentTarget[pathTarget])
                )
                    throw new Error(
                        `<FILE STORAGE AGENT>: cannot write file at '${path}': path is an existing directory`,
                    );
                currentTarget[pathTarget] = content;
                if (_mockRuntime.verbose)
                    console.log(
                        `[FILE STORAGE AGENT]\n\nfile written at '${path}' (${content})`,
                    );
            } else {
                throw new Error(
                    `<FILE STORAGE AGENT>: cannot write content at '${path}': invalid path`,
                );
            }
        }
    }
};

// FileStorageAgentClient.delete
const op_file_storage_agent_delete = async (options) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> file storage agent is only available in generic logic",
        );
    let { uid, path } = options;
    let currentTarget = _mockRuntime.fileRes;
    if (path.trim()) {
        const parhArray = path.trim().split("/");
        for (const [index, pathTarget] of parhArray.entries()) {
            if (pathTarget in currentTarget && index < parhArray.length - 1) {
                currentTarget = currentTarget[pathTarget];
            } else {
                if (
                    index === parhArray.length - 1 &&
                    (!(pathTarget in currentTarget) ||
                        !isFile(currentTarget[pathTarget]))
                )
                    throw new Error(
                        `<FILE STORAGE AGENT>: cannot delete file at '${path}': invalid path or filename`,
                    );
            }
        }
    }
    delete currentTarget[pathTarget];
    if (_mockRuntime.verbose)
        console.log(`[FILE STORAGE AGENT]\n\nfile deleted at '${path}'`);
};

// FileStorageAgentClient.list
const op_file_storage_agent_list = async (options) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> file storage agent is only available in generic logic",
        );
    let { uid, path } = options;
    let currentTarget = _mockRuntime.fileRes;
    if (path.trim()) {
        const parhArray = path.trim().split("/");
        for (const [index, pathTarget] of parhArray.entries()) {
            if (pathTarget in currentTarget) {
                currentTarget = currentTarget[pathTarget];
            } else {
                throw new Error(
                    `<FILE STORAGE AGENT>: cannot list content at '${path}': invalid path`,
                );
            }
        }
    }
    if (isFile(currentTarget))
        throw new Error(
            `<FILE STORAGE AGENT>: cannot list content at '${path}': not a directory`,
        );
    let fileList = [];
    for (const item in currentTarget) {
        if (!isFile(currentTarget[item])) {
            fileList.push({
                name: item,
                type: "directory",
            });
        } else {
            fileList.push({
                name: item,
                type: "file",
            });
        }
    }
    if (_mockRuntime.verbose)
        console.log(
            `[FILE STORAGE AGENT]\n\nfiles/directories list at '${path}':\n\n${JSON.stringify(
                fileList,
                null,
                4,
            )}`,
        );
    return fileList;
};

// FileStorageAgentClient.createDirAll
const op_file_storage_agent_create_dir_all = async (options) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> file storage agent is only available in generic logic",
        );
    let { uid, path } = options;
    let currentTarget = _mockRuntime.fileRes;
    if (path.trim()) {
        const parhArray = path.trim().split("/");
        for (const [index, pathTarget] of parhArray.entries()) {
            if (pathTarget in currentTarget && index < parhArray.length - 1) {
                currentTarget = currentTarget[pathTarget];
            } else if (index === parhArray.length - 1) {
                if (
                    currentTarget[pathTarget] &&
                    isFile(currentTarget[pathTarget])
                )
                    throw new Error(
                        `<FILE STORAGE AGENT>: cannot create directory at '${path}': directory already exists`,
                    );
                currentTarget[pathTarget] = {};
                if (_mockRuntime.verbose)
                    console.log(
                        `[FILE STORAGE AGENT]\n\ndirectory created at '${path}'`,
                    );
            } else {
                throw new Error(
                    `<FILE STORAGE AGENT>: cannot create directory at '${path}': invalid path`,
                );
            }
        }
    }
};

const isFile = (input) => {
    if (typeof input == "object" && !Array.isArray(input)) return false;
    else return true;
};

// MailAgentClient.send
const op_mail_agent_send = async (mail) => {
    if (_mockRuntime.logicType != "generic")
        throw new Error(
            "<LOGIC TESTER> mail agent is only available in generic logic",
        );
    if (_mockRuntime.verbose)
        console.log(
            `[MAIL AGENT]\n\nsending mocked email...

receivers: ${mailNameList(mail.mail.receivers)}
sender: ${mailNameFormat(mail.mail.sender)}
replyTo: ${mailNameFormat(mail.mail.replyTo)}
cc: ${mailNameList(mail.mail.cc)}
bcc: ${mailNameList(mail.mail.bcc)}
body: 

${mail.mail.body}
`,
        );
};

const mailNameList = (mails) => {
    return mails && mails.length > 0
        ? mails.map((mail) => mailNameFormat(mail)).join(", ")
        : "(none)";
};

const mailNameFormat = (mail) =>
    mail.name ? `'${mail.name} <${mail.mail}>'` : `'${mail.mail}'`;

export const Deno = {
    core: {
        init,
        encode: (input) => new TextEncoder().encode(input),
        ops: {
            op_fetch_task,
            op_logic_variable_get,
            op_result_agent_set,
            op_result_agent_set_http_status_code,
            op_log,
        },
        opAsync: async (name, ...args) => {
            switch (name) {
                case "op_fetch_payload":
                    return op_fetch_payload(...args);
                case "op_session_storage_agent_get":
                    return op_session_storage_agent_get(...args);
                case "op_session_storage_agent_put":
                    return op_session_storage_agent_put(...args);
                case "op_session_storage_agent_delete":
                    return op_session_storage_agent_delete(...args);
                case "op_local_storage_agent_get":
                    return op_local_storage_agent_get(...args);
                case "op_local_storage_agent_put":
                    return op_local_storage_agent_put(...args);
                case "op_local_storage_agent_delete":
                    return op_local_storage_agent_delete(...args);
                case "op_event_agent_emit":
                    return op_event_agent_emit(...args);
                case "op_event_agent_search":
                    return op_event_agent_search(...args);
                case "op_event_agent_search_with_pattern":
                    return op_event_agent_search_with_pattern(...args);
                case "op_http_agent_acquire":
                case "op_database_agent_acquire":
                case "op_file_storage_agent_acquire":
                case "op_mail_agent_acquire":
                    return op_agent_acquire(...args);
                case "op_database_agent_query":
                    return op_database_agent_query(...args);
                case "op_database_agent_execute":
                    return op_database_agent_execute(...args);
                case "op_database_agent_release":
                    return op_database_agent_release(...args);
                case "op_database_agent_begin_transaction":
                    return op_database_agent_begin_transaction(...args);
                case "op_database_agent_commit_transaction":
                    return op_database_agent_commit_transaction(...args);
                case "op_database_agent_rollback_transaction":
                    return op_database_agent_rollback_transaction(...args);
                case "op_file_storage_agent_simple_get":
                    return op_file_storage_agent_simple_get(...args);
                case "op_file_storage_agent_simple_put":
                    return op_file_storage_agent_simple_put(...args);
                case "op_file_storage_agent_delete":
                    return op_file_storage_agent_delete(...args);
                case "op_file_storage_agent_list":
                    return op_file_storage_agent_list(...args);
                case "op_file_storage_agent_create_dir_all":
                    return op_file_storage_agent_create_dir_all(...args);
                case "op_mail_agent_send":
                    return op_mail_agent_send(...args);
            }
        },
    },
};

// helpers

const makeid = (len) => {
    let text = [];
    const possible =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < len; i++)
        text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    return text.join("");
};

const genMockPID = () =>
    `${makeid(8)}-${makeid(4)}-${makeid(4)}-${makeid(4)}-${makeid(12)}`;
