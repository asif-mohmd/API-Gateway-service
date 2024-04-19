import { Request, Response, NextFunction } from "express";
import { UserClient } from "./config/grpc-client/userClient";
import jwt from "jsonwebtoken";
import { StatusCode } from "../../interfaces/enums";

export default class UserController {
  register = (req: Request, res: Response, next: NextFunction) => {
    UserClient.Register(req.body.formData, (err: Error, result: any) => {
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
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
          res.status(StatusCode.Unauthorized).json({ message: err });
        } else {
          if (result.status) {
            res.status(StatusCode.OK).json({ status: true });
          } else {
            res.status(StatusCode.Unauthorized).json({ status: false });
          }
        }
      });
    } else {
      res.status(StatusCode.Unauthorized).json({ status: false });
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiii");
    UserClient.Login(req.body.loginData, (err: Error, result: any) => {
      const userData = req.cookies.userData;
      console.log(result,"ggggggggggggggggggggggggggg",result.activationToken)
      
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
      } else {
        res.cookie("userData", result.activationToken, {
          httpOnly: true,
        });
        res.status(StatusCode.OK).json(result);
      }
    });
  };

  forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    UserClient.ForgotPassword(
      req.body.forgotData,
      (err: Error, result: any) => {
        if (err) {
          res.status(StatusCode.Unauthorized).json({ message: err });
        } else {
          res.cookie("forgotData", result.forgotData, {
            httpOnly: true,
          });
          res.status(StatusCode.OK).json(result.forgotPasswordStatus);
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
      let userData = {
        email: decoded.userData.email,
        password: decoded.userData.password,
      };
      UserClient.PasswordUpdate(userData, (err: Error, result: any) => {
        if (err) {
          res.status(StatusCode.Unauthorized).json({ message: err });
        } else {
          if (result.passwordUpdate) {
            res.status(StatusCode.OK).json({ status: true });
          } else {
            res.status(StatusCode.Unauthorized).json({ status: false });
          }
        }
      });
    } else {
      res.json({ status: false });
    }
  };
}
