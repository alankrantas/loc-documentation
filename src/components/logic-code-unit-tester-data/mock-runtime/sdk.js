// mostly copied from @fstnetwork/runtime/target/index.js
// see: https://www.npmjs.com/package/@fstnetwork/runtime/v/0.9.0-1?activeTab=code

import { Deno, sdkFetch } from "deno";

class AbstractContext {
    #payload;
    #task;
    async payload() {
        if (this.#payload === undefined) {
            this.#payload = await fetchPayload();
        }
        return this.#payload;
    }
    get task() {
        if (this.#task === undefined) {
            this.#task = fetchTask();
        }
        return this.#task;
    }
}
async function fetchPayload() {
    return Deno.core.opAsync("op_fetch_payload");
}
function fetchTask() {
    const task = Deno.core.ops["op_fetch_task"]?.();
    task.taskId = {
        id: task.taskKey.taskId,
        executionId: task.taskKey.executionId,
    };
    task.startAt = task.startTimestamp;
    return task;
}

class AggregatorContext extends AbstractContext {}

class GenericContext extends AbstractContext {}

class RailwayError extends Error {
    logicPermanentIdentity;
    logicRevision;
    constructor(name, message, logicPermanentIdentity, logicRevision) {
        super(message);
        this.name = name;
        this.logicPermanentIdentity = logicPermanentIdentity;
        this.logicRevision = logicRevision;
    }
}

const LogicVariable = {
    get(name) {
        return Deno.core.ops["op_logic_variable_get"]?.(name);
    },
};

const SessionStorageAgent = {
    async get(key) {
        return Deno.core.opAsync("op_session_storage_agent_get", key);
    },
    async putJson(key, value) {
        return Deno.core.opAsync("op_session_storage_agent_put", {
            key,
            value: { Json: value },
        });
    },
    async putString(key, value) {
        return Deno.core.opAsync("op_session_storage_agent_put", {
            key,
            value: { String: value },
        });
    },
    async putByteArray(key, value) {
        const byteArray =
            typeof value === "string" ? Deno.core.encode(value) : value;
        return Deno.core.opAsync("op_session_storage_agent_put", {
            key,
            value: { ByteArray: byteArray },
        });
    },
    async delete(key) {
        await Deno.core.opAsync("op_session_storage_agent_delete", key);
    },
    async remove(key) {
        await this.delete(key);
    },
};

const LocalStorageAgent = {
    async get(key) {
        return Deno.core.opAsync("op_local_storage_agent_get", key);
    },
    async putString(key, value, timeout) {
        await Deno.core.opAsync("op_local_storage_agent_put", {
            key,
            value: { String: value },
            timeout,
        });
    },
    async putByteArray(key, value, timeout) {
        const byteArray =
            typeof value === "string" ? Deno.core.encode(value) : value;
        await Deno.core.opAsync("op_local_storage_agent_put", {
            key,
            value: { ByteArray: byteArray },
            timeout,
        });
    },
    async putJson(key, value, timeout) {
        await Deno.core.opAsync("op_local_storage_agent_put", {
            key,
            value: { Json: value },
            timeout,
        });
    },
    async delete(key) {
        await Deno.core.opAsync("op_local_storage_agent_delete", key);
    },
    async remove(key) {
        await this.delete(key);
    },
};

const EventAgent = {
    async emit(events) {
        const eventsArgs = events.map((event) => {
            const {
                labelName,
                sourceDigitalIdentity,
                targetDigitalIdentity,
                sourceDID,
                targetDID,
                meta,
                type,
            } = event;
            const source = sourceDID ?? sourceDigitalIdentity ?? undefined;
            if (source === undefined) {
                throw Error("sourceDigitalIdentity is undefined");
            }
            const target = targetDID ?? targetDigitalIdentity ?? undefined;
            if (target === undefined) {
                throw Error("targetDigitalIdentity is undefined");
            }
            const eventArgs = {
                labelName,
                sourceDigitalIdentity: source,
                targetDigitalIdentity: target,
                meta,
                type,
            };
            return eventArgs;
        });
        await Deno.core.opAsync("op_event_agent_emit", eventsArgs);
    },
    async search(request) {
        return Deno.core.opAsync("op_event_agent_search", request);
    },
    async searchWithPattern(request) {
        return Deno.core.opAsync("op_event_agent_search_with_pattern", request);
    },
};

const LoggingAgent = {
    trace(value) {
        this.log("Trace", value);
    },
    debug(value) {
        this.log("Debug", value);
    },
    info(value) {
        this.log("Info", value);
    },
    warn(value) {
        this.log("Warn", value);
    },
    error(value) {
        this.log("Error", value);
    },
    log(level, value) {
        let message;
        if (typeof value === "string") {
            message = { Plaintext: value };
        } else {
            message = { Json: value };
        }
        const record = { level, message };
        Deno.core.ops["op_log"]?.(record);
    },
};

const ResultAgent = {
    finalize(value) {
        Deno.core.ops["op_result_agent_set"]?.(value);
        return this;
    },
    httpStatusCode(statusCode) {
        Deno.core.ops["op_result_agent_set_http_status_code"]?.(statusCode);
        return this;
    },
};

const HttpAgent = {
    async acquire(configurationName) {
        const configurationId = await Deno.core.opAsync(
            "op_http_agent_acquire",
            configurationName,
        );
        return new HttpAgentClient(configurationId);
    },
};

class HttpAgentClient {
    configurationId;
    constructor(configurationId) {
        this.configurationId = configurationId;
    }
    async fetch(input, init) {
        // return fetch(this.configurationId, input, init);
        return sdkFetch(this.configurationId, input, init);
    }
}

const DatabaseAgent = {
    async acquire(configurationName) {
        const uid = await Deno.core.opAsync(
            "op_database_agent_acquire",
            configurationName,
        );
        return new DatabaseClient(uid);
    },
};
class DatabaseClient {
    uid;
    constructor(uid) {
        this.uid = uid;
    }
    async query(rawSql, params = []) {
        const results = await Deno.core.opAsync("op_database_agent_query", {
            uid: this.uid,
            rawSql,
            params,
        });
        // results.rows = results.rows.reduce((newRows, row) => {
        //   const newRow = {};
        //   for (let i = 0; i < results.columns.length; i++) {
        //     const columnName = results.columns[i]?.name;
        //     if (columnName !== undefined) {
        //       newRow[columnName] = Object.values(row[i])[0];
        //     }
        //   }
        //   newRows.push(newRow);
        //   return newRows;
        // }, []);
        return results;
    }
    async release() {
        await Deno.core.opAsync("op_database_agent_release", this.uid);
    }
    async execute(rawSql, params) {
        return Deno.core.opAsync("op_database_agent_execute", {
            uid: this.uid,
            rawSql,
            params,
        });
    }
    async beginTransaction() {
        await Deno.core.opAsync(
            "op_database_agent_begin_transaction",
            this.uid,
        );
        return this;
    }
    async commitTransaction() {
        await Deno.core.opAsync(
            "op_database_agent_commit_transaction",
            this.uid,
        );
    }
    async rollbackTransaction() {
        await Deno.core.opAsync(
            "op_database_agent_rollback_transaction",
            this.uid,
        );
    }
}

const FileStorageAgent = {
    async acquire(configurationName) {
        const configurationId = await Deno.core.opAsync(
            "op_file_storage_agent_acquire",
            configurationName,
        );
        return new FileStorageAgentClient(configurationId);
    },
};
class FileStorageAgentClient {
    configurationId;
    constructor(configurationId) {
        this.configurationId = configurationId;
    }
    async simpleGet(path) {
        return Deno.core.opAsync("op_file_storage_agent_simple_get", {
            configurationId: this.configurationId,
            path,
        });
    }
    async simplePut(path, data, options) {
        const byteArray =
            typeof data === "string" ? Deno.core.encode(data) : data;
        return Deno.core.opAsync(
            "op_file_storage_agent_simple_put",
            {
                configurationId: this.configurationId,
                path,
                ensureDir: options?.ensureDir ?? false,
            },
            byteArray,
        );
    }
    async delete(path) {
        return Deno.core.opAsync("op_file_storage_agent_delete", {
            configurationId: this.configurationId,
            path,
        });
    }
    async list(path) {
        return Deno.core.opAsync("op_file_storage_agent_list", {
            configurationId: this.configurationId,
            path,
        });
    }
    async createDirAll(path) {
        return Deno.core.opAsync("op_file_storage_agent_create_dir_all", {
            configurationId: this.configurationId,
            path,
        });
    }
}

const MailAgent = {
    async acquire(configurationName) {
        const uid = await Deno.core.opAsync(
            "op_mail_agent_acquire",
            configurationName,
        );
        return new MailAgentClient(uid);
    },
};

class MailAgentClient {
    uid;
    constructor(uid) {
        this.uid = uid;
    }
    async send(mail) {
        if (mail.sender.mail === null) {
            throw new TypeError("mail sender should not be empty");
        }
        if (mail.receivers.length === 0) {
            throw new TypeError("mail receivers should not be empty");
        }
        if (mail.subject.length === 0) {
            throw new TypeError("mail subject should not be empty");
        }
        if (mail.body.length === 0) {
            throw new TypeError("mail body should not be empty");
        }
        return Deno.core.opAsync("op_mail_agent_send", {
            uid: this.uid,
            mail,
        });
    }
}

class Mail {
    sender;
    receivers;
    replyTo;
    cc;
    bcc;
    subject;
    body;
    constructor() {
        this.sender = { mail: "", name: "" };
        this.receivers = [];
        this.replyTo = undefined;
        this.cc = [];
        this.bcc = [];
        this.subject = "";
        this.body = "";
    }
    setSender(mail, name = "") {
        this.sender = { mail, name };
        return this;
    }
    setReceivers(mail, name = "") {
        this.receivers.push({ mail, name });
        return this;
    }
    setReplyTo(mail, name = "") {
        this.replyTo = { mail, name };
        return this;
    }
    setCC(mail, name = "") {
        this.cc.push({ mail, name });
        return this;
    }
    setBCC(mail, name = "") {
        this.bcc.push({ mail, name });
        return this;
    }
    setSubject(subject) {
        this.subject = subject;
        return this;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
}
class Mail_1 {
    Mail;
}
Mail_1.Mail = Mail;

export {
    AggregatorContext,
    GenericContext,
    RailwayError,
    LogicVariable,
    SessionStorageAgent,
    LocalStorageAgent,
    EventAgent,
    LoggingAgent,
    ResultAgent,
    HttpAgent,
    HttpAgentClient,
    DatabaseAgent,
    DatabaseClient,
    FileStorageAgent,
    FileStorageAgentClient,
    MailAgent,
    MailAgentClient,
    Mail_1 as Mail,
};
