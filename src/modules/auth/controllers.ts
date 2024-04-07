// import { NextFunction, Request, Response } from "express";
// import { AuthClient } from "./config/grpc-client/authClient";


// export const isValidated = (req: Request, res: Response, next: NextFunction) => {
//     console.log("auth side 1")
//     let token = req.cookies.userData
//     AuthClient.IsValidated(token,(err:Error, result: any)=>{
//         if(err){
//             res.status(401).json({message:err})
//         }else{
//             console.log(result ,"sucessss")
//             res.status(201).json(result)
//         }
//     })

// }
