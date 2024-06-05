import { Request, Response, NextFunction } from "express";
import { statusCode } from "asif-status-codes-package";
import { CourseClient } from "./config/grpc-client/courseClient";
import jwt from "jsonwebtoken";
import RabbitMQClient from "./rabbitMQ/client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/s3Config";
import crypto from "crypto";

interface S3Params {
  Bucket: string;
  Key: string;
  Body: any;
  ContentType: any;
}

export default class courseController {
  createCourse = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    let response;

    const operation = "create-edit-course";
    const courseDetails = req.body;
    const instructorData = req.cookies.instructorData;

    const decoded: any = jwt.verify(
      instructorData,
      process.env.JWT_SECRET || ""
    );

    if (file) {
      let url = "";
      const randomName = (bytes = 32) =>
        crypto.randomBytes(bytes).toString("hex");
      const bucketName = process.env.S3_BUCKET_NAME || "";
      const imageName = `geniusGrid-course-thumbnail/${randomName()}`;

      const params: S3Params = {
        Bucket: bucketName,
        Key: imageName,
        Body: file?.buffer,
        ContentType: file?.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);
      url = `https://transcode-genius.s3.ap-south-1.amazonaws.com/${imageName}`;

      // Convert the image buffer to a Base64 encoded string
      courseDetails.thumbnail = url;
      const courseData = {
        instructorId: decoded.instructorId,
        courseDetails,
      };
      response = await RabbitMQClient.produce(courseData, operation);
    } else {
      const courseData = {
        instructorId: decoded.instructorId,
        courseDetails,
      };
      response = await RabbitMQClient.produce(courseData, operation);
    }
    res.send({ response });
  };

  getLessonsContents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const operation = "get-lessons-contents";
    const instructorData = req.cookies.instructorData;
    const decoded: any = jwt.verify(
      instructorData,
      process.env.JWT_SECRET || ""
    );
    const response = await RabbitMQClient.produce(
      decoded.instructorId,
      operation
    );
    res.send({ response });
  };

  getCourseDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const operation = "get-course-details";
    const courseId = req.params.id;
    const response = await RabbitMQClient.produce(courseId, operation);
    res.send({ response });
  };

  deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    const operation = "delete-course-details";
    const response = await RabbitMQClient.produce(req.body.courseId, operation);
    res.send({ response });
  };

  listCourse = (req: Request, res: Response, next: NextFunction) => {
    const instructorData = req.cookies.instructorData;
    const decoded: any = jwt.verify(
      instructorData,
      process.env.JWT_SECRET || ""
    );
    const instructorId = decoded.instructorId;

    const updatedValues = {
      instructorId: decoded.instructorId,
    };

    CourseClient.ListCourse(updatedValues, (err: Error, result: any) => {
      if (err) {
        res.status(statusCode.Unauthorized).json({ message: err });
      } else {
        if (result.courseStatus) {
          res.status(statusCode.OK).json({ courseData: result });
        } else {
          res.status(statusCode.Unauthorized).json({ courseData: false });
        }
      }
    });
  };

  getAllUserCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    const operation = "get-all-user-courses";
    const response = await RabbitMQClient.produce(null, operation);
    res.send({ response });
  };

  getUserPurchasedCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const operation = "get-user-purchased-courses";
    const response = await RabbitMQClient.produce(req.body, operation);
    res.send({ response });
  };

  addQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const operation = "add-question";
      const response: any = await RabbitMQClient.produce(data, operation);
      res.status(statusCode.OK).json();
    } catch (e: any) {
      next(e);
    }
  };

  addAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const operation = "add-answer";
      const response: any = await RabbitMQClient.produce(data, operation);
      res.status(statusCode.OK).json();
    } catch (e: any) {
      next(e);
    }
  };
}
