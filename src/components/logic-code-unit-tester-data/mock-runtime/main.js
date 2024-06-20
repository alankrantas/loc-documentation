import { run, handleError } from "logic";
import { GenericContext, AggregatorContext, RailwayError } from "sdk";
import { Deno } from "deno";

(async () => {
    return async (type, executionInputs) => {
        Deno.core.init(type, executionInputs);
        const ctx =
            type == "aggregator"
                ? new AggregatorContext()
                : new GenericContext();
        let err = null;
        try {
            console.log("[LOGIC TESTER]\n\nexecuting run()...");
            await run(ctx);
        } catch (e) {
            err = e;
            console.log(
                `execution error caught in run():\n\n${e.message}`,
                "LOGIC TESTER",
            );
        }
        if (err) {
            const railErr = new RailwayError(
                err.name,
                err.message,
                "mock-logic-pid",
                1,
            );
            try {
                console.log("LOGIC TESTER\n\nexecuting handleError()...");
                await handleError(ctx, railErr);
            } catch (e) {
                console.log(
                    `[LOGIC TESTER]\n\nexecution error caught in handleError():\n(note: this will cause system error in LOC)\n\n${e.message}`,
                );
            }
        }
        console.log(
            `[LOGIC TESTER]\n\n${!err ? "complete" : "complete with error"}`,
        );
        return err == null;
    };
})();
