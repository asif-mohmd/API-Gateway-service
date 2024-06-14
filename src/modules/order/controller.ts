import { Request, Response, NextFunction } from "express";
import { statusCode } from "asif-status-codes-package";
import RabbitMQClient from "./rabbitMQ/client";
import jwt from "jsonwebtoken";

export default class orderController {


  totalOrderAnalysis= async (req: Request, res: Response, next: NextFunction) => {
    try {
    

     const operation = "total-order-analysis"
     const response = await RabbitMQClient.produce({},operation)
     if(response){
      res.status(statusCode.OK).send({ response });
     }else{
      res.status(statusCode.BadRequest)
     }
    
    } catch (err) {
      res.send({ err });
    }
  };


  orderAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const instructorData = req.cookies.instructorData;
      const decoded: any = jwt.verify(
        instructorData,
        process.env.JWT_SECRET || ""
      );
      const instructorId = decoded.instructorId;

     const operation = "get-order-analysis"
     const response = await RabbitMQClient.produce(instructorId,operation)
     if(response){
      res.status(statusCode.OK).send({ response });
     }else{
      res.status(statusCode.BadRequest)
     }
    
    } catch (err) {
      res.send({ err });
    }
  };




  checkoutOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseDetails = {
        courseData: req.body.courseData,
        userData: req.body.userDetails,
      };

      const operation = "make-payment";
      const response = await RabbitMQClient.produce(
        userCourseDetails,
        operation
      );
      res.status(statusCode.OK).send({ response });
    } catch (err) {
      res.send({ err });
    }
  };

  getPurchasedUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const instructorData = req.cookies.instructorData;
      const decoded: any = jwt.verify(
        instructorData,
        process.env.JWT_SECRET || ""
      );
      const instructorId = decoded.instructorId;

      const operation = "get-course-purchased-users";
      const response = await RabbitMQClient.produce(instructorId, operation);
      res.status(statusCode.OK).send({ response });
    } catch (error) {}
  };
}
