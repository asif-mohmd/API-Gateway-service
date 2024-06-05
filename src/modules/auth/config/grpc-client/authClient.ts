
import 'dotenv/config';
import path from "path";


import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";


const packageDefinition = protoLoader.loadSync(path.join(__dirname,"../proto/auth.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const AuthService = grpc.loadPackageDefinition(packageDefinition).AuthService as grpc.ServiceClientConstructor;
// as grpc.ServiceClientConstructor : it is need because of typescript

const AuthClient = new AuthService(
    `auth-service:${process.env.AUTH_GRPC_PORT}`,
     grpc.credentials.createInsecure()
);

export{AuthClient}