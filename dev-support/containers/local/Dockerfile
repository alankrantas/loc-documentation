FROM node:alpine as builder

WORKDIR /app
COPY . /app

RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:alpine

WORKDIR /app
COPY --from=builder /app/build /app/build

RUN npm i -g serve

EXPOSE 8080
CMD serve ./build -p 8080