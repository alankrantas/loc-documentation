# For deploying to AWS; do not change the stage name

FROM nginx:alpine as loc-doc-aws-deployment

COPY dev-support/containers/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]