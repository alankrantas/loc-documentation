import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
    title: "Documentation for Logic Operating Centre (LOC)",
    tagline: "The Next Step of Evolving Data",
    favicon: "/img/logo/favicon.ico",
    url:
        process.env.NODE_ENV === "production"
            ? "https://loc-documentation-dev.vercel.app"
            : "http://localhost",
    baseUrl: "/",
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    onBrokenLinks: "throw",
    onBrokenAnchors: "throw",
    onBrokenMarkdownLinks: "throw",
    onDuplicateRoutes: "throw",

    presets: [
        [
            "classic",
            {
                pages: {
                    exclude: [],
                    showLastUpdateAuthor: false,
                    showLastUpdateTime: false,
                },

                docs: {
                    id: "default",
                    sidebarPath: "./sidebars/sidebars.ts",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                },

                // fonts and custom styles
                theme: {
                    customCss: [
                        "./src/css/docs.css",
                        "./src/css/fonts.css",
                        "./src/css/custom.css",
                    ],
                },

                // Google Analytics gtag
                // gtag: {
                //     trackingID: "G-TQQC5TNYVB",
                //     anonymizeIP: true,
                // },

                sitemap: {
                    ignorePatterns: [
                        "/blog/**",
                        "/docs/*.*.*/**",
                        "/main/*.*.*/**",
                        "/sdk-*/*.*.*/**",
                        "/legacy/**",
                    ],
                    filename: "sitemap.xml",
                },
            } satisfies Preset.Options,
        ],
    ],

    plugins: [
        [
            "@docusaurus/plugin-content-docs",
            {
                id: "main",
                path: "docs-main",
                routeBasePath: "main",
                sidebarPath: "./sidebars/sidebars-main.ts",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                includeCurrentVersion: true,
                lastVersion: "current",
                onlyIncludeVersions: ["current"],
                versions: {
                    current: {
                        label: "LOC 1.0",
                        path: "",
                    },
                },
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                id: "sdk-ts",
                path: "docs-sdk-ts",
                routeBasePath: "sdk-ts",
                sidebarPath: "./sidebars/sidebars-sdk-ts.ts",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                includeCurrentVersion: true,
                lastVersion: "current",
                onlyIncludeVersions: ["current"],
                versions: {
                    current: {
                        label: "SDK for JS/TS 0.10",
                        path: "",
                    },
                },
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                id: "sdk-csharp",
                path: "docs-sdk-csharp",
                routeBasePath: "sdk-csharp",
                sidebarPath: "./sidebars/sidebars-sdk-csharp.ts",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                includeCurrentVersion: true,
                lastVersion: "current",
                onlyIncludeVersions: ["current"],
                versions: {
                    current: {
                        label: "SDK for C# 0.1",
                        path: "",
                    },
                },
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                id: "legacy",
                path: "docs-legacy",
                routeBasePath: "legacy",
                sidebarPath: "./sidebars/sidebars-legacy.ts",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                includeCurrentVersion: true,
                lastVersion: "current",
                onlyIncludeVersions: [
                    "current",
                    "0.10",
                    "0.9",
                    "0.8",
                    "0.7",
                    "0.6",
                ],
                versions: {
                    current: {
                        label: "LOC Legacy Docs",
                        path: "",
                    },
                    "0.10": {
                        label: "LOC v0.10 (legacy)",
                        path: "0.10",
                    },
                    "0.9": {
                        label: "LOC v0.9 (legacy)",
                        path: "0.9",
                    },
                    "0.8": {
                        label: "LOC v0.8 (legacy)",
                        path: "0.8",
                    },
                    "0.7": {
                        label: "LOC v0.7 (legacy)",
                        path: "0.7",
                    },
                    "0.6": {
                        label: "LOC v0.6 (legacy)",
                        path: "0.6",
                    },
                },
            },
        ],
        [
            "@docusaurus/plugin-content-blog",
            {
                id: "blog",
            },
        ],
        [
            // local search bar: https://github.com/easyops-cn/docusaurus-search-local
            "@easyops-cn/docusaurus-search-local",
            {
                indexPages: true,
                indexDocs: true,
                indexBlog: false,
                hashed: true,
                docsRouteBasePath: [
                    "/",
                    "/docs",
                    "/main",
                    "/sdk-ts",
                    "/sdk-csharp",
                ],
                docsDir: [
                    "docs",
                    "docs-main",
                    "docs-sdk-ts",
                    "docs-sdk-csharp",
                ],
                ignoreFiles: [
                    "/blog/**",
                    "/docs/*.*.*/**",
                    "/main/*.*.*/**",
                    "/sdk-*/*.*.*/**",
                    "/legacy/**",
                ],
                language: ["en"],
                searchResultLimits: 10,
                searchResultContextMaxLength: 200,
                searchBarPosition: "right",
            },
        ],
    ],

    markdown: {
        mermaid: true,
    },

    themes: ["@docusaurus/theme-mermaid"],

    themeConfig: {
        announcementBar: {
            id: "announcement",
            content:
                "This is a preserved version of July 2024 by <a href='https://alankrantas.github.io/' target='_blank'>Alan Wang</a>. For the latest version from FST Network, visit <a href='https://documentation.loc.fst.network/' target='_blank'>here</a>.",
            backgroundColor: "#1d97c1",
            textColor: "#ffffff",
            isCloseable: false,
        },

        image: "img/thumbnail.jpg",

        metadata: [
            {
                name: "description",
                content:
                    "Documentation for FST Network's Logic Operating Centre (LOC)",
            },
            {
                name: "keywords",
                content:
                    "LOC, Logic Operating Centre, docs, documentation, logic, data process, data pipeline, data product, event, data lineage, data integration, ETL, ELT, data streaming, API management, active metadata management, data governance, data mesh, data fabric, cloud, container, Kubernetes, K8S, serverless, function as a service, microservice, RESTful, message queue, scheduled job",
            },
        ],

        // mermaid styles: https://github.com/mermaid-js/mermaid/blob/master/packages/mermaid/src/config.type.ts
        mermaid: {
            options: {
                fontFamily: "Poppins",
            },
        },

        // prism styles: https://github.com/FormidableLabs/prism-react-renderer/tree/master/packages/prism-react-renderer/src/themes
        // prism language highlighting: https://prismjs.com/#supported-languages
        prism: {
            theme: prismThemes.oneLight,
            darkTheme: prismThemes.oneDark,
            additionalLanguages: [
                "bash",
                "json",
                "yaml",
                "sql",
                "typescript",
                "csharp",
            ],
        },

        docs: {
            sidebar: {
                hideable: true,
                autoCollapseCategories: true,
            },
        },

        navbar: {
            title: "LOC-Doc",
            hideOnScroll: true,

            logo: {
                alt: "FST Network",
                src: "img/logo/LOC-logo_icon.png",
                srcDark: "img/logo/LOC-logo-w_icon.png",
            },

            items: [
                {
                    type: "dropdown",
                    label: "General",
                    position: "left",
                    items: [
                        {
                            label: "LOC-Doc Index",
                            to: "/docs",
                        },
                        {
                            label: "System FAQs",
                            to: "/docs/category/system-faqs",
                        },
                        {
                            label: "About & Contact",
                            to: "/docs/about-and-contact",
                        },
                    ],
                },
                {
                    type: "dropdown",
                    label: "LOC",
                    position: "left",
                    items: [
                        {
                            label: "Main Docs Index",
                            to: "/main",
                        },
                        {
                            label: "Release Note",
                            to: "/main/release-note",
                        },
                        {
                            label: "Features",
                            to: "/main/category/loc-features",
                        },
                        {
                            label: "Tutorials",
                            to: "/main/category/loc-tutorials",
                        },
                    ],
                },
                {
                    type: "dropdown",
                    label: "SDK",
                    position: "left",
                    items: [
                        {
                            label: "SDK for JS/TS",
                            to: "/sdk-ts",
                        },
                        {
                            label: "SDK for C#",
                            to: "/sdk-csharp",
                        },
                    ],
                },
                {
                    type: "dropdown",
                    label: "Tool",
                    position: "left",
                    items: [
                        {
                            label: "Logic Code Generator",
                            to: "/logic-code-generator",
                        },
                    ],
                },
                {
                    type: "docsVersionDropdown",
                    docsPluginId: "main",
                    position: "right",
                    dropdownActiveClassDisabled: true,
                },
                {
                    type: "dropdown",
                    label: "Legacy Docs",
                    position: "right",
                    items: [
                        {
                            label: "0.10",
                            to: "/legacy/0.10/intro",
                        },
                        {
                            label: "0.9",
                            to: "/legacy/0.9/intro",
                        },
                        {
                            label: "0.8",
                            to: "/legacy/0.8/intro",
                        },
                        {
                            label: "0.7",
                            to: "/legacy/0.7/intro",
                        },
                        {
                            label: "0.6",
                            to: "/legacy/0.6/intro",
                        },
                    ],
                },
            ],
        },

        footer: {
            logo: {
                alt: "FST Network",
                src: "img/logo/Fst-logo-white.svg",
                href: "https://www.fst.network/",
                width: 200,
            },

            style: "dark",

            links: [
                {
                    title: "LOC Documentation",
                    items: [
                        {
                            label: "Home",
                            to: "/",
                        },
                        {
                            label: "Docs Index",
                            to: "/docs",
                        },
                        {
                            label: "System FAQs",
                            to: "/docs/category/system-faqs",
                        },
                        {
                            label: "About & Contact",
                            to: "/docs/about-and-contact",
                        },
                    ],
                },
                {
                    title: "Docs",
                    items: [
                        {
                            label: "LOC Main Docs",
                            to: "/main",
                        },
                        {
                            label: "SDK for JS/TS",
                            to: "/sdk-ts",
                        },
                        {
                            label: "SDK for C#",
                            to: "/sdk-csharp",
                        },
                        {
                            label: "Legacy Docs",
                            to: "/legacy/intro",
                        },
                    ],
                },
                {
                    title: "Tools",
                    items: [
                        {
                            label: "Logic Code Generator",
                            to: "/logic-code-generator",
                        },
                    ],
                },
                {
                    title: "FST NETWORK",
                    items: [
                        {
                            label: "Website",
                            href: "https://www.fst.network/",
                        },
                        {
                            label: "Blog",
                            href: "https://www.fst.network/blog",
                        },
                        {
                            label: "Linkedin",
                            href: "https://www.linkedin.com/company/fstnetwork",
                        },
                    ],
                },
            ],

            copyright: `Copyright ©${2024} FST Network Pte. Ltd.`,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
