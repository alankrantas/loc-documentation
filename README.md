# [LOC Documentation](https://loc-documentation.vercel.app/) (Archived)

The end-user documentation project for [FST Network](https://www.fst.network/)'s _Logic Operating Centre_ (LOC), a.k.a. **LOC-Doc**, built with React-based [Docusaurus 3.x](https://docusaurus.io/).

> Archived as [Alan Wang](https://github.com/alankrantas)'s contribution between Aug 2022 to July 2024. Sensitive information and files are removed.

---

## Docs and Versioning

Due to the requirement of multiple versioning in LOC, LOC-Doc current serve the following docs:

| Docs Folder        | Root Routing Path | Docs ID      | Docs                              | [Versioning](https://docusaurus.io/docs/versioning) |
| ------------------ | ----------------- | ------------ | --------------------------------- | --------------------------------------------------- |
| `/src/pages`       | `/`               |              | General pages without sidebars    | No                                                  |
| `/docs`            | `/docs`           | `default`    | General docs have sidebars        | No                                                  |
| `/docs-main`       | `/main`           | `main`       | LOC (Core, Studio, CLI) main docs | Yes                                                 |
| `/docs-sdk-ts`     | `/sdk-ts`         | `sdk-ts`     | SDK for JS/TS docs                | Yes                                                 |
| `/docs-sdk-csharp` | `/sdk-csharp`     | `sdk-csharp` | SDK for C# docs                   | Yes                                                 |
| `/docs-legacy`     | `/legacy/intro`   | `legacy`     | Legacy docs                       | Yes (will not add new versions)                     |

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

I would like to express my gratitude to some of the FST Network colleagues who had helped me so much in this project:

- [Leo Chou](https://www.linkedin.com/in/leo-chou-fstk), COO then CPO
- [Josh Chu](https://www.linkedin.com/in/joshchu999), the first lead, ScrumMaster (who also wrote the AWS deploy workflow)
- [David Lee](https://www.linkedin.com/in/david-ying-ray-lee-480395ba), the second dev lead, test engineer
- [Renhao Xiao](https://www.linkedin.com/in/renhao-xiao-2b7599129), back-end engineer, SRE and DevOps
- [Ken Lee](https://www.linkedin.com/in/ken-lee-305455143), front-end engineer
- [Tara Huang](https://www.linkedin.com/in/tara-huang-73964b117), SRE
- [Jessica Wu](https://www.linkedin.com/in/jessica-wu-b6964214b), UI/UX designer
