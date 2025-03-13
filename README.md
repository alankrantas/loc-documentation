# [LOC Documentation](https://loc-documentation.vercel.app/) (Archived)

The end-user documentation project for [FST Network](https://www.fst.network/)'s _Logic Operating Centre_ (LOC), a.k.a. **LOC-Doc**, built with React-based [Docusaurus 3.x](https://docusaurus.io/).

> Archived as [Alan Wang](https://github.com/alankrantas)'s contribution between Aug 2022 to July 2024. Sensitive information and files are removed.

---

## Docs and Versioning

Due to the requirement of multiple versioning in LOC, LOC-Doc current serve the following docs:

| Docs Folder        | Root Routing Path | Docs ID      | Docs                              | Versioning                          |
| ------------------ | ----------------- | ------------ | --------------------------------- | ----------------------------------- |
| `/src/pages`       | `/`               |              | General pages without sidebars    | No                                  |
| `/docs`            | `/docs`           | `default`    | General docs with sidebars        | No                                  |
| `/docs-main`       | `/main`           | `main`       | LOC (Core, Studio, CLI) main docs | Yes (`v1.0`)                        |
| `/docs-sdk-ts`     | `/sdk-ts`         | `sdk-ts`     | SDK for JS/TS docs                | Yes (`v0.10`)                       |
| `/docs-sdk-csharp` | `/sdk-csharp`     | `sdk-csharp` | SDK for C# docs                   | Yes (`v0.1`)                        |
| `/docs-legacy`     | `/legacy/intro`   | `legacy`     | Legacy docs                       | Yes (`0.6`~`0.10`; no new versions) |

---

## Local Development

> Prerequisites: [Node.js](https://nodejs.org/en/download/) (latest LTS version), [Git](https://git-scm.com/downloads) and [VS Code](https://code.visualstudio.com/Download)

```bash
npm i -g yarn
git clone https://github.com/alankrantas/loc-documentation.git
cd loc-documentation
yarn
```

### Start Dev Server

```bash
yarn start
```

### Build and Run Local Production

```bash
yarn build
yarn serve
```

### Build and Run in Docker

> Prerequisite: [Docker](https://www.docker.com/products/docker-desktop/)
>
> `/dev-support/containers/nginx` contains the original Dockerfile and configuration of a Nginx container for deploying the site to AWS ECR.

```bash
docker build . -f ./dev-support/containers/local/Dockerfile -t loc-doc
docker run -d -p 8080:8080 --rm loc-doc
```

---

## Special Thanks

Many had contributed valuable feedback for this project, and developed the very product it documented. Many of them stayed until the end when the company encountered financial difficulties:

- [Leo Chou](https://www.linkedin.com/in/leo-chou-fstk), COO then CPO
- [Josh Chu](https://www.linkedin.com/in/joshchu999), the first dev lead, ScrumMaster (who also contributed the AWS ECR deployment workflow)
- [David Lee](https://www.linkedin.com/in/david-ying-ray-lee-480395ba), the second dev lead, test engineer and DevOps
- [Renhao Xiao](https://www.linkedin.com/in/renhao-xiao-2b7599129), back-end engineer, SRE and DevOps
- [Ken Lee](https://www.linkedin.com/in/ken-lee-305455143), front-end engineer
- [Tara Huang](https://www.linkedin.com/in/tara-huang-73964b117), SRE
- [Jessica Wu](https://www.linkedin.com/in/jessica-wu-b6964214b), UI/UX designer
