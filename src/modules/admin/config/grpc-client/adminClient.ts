
import 'dotenv/config';
import path from "path";



import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";


const packageDefinition = protoLoader.loadSync(path.join(__dirname,"../proto/admin.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const AdminService = grpc.loadPackageDefinition(packageDefinition).AdminService as grpc.ServiceClientConstructor;
// as grpc.ServiceClientConstructor : it is need because of typescript

const AdminClient = new AdminService(
    `admin-service:${process.env.ADMIN_GRPC_PORT}`,
     grpc.credentials.createInsecure()
);

export{AdminClient}
