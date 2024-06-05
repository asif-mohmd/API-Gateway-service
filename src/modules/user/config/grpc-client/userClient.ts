
import 'dotenv/config';
import path from "path";



import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";


const packageDefinition = protoLoader.loadSync(path.join(__dirname,"../proto/user.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const UserService = grpc.loadPackageDefinition(packageDefinition).UserService as grpc.ServiceClientConstructor;
// as grpc.ServiceClientConstructor : it is need because of typescript

// use this code if not dockerized
// const UserClient = new UserService(
//     `0.0.0.0:${process.env.USER_GRPC_PORT}`,
//      grpc.credentials.createInsecure()
// );

const UserClient = new UserService(
    `user-service:${process.env.USER_GRPC_PORT}`,
     grpc.credentials.createInsecure()
);

export{UserClient}
