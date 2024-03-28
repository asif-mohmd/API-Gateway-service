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
      let status = true
        res.json({ status });

      } else {
        console.log("errror",result);
        let status = false

        // Assuming successful registration, use appropriate status code (e.g., 200)
        res.json({status});

      }
    }
  });
};

export const otp =  (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.otp,"-------------------")

  const userData = req.cookies.userData;

  console.log(userData,"userdata;;;;;;;;;;;;;;;;")

  const decoded : any = jwt.verify(userData.token, process.env.JWT_SECRET || "")
  console.log("decoded", decoded)

  console.log("first", decoded.activationCode)
  if(req.body.otp ===  decoded.activationCode){
    console.log(decoded.userData,"decddddddddddddddddddddddddddddddd")
    UserClient.ActivateUser(decoded.userData, (err: Error, result: any) => {
      console.log(req.body.otp,"-------------------")
  
      if (err) {
        res.status(401).json({ message: err });
        console.log("err in login API Gateway");
      } else {
        console.log("else caseee otp",result);
        if(result.status){
          console.log("------", result, "-----------");
          res.status(200).json({status:true});
        }else{
          console.log("----------------------")
          res.status(401).json({status:false});
        }
    
      }
    });
  }


  
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.loginData,"login in api gatewqay")
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

export const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
  console.log("forgot:",req.body.forgotData)
  UserClient.ForgotPassword(req.body.forgotData, (err: Error, result: any) => {
   
 
    console.log("forgot side",req.body.forgotData);
    if (err) {
      res.status(401).json({ message: err });
      console.log("err in login API Gateway");
    } else {
      console.log("else caseee loginnnn");
      console.log("------", result, "-----------");
   
      // res.cookie("forgotData", forgotData,{
      //   httpOnly:true
      // });
      // res.status(201).json(result.forgotPasswordStatus);
    }
  });
};
