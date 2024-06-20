/// <reference path="../src/lib.deno_core.d.ts" />
/// <reference path="../src/lib.deno_url.d.ts" />
/// <reference path="../src/lib.deno_web.d.ts" />
/// <reference path="../src/agent/http/lib.deno_fetch.d.ts" />
/// <reference path="../src/agent/http/internal.d.ts" />
declare class RailwayError extends Error {
    logicPermanentIdentity: string;
    logicRevision: number;
    constructor(
        name: string,
        message: string,
        logicPermanentIdentity: string,
        logicRevision: number,
    );
}

declare class Railway {
    static isOk(): Promise<boolean>;
    static switch(err: any): Promise<void>;
    static getError(): Promise<RailwayError>;
}

declare type Query =
    | {
          field: string;
          type: "match";
          value: string;
          [k: string]: unknown;
      }
    | {
          field: string;
          type: "match_phrase";
          value: string;
          [k: string]: unknown;
      }
    | {
          field: string;
          type: "term";
          value: string;
          [k: string]: unknown;
      };
declare type Op = "eq" | "ne" | "gt" | "lt" | "gte" | "lte";
declare type Filter =
    | {
          field: string;
          gte?: number | null;
          lte?: number | null;
          type: "range";
          [k: string]: unknown;
      }
    | {
          field: string;
          type: "wildcard";
          value: string;
          [k: string]: unknown;
      };
declare type SortOrder = "asc" | "desc";
interface Aggregation {
    after?: {
        [k: string]: string;
    };
    queries: Query[];
    size?: number | null;
    [k: string]: unknown;
}
interface AggregationResult {
    after: {
        [k: string]: string;
    };
    buckets: Bucket[];
    [k: string]: unknown;
}
interface Bucket {
    docCount: number;
    key: {
        [k: string]: string;
    };
    [k: string]: unknown;
}
interface Condition {
    field: string;
    op: Op;
    value: string;
    [k: string]: unknown;
}
interface Event$1 {
    dataProcessIdentityContext: VersionedIdentityContext;
    executionId: string;
    label: Label;
    logicIdentityContext: VersionedIdentityContext;
    meta: string;
    sequence: number;
    sourceDigitalIdentity: string;
    targetDigitalIdentity: string;
    taskId: string;
    timestamp: string;
    type: string;
    [k: string]: unknown;
}
interface VersionedIdentityContext {
    name: string;
    permanentIdentity: string;
    revision: number;
    [k: string]: unknown;
}
interface Label {
    id: string;
    name: string;
    [k: string]: unknown;
}
interface Pattern {
    filter?: Filter | null;
    maxSpan?: string | null;
    sequences: Sequence[];
    [k: string]: unknown;
}
interface Sequence {
    conditions?: Condition[] | null;
    sharedFields?: string[] | null;
    type?: string | null;
    [k: string]: unknown;
}
interface PatternResult {
    count: number;
    sequences: SequencesResult[];
    took: number;
    total: number;
    [k: string]: unknown;
}
interface SequencesResult {
    events: Event$1[];
    joinKeys: string[];
    [k: string]: unknown;
}
interface Search {
    aggregation?: Aggregation | null;
    excludes?: Query[] | null;
    filters?: Filter[] | null;
    from?: number | null;
    queries?: Query[] | null;
    size?: number | null;
    sorts?: Sort[] | null;
    [k: string]: unknown;
}
interface Sort {
    field: string;
    order: SortOrder;
    [k: string]: unknown;
}
interface SearchResult {
    aggregation?: AggregationResult | null;
    count: number;
    events: Event$1[];
    took: number;
    total: number;
    [k: string]: unknown;
}

interface Task {
    taskKey: TaskKey;
    startTimestamp: Date;
    dataProcess: VersionedIdentityContext;
    currentLogic?: VersionedIdentityContext;
    executedLogics: VersionedIdentityContext[];
}
interface TaskKey {
    executionId: string;
    taskId: string;
}

declare type Payload =
    | {
          http: HttpPayload;
      }
    | {
          messageQueue: MessagePayload;
      }
    | {
          event: EventPayload;
      };
declare type Address =
    | {
          socketAddr: SocketAddress;
      }
    | {
          pipe: Pipe;
      };
declare type Protocol = "tcp" | "udp";
declare type HttpRequest = HttpRequestFor_DataBytes;
declare type Subscriber = {
    kafka: KafkaSubscriber;
};
interface HttpPayload {
    apiGatewayIdentityContext: IdentityContextFor_Uuid;
    apiRouteIdentityContext: IdentityContextFor_Uuid;
    destination?: Peer | null;
    request: HttpRequest;
    requestId: string;
    source?: Peer | null;
    [k: string]: unknown;
}
interface IdentityContextFor_Uuid {
    id: string;
    name: string;
    [k: string]: unknown;
}
interface Peer {
    address: Address;
    [k: string]: unknown;
}
interface SocketAddress {
    address: string;
    protocol: Protocol;
    [k: string]: unknown;
}
interface Pipe {
    mode: number;
    path: string;
    [k: string]: unknown;
}
interface HttpRequestFor_DataBytes {
    data: number[];
    headers: {
        [k: string]: unknown;
    };
    host: string;
    method: string;
    path: string;
    query: string;
    scheme: string;
    version: "HTTP/0.9" | "HTTP/1.0" | "HTTP/1.1" | "HTTP/2.0" | "HTTP/3.0";
    [k: string]: unknown;
}
interface MessagePayload {
    clientIdentityContext: IdentityContextFor_Uuid;
    data: number[];
    subscriber: Subscriber;
    [k: string]: unknown;
}
interface KafkaSubscriber {
    brokers: string[];
    groupId: string;
    offset: number;
    partition: number;
    topic: string;
    [k: string]: unknown;
}
interface EventPayload {
    [k: string]: unknown;
}

declare abstract class AbstractContext {
    #private;
    payload(): Promise<Payload>;
    get task(): Task;
}

declare class AggregatorContext extends AbstractContext {}

declare class GenericContext extends AbstractContext {}

declare type Main = () => Promise<void>;
declare type ErrorHandler = (error: RailwayError) => Promise<void>;
declare class Runtime<C> {
    #private;
    constructor(context: C);
    registerMain(main: Main): void;
    registerErrorHandler(errorHandler: ErrorHandler): void;
    get context(): C;
    run(): Promise<void>;
}
declare global {
    export var run: undefined | (<C>(ctx: C) => Promise<void>);
    export var handleError:
        | undefined
        | (<C>(ctx: C, error: RailwayError) => Promise<void>);
}

declare const DatabaseAgent: {
    acquire(configurationName: string): Promise<DatabaseClient>;
};
declare class DatabaseClientId {
    readonly dataSourceId: string;
    readonly connectionId: string;
    constructor(dataSourceId: string, connectionId: string);
}
declare class DatabaseClient {
    readonly uid: DatabaseClientId;
    constructor(uid: DatabaseClientId);
    query(rawSql: string, params?: any[]): Promise<Database.QueryResults>;
    release(): Promise<void>;
    execute(rawSql: string, params: any[]): Promise<any>;
    beginTransaction(): Promise<DatabaseClient>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
}
declare namespace Database {
    interface QueryResultColumn {
        name: string;
        type: string;
    }
    interface QueryResults {
        columns: QueryResultColumn[];
        rows: Array<{
            [key: string]: any;
        }>;
    }
}

declare const EventAgent: {
    emit(events: Event.Event[]): Promise<void>;
    search(request: Search): Promise<SearchResult>;
    searchWithPattern(request: Pattern): Promise<PatternResult>;
};
declare namespace Event {
    interface Event {
        labelName: string;
        sourceDigitalIdentity?: string;
        targetDigitalIdentity?: string;
        sourceDID?: string;
        targetDID?: string;
        meta: string;
        type: string;
    }
    interface EventArgs {
        labelName: string;
        sourceDigitalIdentity: string;
        targetDigitalIdentity: string;
        meta: string;
        type: string;
    }
}

declare const FileStorageAgent: {
    acquire(configurationName: string): Promise<FileStorageAgentClient>;
};
declare class FileStorageAgentClient {
    readonly configurationId?: string | undefined;
    constructor(configurationId?: string | undefined);
    simpleGet(path: string): Promise<Uint8Array>;
    simplePut(
        path: string,
        data: Uint8Array | string,
        options?: FileStorage.PutOptions,
    ): Promise<number>;
    delete(path: string): Promise<void>;
    list(path: string): Promise<FileStorage.FileType[]>;
    createDirAll(path: string): Promise<void>;
}
declare namespace FileStorage {
    interface FileType {
        type: "file" | "directory" | "symbolicLink";
        name: string;
    }
    interface PutOptions {
        ensureDir?: boolean;
    }
}

declare const HttpAgent: {
    acquire(configurationName: string): Promise<HttpAgentClient>;
};
declare class HttpAgentClient {
    readonly configurationId: string;
    constructor(configurationId: string);
    fetch(input: Request | string, init?: RequestInit): Promise<Response>;
}

declare const LocalStorageAgent: {
    get(key: string): Promise<any | null>;
    putString(key: string, value: string, timeout?: number): Promise<void>;
    putByteArray(
        key: string,
        value: Uint8Array | string,
        timeout?: number,
    ): Promise<void>;
    putJson(
        key: string,
        value: object | number,
        timeout?: number,
    ): Promise<void>;
    delete(key: string): Promise<void>;
    remove(key: string): Promise<void>;
};

declare const LoggingAgent: {
    trace(value: string | object): void;
    debug(value: string | object): void;
    info(value: string | object): void;
    warn(value: string | object): void;
    error(value: string | object): void;
    log(level: string, value: string | object): void;
};

declare const LogicVariable: {
    get(name: string): string | null;
};

interface IResultAgent {
    finalize(value: object): IResultAgent;
    httpStatusCode(statusCode: number): IResultAgent;
}
declare const ResultAgent: IResultAgent;

declare const SessionStorageAgent: {
    get(key: string): Promise<string | number | object | Uint8Array | null>;
    putJson(key: string, value: any): Promise<boolean>;
    putString(key: string, value: string): Promise<boolean>;
    putByteArray(key: string, value: Uint8Array | string): Promise<boolean>;
    delete(key: string): Promise<void>;
    remove(key: string): Promise<void>;
};

declare const MailAgent: {
    acquire(configurationName: string): Promise<MailAgentClient>;
};
declare class MailAgentClient {
    readonly uid: string;
    constructor(uid: string);
    send(mail: Mail.Mail): Promise<any>;
}
declare namespace Mail {
    interface MailBox {
        name: string;
        mail: string;
    }
    class Mail {
        sender: MailBox;
        receivers: MailBox[];
        replyTo?: MailBox;
        cc: MailBox[];
        bcc: MailBox[];
        subject: string;
        body: string;
        constructor();
        setSender(mail: string, name?: string): this;
        setReceivers(mail: string, name?: string): this;
        setReplyTo(mail: string, name?: string): this;
        setCC(mail: string, name?: string): this;
        setBCC(mail: string, name?: string): this;
        setSubject(subject: string): this;
        setBody(body: string): this;
    }
}

declare let runtime: Runtime<AggregatorContext | GenericContext>;
declare function genericLogic(): void;
declare function aggregatorLogic(): void;

export {
    AggregatorContext,
    Database,
    DatabaseAgent,
    DatabaseClient,
    Event,
    EventAgent,
    EventPayload,
    FileStorageAgent,
    FileStorageAgentClient,
    GenericContext,
    HttpAgent,
    HttpAgentClient,
    HttpPayload,
    IResultAgent,
    LocalStorageAgent,
    LoggingAgent,
    LogicVariable,
    Mail,
    MailAgent,
    MailAgentClient,
    MessagePayload,
    IdentityContextFor_Uuid as NonVersionedIdentityContext,
    Pattern,
    PatternResult,
    Payload,
    Railway,
    RailwayError,
    ResultAgent,
    Search,
    SearchResult,
    SessionStorageAgent,
    Task,
    VersionedIdentityContext,
    aggregatorLogic,
    genericLogic,
    runtime,
};
