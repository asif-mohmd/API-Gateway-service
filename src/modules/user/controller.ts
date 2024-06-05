import { Request, Response, NextFunction } from "express";
import { UserClient } from "./config/grpc-client/userClient";
import jwt from "jsonwebtoken";
import {statusCode} from "asif-status-codes-package"
import { format } from "path";
import crypto from "crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/s3Config";
interface S3Params {
  Bucket: string;
  Key: string;
  Body: any;
  ContentType: any;
}
export default class UserController {



  onGetUserDetails = (req: Request, res: Response, next: NextFunction) => {
    console.log("iiiiiiiiiiiioooooooooooooooooooooooooooooo")
    const userData = req.cookies.userData;
    const decoded: any = jwt.verify(
      userData,
      process.env.JWT_SECRET || ""
    );
    const userId = decoded.userId

    UserClient.GetUserDetails({userId}, (err: Error, result: any) => {
      const userData = req.cookies.userData;
      
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        res.status(statusCode.OK).json(result);
      }
    });
  };


  register = (req: Request, res: Response, next: NextFunction) => {
    UserClient.Register(req.body, (err: Error, result: any) => {
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        if (result.registerStatus) {
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
    console.log(req.body)
    UserClient.Login(req.body, (err: Error, result: any) => {
      const userData = req.cookies.userData;
      
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        if(result.status===200){
          res.cookie("userData", result.activationToken, {
            httpOnly: false,
          });
        }
      
        res.json(result);  
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
    const forgotData = req.cookies.forgotData;

    const decoded: any = jwt.verify(
      forgotData.token,
      process.env.JWT_SECRET || ""
    );
    
    if (req.body.otp === decoded.activationCode) {
      const forgotData = {
        email: decoded.userData.email,
        password: decoded.userData.password,
      };
      UserClient.PasswordUpdate(forgotData, (err: Error, result: any) => {
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
    UserClient.CreateUserCourse(req.body.createUserCourse, (err: Error, result: any) => {
      
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {      
        res.status(statusCode.OK).json(result);
      }
    });
  }; 

  uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
    let avatarURL = "";
    const randomName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");
    const bucketName = process.env.S3_BUCKET_NAME || "";
    const imageName = `geniusGrid-user-avatar/${randomName()}`;

    const params: S3Params = {
      Bucket: bucketName,
      Key: imageName,
      Body: req.file?.buffer,
      ContentType: req.file?.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    avatarURL = `https://transcode-genius.s3.ap-south-1.amazonaws.com/${imageName}`;
 
    const formData = {
      avatarURL : avatarURL,
      userId : req.body.userId
    }

    UserClient.AvatarURL(formData, (err: Error, result: any) => {
      
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {      
        res.status(statusCode.OK).json(result);
      }
    });
    // Convert the image buffer to a Base64 encoded string
   

  }

}
