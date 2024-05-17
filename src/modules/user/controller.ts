import { Request, Response, NextFunction } from "express";
import { UserClient } from "./config/grpc-client/userClient";
import jwt from "jsonwebtoken";
import {statusCode} from "asif-status-codes-package"
import { format } from "path";
export default class UserController {



  onGetUserDetails = (req: Request, res: Response, next: NextFunction) => {
    console.log("ooooooooooooooo")
    const userData = req.cookies.userData;
    console.log(userData)
    const decoded: any = jwt.verify(
      userData,
      process.env.JWT_SECRET || ""
    );
    const userId = decoded.userId
    console.log(userId,"iiiiiioooooooooooooooooooooooo")

    UserClient.GetUserDetails({userId}, (err: Error, result: any) => {
      const userData = req.cookies.userData;
      console.log(result,"ggggggggggggggggggggggggggg")
      
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
       console.log(result,"---------------------------")
        res.status(statusCode.OK).json(result);
      }
    });
  };


  register = (req: Request, res: Response, next: NextFunction) => {
    console.log("tttttttttttttttttttttttttt",req.body)
    UserClient.Register(req.body, (err: Error, result: any) => {
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        if (result.registerStatus) {
          console.log("userrrrrrr", result.userData);
          res.cookie("userData", result.userData, {
            httpOnly: true,
          });
          res.json({ status: true });
        } else {
          res.json({ status: false });
        }
      }
    });
  };

  otp = (req: Request, res: Response, next: NextFunction) => {
    const userData = req.cookies.userData;

    const decoded: any = jwt.verify(
      userData.token,
      process.env.JWT_SECRET || ""
    );
    if (req.body.otp === decoded.activationCode) {
      UserClient.ActivateUser(decoded.userData, (err: Error, result: any) => {
        if (err) {
          res.status(statusCode.Unauthorized).json({ message: err });
        } else {
          if (result.status) {
            res.status(statusCode.OK).json({ status: true });
          } else {
            res.status(statusCode.Unauthorized).json({ status: false });
          }
        }
      });
    } else {
      res.status(statusCode.Unauthorized).json({ status: false });
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiii",statusCode.Accepted);
    UserClient.Login(req.body.loginData, (err: Error, result: any) => {
      const userData = req.cookies.userData;
      console.log(result,"ggggggggggggggggggggggggggg",result.activationToken)
      
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        console.log(result.userId,"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",result,"mmmmmmmmmmmmmmmmmmmmmmmmmm")
        res.cookie("userData", result.activationToken, {
          httpOnly: true,
        });
        res.status(statusCode.OK).json(result);
      }
    });
  };

  forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    UserClient.ForgotPassword(
      req.body.forgotData,
      (err: Error, result: any) => {
        if (err) {
          res.status(statusCode.Unauthorized).json({ message: err });
        } else {
          res.cookie("forgotData", result.forgotData, {
            httpOnly: true,
          });
          res.status(statusCode.OK).json(result.forgotPasswordStatus);
        }
      }
    );
  };

  forgotOtp = (req: Request, res: Response, next: NextFunction) => {
    const userData = req.cookies.forgotData;

    const decoded: any = jwt.verify(
      userData.token,
      process.env.JWT_SECRET || ""
    );
    if (req.body.otp === decoded.activationCode) {
      const userData = {
        email: decoded.userData.email,
        password: decoded.userData.password,
      };
      UserClient.PasswordUpdate(userData, (err: Error, result: any) => {
        if (err) {
          res.status(statusCode.Unauthorized).json({ message: err });
        } else {
          if (result.passwordUpdate) {
            res.status(statusCode.OK).json({ status: true });
          } else {
            res.status(statusCode.Unauthorized).json({ status: false });
          }
        }
      });
    } else {
      res.json({ status: false });
    }
  }; 

  createUserCourse = (req: Request, res: Response, next: NextFunction) => {
    console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiii",req.body.createUserCourse);
    UserClient.CreateUserCourse(req.body.createUserCourse, (err: Error, result: any) => {

      console.log(result,"ggggggggggggggggggggggggggg")
      
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        console.log(result,"mmmmmmmmmmmmmmmmmmmmmmmmmm")
      
        res.status(statusCode.OK).json(result);
      }
    });
  }; 


}
