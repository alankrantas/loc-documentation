import { lazy, Suspense } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Admonition from "@theme/Admonition";

const LogicCodeGenerator = lazy(
    () => import("../components/logic-code-generator"),
);

const LogicCodeGeneratorPage = (): JSX.Element => {
    return (
        <Layout
            title="Logic Code Generator"
            description="Logic code generator/unit test tool for FST Network's Logic Operating Centre (LOC)"
        >
            <main>
                <div
                    style={{
                        display: "block",
                        justifyContent: "left",
                        alignItems: "left",
                    }}
                >
                    <div className="padded">
                        <h1>Logic Code Generator</h1>
                        <p>
                            LOC Logic helper tool for JavaScript/TypeScript
                            logic targeting{" "}
                            <Link to="/main/feature/logic/unit-test">
                                <b>SDK for JS/TS</b> <code>0.10.0</code>
                            </Link>
                            .
                        </p>
                        <p>
                            <Admonition
                                type="info"
                                title="About This Tool & Disclaimer"
                            >
                                <p>
                                    This tool runs with a{" "}
                                    <i>mocked logic runtime</i>
                                    which may behave differently as in LOC. This
                                    is also completely browser-based and will
                                    not collect any information you've
                                    generated. Any changes will be lost upon
                                    refreshing the page.
                                </p>
                                <p>
                                    For the native logic testing feature in
                                    Studio, see{" "}
                                    <Link to="/sdk-ts">
                                        <b>here</b>
                                    </Link>
                                    .
                                </p>
                            </Admonition>
                        </p>
                    </div>
                    <hr />
                    <div className="center-padded-sm">
                        <Suspense
                            fallback={
                                <div className="padded-sm">
                                    Loading code generator...
                                </div>
                            }
                        >
                            <LogicCodeGenerator />
                        </Suspense>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default LogicCodeGeneratorPage;
