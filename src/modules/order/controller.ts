import { Request, Response, NextFunction } from "express";
import { statusCode } from "asif-status-codes-package";
import RabbitMQClient from "./rabbitMQ/client";

export default class orderController {
  checkoutOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("---------=========------------,", req.body.courseData);
      const userCourseDetails = {
       courseData : req.body.courseData,
       userData :  req.body.userDetails
      }
      
      const operation = "make-payment";
      const response = await RabbitMQClient.produce(
        userCourseDetails,
        operation
      );
      console.log("xxxxxxxxxxxx", response, "xxxxxxxxxxx");
      res.status(statusCode.OK).send({ response });
    } catch (err) {
      res.send({ err });
    }
  };
}
