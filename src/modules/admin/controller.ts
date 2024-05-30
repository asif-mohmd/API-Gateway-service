import { Request, Response, NextFunction } from "express";
import { AdminClient } from "./config/grpc-client/adminClient";
import {statusCode} from "asif-status-codes-package"
import { UserClient } from "../user/config/grpc-client/userClient";
import { InstructorClient } from "../instructor/config/grpc-client/instructorClient";

export default class AdminController {


  addCategory= (req: Request, res: Response, next: NextFunction) => {
    const category = req.body.categoryName
    AdminClient.AddCategory(req.body, (err: Error, result: any) => {
      if (err) {
        res.status(statusCode.Unauthorized).json(result);
      } else {
        res.status(statusCode.OK).json(result)
      }
    });
  }; 
     

 login = (req: Request, res: Response, next: NextFunction) => {
  AdminClient.Login(req.body.adminLoginData, (err: Error, result: any) => {
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
    } else {
      res.cookie("adminData", result.activationToken, {
        httpOnly: true,
      });
      res.status(statusCode.OK).json(result)
    }
  });
};

getAllUsers= (req: Request, res: Response, next: NextFunction) => {
  UserClient.GetAllUsers(null, (err: Error, result: any) => {
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
    } else {
       res.status(statusCode.OK).json(result)
    }
  });
};

getAllInstructors= (req: Request, res: Response, next: NextFunction) => {
  InstructorClient.GetAllInstructors(null, (err: Error, result: any) => {
 
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
    } else {
       res.status(statusCode.OK).json(result)
    }
  });
};

userBlockUnblock= (req: Request, res: Response, next: NextFunction) => {
  UserClient.UserBlockUnblock(req.body, (err: Error, result: any) => {
 
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
    } else {
        res.status(statusCode.OK).json(result)
    }
  });
}; 
  
instructorBlockUnblock=(req: Request, res: Response, next: NextFunction) => {
  const id = req.body.id
  const isVerified = req.body.isVerified
  InstructorClient.InstructorBlockUnblock({id,isVerified}, (err: Error, result: any) => {
  
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
    } else {
      res.status(statusCode.OK).json(result)
    }
  });
};

getAllCategories =  (req: Request, res: Response, next: NextFunction) => {
  AdminClient.GetAllCategories(null, (err: Error, result: any) => {
 
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
    } else {
      res.status(statusCode.OK).json(result)
    }
  });
};


}