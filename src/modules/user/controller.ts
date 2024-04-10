import { Request, Response, NextFunction } from "express";
import { UserClient } from "./config/grpc-client/userClient";
import jwt from "jsonwebtoken";

export const register = (req: Request, res: Response, next: NextFunction) => {
  UserClient.Register(req.body.formData, (err: Error, result: any) => {
    if (err) {
      res.status(401).json({ message: err });
    } else {
      if (result.registerStatus) {
        console.log("userrrrrrr",result.userData)
        res.cookie("userData", result.userData, {
          httpOnly: true,
        });
        res.json({ status:true });
      } else {
        res.json({ status:false });
      }
    }
  });
};

export const otp = (req: Request, res: Response, next: NextFunction) => {
  const userData = req.cookies.userData;
  
  const decoded: any = jwt.verify(userData.token, process.env.JWT_SECRET || "");
  if (req.body.otp === decoded.activationCode) {
    UserClient.ActivateUser(decoded.userData, (err: Error, result: any) => {
      if (err) {
        res.status(401).json({ message: err });
      } else {
        if (result.status) {
          res.status(200).json({ status: true });
        } else {
          res.status(401).json({ status: false });
        }
      }
    });
  } else {
    res.status(401).json({ status: false });
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiii")
  UserClient.Login(req.body.loginData, (err: Error, result: any) => {
    const userData = req.cookies.userData;
    if (err) {
      res.status(401).json({ message: err });
    } else {
      res.status(201).json(result);
    }
  });
};

export const forgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  UserClient.ForgotPassword(req.body.forgotData, (err: Error, result: any) => {
    if (err) {
      res.status(401).json({ message: err });
    } else {
      res.cookie("forgotData", result.forgotData, {
        httpOnly: true,
      });
      res.status(201).json(result.forgotPasswordStatus);
    }
  });
};

export const forgotOtp = (req: Request, res: Response, next: NextFunction) => {
  const userData = req.cookies.forgotData;

  const decoded: any = jwt.verify(userData.token, process.env.JWT_SECRET || "");
  if (req.body.otp === decoded.activationCode) {
    let userData = {
      email: decoded.userData.email,
      password: decoded.userData.password,
    };
    UserClient.PasswordUpdate(userData, (err: Error, result: any) => {
      if (err) {
        res.status(401).json({ message: err });
      } else {
        if (result.passwordUpdate) {
          res.status(200).json({ status: true });
        } else {
          res.status(401).json({ status: false });
        }
      }
    });
  } else {
    res.json({ status: false });
  }
};
