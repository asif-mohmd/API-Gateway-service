import { Request, Response, NextFunction } from "express";
import { UserClient } from "./config/grpc-client/userClient";
import { status } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";

export const register = (req: Request, res: Response, next: NextFunction) => {
  UserClient.Register(req.body.formData, (err: Error, result: any) => {
    console.log(result, "jkkghuighjksadfssfsfsfsfsfsfsfsfsfsfsfslssssBiu");
    let userData = req.body.formData;
    console.log(userData);
    if (err) {
      res.status(401).json({ message: err });
      console.log("err in API gateway");
    } else {

      if (result.registerStatus) {
        console.log("----", result, "----");
        res.cookie("userData", result.userData,{
          httpOnly:true
        });
      
        res.json({ "status": true });

      } else {
        console.log("errror",result);
        // Assuming successful registration, use appropriate status code (e.g., 200)
        res.json({"status":false});

      }
    }
  });
};

export const otp =  (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.otp,"-------------------")

  const userData = req.cookies.userData;

  console.log(userData,"userdata;;;;;;;;;;;;;;;;")

  const decoded : any = jwt.verify(userData.token, process.env.JWT_SECRET || "")
  console.log("first", decoded.activationCode)
  if(req.body.otp ===  decoded.activationCode){
    console.log(decoded.userData,"decddddddddddddddddddddddddddddddd")
    UserClient.ActivateUser(decoded.userData, (err: Error, result: any) => {
      console.log(req.body.otp,"-------------------")
  
      if (err) {
        res.status(401).json({ message: err });
        console.log("err in login API Gateway");
      } else {
        console.log("else caseee otp");
        if(result.registerStatus){
          console.log("------", result, "-----------");
          res.status(201).json({status:true});
        }else{
          res.status(401).json({status:false});
        }
    
      }
    });
  }


  
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  UserClient.Login(req.body.loginData, (err: Error, result: any) => {
    const userData = req.cookies.userData;
    console.log(req.cookies.userData)
    console.log("login side",userData);
    if (err) {
      res.status(401).json({ message: err });
      console.log("err in login API Gateway");
    } else {
      console.log("else caseee loginnnn");
      console.log("------", result, "-----------");
      res.status(201).json(result);
    }
  });
};
