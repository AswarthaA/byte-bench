FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY index.html compare.html minify.html base64.html ./
COPY src ./src

EXPOSE 80
