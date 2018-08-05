FROM nginx:1.12

# ARG SITE_ENV=local
# ENV SITE_ENV ${SITE_ENV}

COPY ./dist/ /home/deploy/site/dist
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/server.conf /etc/nginx/conf.d/server.conf.template