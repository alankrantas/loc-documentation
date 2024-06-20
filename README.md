# LOC Documentation

The user documentation for [FST Network](https://www.fst.network/)'s **Logic Operating Centre (LOC)**, built with React-based [Docusaurus 3.x](https://docusaurus.io/).

> This is a preserved version of my contribution from Aug 2022 to July 2024 before leaving FST Network.

---

## Local Development

```bash
npm i -g yarn
git clone https://github.com/alankrantas/loc-doc.git
cd loc-doc
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

```bash
docker build . -f ./dev-support/containers/local/Dockerfile -t loc-doc
docker run -d -p 8080:8080 --rm loc-doc
```
