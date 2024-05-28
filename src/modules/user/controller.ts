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
    console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiii",req.body)
    UserClient.Login(req.body, (err: Error, result: any) => {
      const userData = req.cookies.userData;
      console.log(result,"ggggggggggggggggggggggggggg",result)
      
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        console.log(result.userId,"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",result,"mmmmmmmmmmmmmmmmmmmmmmmmmm")
        res.cookie("userData", result.activationToken, {
          httpOnly: false,
        });
        res.status(statusCode.OK).json(result);  
      }
    });
  };

  forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.forgotData,"forrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
    UserClient.ForgotPassword(
      req.body.forgotData,
      (err: Error, result: any) => {
        if (err) {
          res.status(statusCode.Unauthorized).json({ message: err });
        } else {
          console.log("forrrrrrrrrrrrrrrrrrrrrr",result.forgotData)
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
    console.log(forgotData,"rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrof")

    const decoded: any = jwt.verify(
      forgotData.token,
      process.env.JWT_SECRET || ""
    );
    
    if (req.body.otp === decoded.activationCode) {
      const forgotData = {
        email: decoded.userData.email,
        password: decoded.userData.password,
      };
      console.log(forgotData,"7777777777777777777777777777777777777777777777777777777777777777777777777777777")
      UserClient.PasswordUpdate(forgotData, (err: Error, result: any) => {
        if (err) {
          res.status(statusCode.Unauthorized).json({ message: err });
        } else {
          if (result.passwordUpdate) {
            console.log(result.passwordUpdate,"tryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
            res.status(statusCode.OK).json({ status: true });
          } else {
            console.log("oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
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

  uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
    console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiii",req.file);
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

    console.log(avatarURL,"==================")
 
    const formData = {
      avatarURL : avatarURL,
      userId : req.body.userId
    }
console.log(formData,"aaaaaaassssssssssssssss")

    UserClient.AvatarURL(formData, (err: Error, result: any) => {

      console.log(result,"ggggggggggggggggggggggggggg")
      
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        console.log(result,"mmmmmmmmmmmmmmmmmmmmmmmmmm")
      
        res.status(statusCode.OK).json(result);
      }
    });
    // Convert the image buffer to a Base64 encoded string
   

  }

}
