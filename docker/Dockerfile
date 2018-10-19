FROM nginx:1.12

#设置时区与语言
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/TZ /etc/localtime && echo TZ /etc/localtime && echo TZ > /etc/timezone

COPY ./dist/ /home/deploy/site/dist
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/server.conf /etc/nginx/conf.d/server.conf.template