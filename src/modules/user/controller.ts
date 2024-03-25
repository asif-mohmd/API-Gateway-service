import { Request, Response, NextFunction } from "express";
import { UserClient } from "./config/grpc-client/userClient";

export const register = (req: Request, res: Response, next: NextFunction) => {
    
    UserClient.Register(req.body.formData, (err: Error, result: any) => {
      console.log(result, "jkkghuighjksadfssfsfsfsfsfsfsfsfsfsfsfslssssBiu");
      if (err) {
        res.status(401).json({ message: err });
        console.log("err in API gateway");
      } else {
        console.log("else caseeeeeeeeeee");
        console.log("----",result,"----------------");
        // Assuming successful registration, use appropriate status code (e.g., 200)
        res.status(201).json(result); // Include 'data' in the response
      }
    });

  };

  export const login = (req:Request, res:Response, next: NextFunction) =>{
    UserClient.Login(req.body.loginData,(err:Error,result:any)=>{
        console.log("login side")
        if(err){
            res.status(401).json({message:err});
            console.log("err in login API Gateway")
        }else{
            console.log("else caseee loginnnn")
            console.log("------",result,"-----------")
            res.status(201).json(result)
        }

    })
  }


  