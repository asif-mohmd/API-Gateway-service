import { Request, Response, NextFunction } from "express";
import { InstructorClient } from "./config/grpc-client/instructorClient";
import jwt from "jsonwebtoken";
import { statusCode } from "asif-status-codes-package";

export default class InstructorController {
  register = (req: Request, res: Response, next: NextFunction) => {
    InstructorClient.Register(req.body.formData, (err: Error, result: any) => {
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        if (result.registerStatus) {
          res.cookie("instructorData", result.instructorData, {
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
    const instructorData = req.cookies.instructorData;
    const decoded: any = jwt.verify(
      instructorData.token,
      process.env.JWT_SECRET || ""
    );
    if (req.body.otp === decoded.activationCode) {
      InstructorClient.ActivateInstructor(
        decoded.instructorData,
        (err: Error, result: any) => {
          if (err) {
            res.status(statusCode.Unauthorized).json({ message: err });
          } else {
            if (result.status) {
              res.status(statusCode.OK).json({ status: true });
            } else {
              res.status(statusCode.Unauthorized).json({ status: false });
            }
          }
        }
      );
    } else {
      res.status(401).json({ status: false });
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    InstructorClient.Login(
      req.body.instructorLoginData,
      (err: Error, result: any) => {
        if (err) {
          res.status(statusCode.Unauthorized).json({ message: err });
        } else {
          res.cookie("instructorData", result.activationToken, {
            httpOnly: true,
          });
          res.status(statusCode.OK).json(result);
        }
      }
    );
  };

  profile = (req: Request, res: Response, next: NextFunction) => {
    const instructorData = req.cookies.instructorData;
    const decoded: any = jwt.verify(
      instructorData,
      process.env.JWT_SECRET || ""
    );
    const instructorId = decoded.instructorId;

    const updatedValues = {
      instructorId: decoded.instructorId,
    };

    InstructorClient.Profile(updatedValues, (err: Error, result: any) => {
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        res.status(statusCode.OK).json(result);
      }
    });
  };
}
