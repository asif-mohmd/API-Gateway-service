
import 'dotenv/config';
import path from "path";



import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";


const packageDefinition = protoLoader.loadSync(path.join(__dirname,"../proto/instructor.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const InstructorService = grpc.loadPackageDefinition(packageDefinition).InstructorService as grpc.ServiceClientConstructor;
// as grpc.ServiceClientConstructor : it is need because of typescript

const InstructorClient = new InstructorService(
    `instructor-service:${process.env.INSTRUCTOR_GRPC_PORT}`,
     grpc.credentials.createInsecure()
);

export{InstructorClient}
