FROM node:22.1.0-alpine3.18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .


EXPOSE 3000

ENV AUTH_GRPC_PORT=8081
ENV ADMIN_GRPC_PORT=8082
ENV INSTRUCTOR_GRPC_PORT=8083
ENV USER_GRPC_PORT=8084
ENV COURSE_GRPC_PORT=8085

ENV PORT=3000


ENV JWT_SECRET=GeniusGrid123


CMD ["npm", "start"]