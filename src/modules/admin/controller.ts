import { Request, Response, NextFunction } from "express";
import { AdminClient } from "./config/grpc-client/adminClient";
import {statusCode} from "asif-status-codes-package"
import { UserClient } from "../user/config/grpc-client/userClient";
import { InstructorClient } from "../instructor/config/grpc-client/instructorClient";

export default class AdminController {


  addCategory= (req: Request, res: Response, next: NextFunction) => {
    console.log("admioneeeeeeeeeeeeeeeee",req.body)
    const category = req.body.categoryName
    AdminClient.AddCategory(req.body, (err: Error, result: any) => {
 
      if (err) {
        res.status(statusCode.Unauthorized).json(result);
        console.log("err in login API Gateway");
      } else {
        console.log("=====",result,"]]]]]]]]]]]]]]]]]]]]]")
  
        console.log("else caseee loginnnn");
        console.log("------", result, "-----------");
        res.status(statusCode.OK).json(result)
      }
    });
  }; 
     

 
 login = (req: Request, res: Response, next: NextFunction) => {
  console.log("admioneeeeeeeeeeeeeeeee",req.body)
  AdminClient.Login(req.body.adminLoginData, (err: Error, result: any) => {
 
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
      console.log("err in login API Gateway");
    } else {
      console.log("=====",result,"]]]]]]]]]]]]]]]]]]]]]")
      res.cookie("adminData", result.activationToken, {
        httpOnly: true,
      });
      console.log("else caseee loginnnn");
      console.log("------", result, "-----------");
      res.status(statusCode.OK).json(result)
    }
  });
};

getAllUsers= (req: Request, res: Response, next: NextFunction) => {
  console.log("admioneeeeeeeeeeeeeeeee",req.body)
  UserClient.GetAllUsers(null, (err: Error, result: any) => {
 
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
      console.log("err in login API Gateway");
    } else {
 
      console.log("------", result, "-----------");
      res.status(statusCode.OK).json(result)
    }
  });
};

getAllInstructors= (req: Request, res: Response, next: NextFunction) => {
  console.log("admioneeeeeeeeeeeeeeeee",req.body)
  InstructorClient.GetAllInstructors(null, (err: Error, result: any) => {
 
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
      console.log("err in login API Gateway");
    } else {
 
      console.log("------", result, "-----------");
      res.status(statusCode.OK).json(result)
    }
  });
};

userBlockUnblock= (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.userBlockUnblock,"admioneeeeeeeeeeeeeeeee",req.body)
  UserClient.UserBlockUnblock(req.body, (err: Error, result: any) => {
 
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
      console.log("err in login API Gateway");
    } else {
  
      console.log("------", result, "-----------");
      res.status(statusCode.OK).json(result)
    }
  });
}; 
  
instructorBlockUnblock=(req: Request, res: Response, next: NextFunction) => {
  console.log("admioneeeeeeeeeeeeeeeee",req.body)
  InstructorClient.InstructorBlockUnblock(req.body.instructorBlockUnblock, (err: Error, result: any) => {
  
    if (err) {
      res.status(statusCode.Unauthorized).json(result);
      console.log("err in login API Gateway");
    } else {
 
      console.log("------", result, "-----------");
      res.status(statusCode.OK).json(result)
    }
  });
};

}