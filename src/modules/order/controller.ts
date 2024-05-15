import { Request, Response, NextFunction } from "express";
import { statusCode } from "asif-status-codes-package";
import RabbitMQClient from "./rabbitMQ/client";

export default class orderController {
  checkoutOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("---------=========------------,", req.body.courseData);
      const operation = "make-payment";
      const response = await RabbitMQClient.produce(
        req.body.courseData,
        operation
      );
      console.log("xxxxxxxxxxxx", response, "xxxxxxxxxxx");
      res.status(statusCode.OK).send({ response });
    } catch (err) {
      res.send({ err });
    }
  };
}
