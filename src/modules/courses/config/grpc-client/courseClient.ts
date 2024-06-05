
import 'dotenv/config';
import path from "path";



import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";


const packageDefinition = protoLoader.loadSync(path.join(__dirname,"../proto/course.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const CourseService = grpc.loadPackageDefinition(packageDefinition).CourseService as grpc.ServiceClientConstructor;
// as grpc.ServiceClientConstructor : it is need because of typescript

const CourseClient = new CourseService(
    `course-service:${process.env.COURSE_GRPC_PORT}`,
     grpc.credentials.createInsecure()
);

export{CourseClient}
