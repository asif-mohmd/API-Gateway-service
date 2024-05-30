import { Request, Response, NextFunction } from "express";
import { statusCode } from "asif-status-codes-package";
import RabbitMQClient from "./rabbitMQ/client";
import jwt from "jsonwebtoken";

export default class orderController {
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
