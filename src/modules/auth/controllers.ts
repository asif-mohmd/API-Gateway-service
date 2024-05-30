import { NextFunction, Request, Response } from "express";
import { AuthClient } from "./config/grpc-client/authClient";
import { statusCode } from "asif-status-codes-package";


export const isValidatedUser = (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.userData
    AuthClient.AuthToken({token},(err:Error, result: any)=>{
        if(err){
            res.status(statusCode.Unauthorized).json({ success: false, message: err });
        }else{
            next();
        }
    })

}

export const isValidatedInstructor = (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.instructorData
    AuthClient.AuthToken({token},(err:Error, result: any)=>{
        if(err){
            res.status(401).json({message:err})
        }else{           
            next();
        }
    })
 
}

export const isValidatedAdmin = (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.adminData
    AuthClient.AuthToken({token},(err:Error, result: any)=>{
        if(err){
            res.status(401).json({message:err})
        }else{           
            next();
        }
    })

}