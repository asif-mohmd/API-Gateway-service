import { NextFunction, Request, Response } from "express";
import { AuthClient } from "./config/grpc-client/authClient";


export const isValidated = (req: Request, res: Response, next: NextFunction) => {
    console.log("auth side 1")
    AuthClient.IsValidated(req.cookies.userData,(err:Error, result: any)=>{
        if(err){
            res.status(401).json({message:err})
        }else{
            res.status(201).json(result)
        }
    })

}
