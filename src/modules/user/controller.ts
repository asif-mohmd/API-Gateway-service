import { Request, Response, NextFunction } from "express";
import { UserClient } from "./config/grpc-client/userClient";

export const register = (req: Request, res: Response, next: NextFunction) => {
    UserClient.Register(req.body, (err: Error, result: any) => {
        console.log(req.body,"jkkghuighjksadfssfsfsfsfsfsfsfsfsfsfsfslssssBiu")
        if(err){
            res.status(401).json({message:err});

        }else{
            res.status(201).json(result);
        }
    })
};
