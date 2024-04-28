import { Request, Response, NextFunction } from "express";

import { StatusCode } from "../../interfaces/enums";
import { CourseClient } from "./config/grpc-client/courseClient";
import jwt from "jsonwebtoken";

import RabbitMQClient from "../../rabbitMQ/client"


export default class courseController {



  createCourse = async (req: Request, res: Response, next: NextFunction) => {
    const operation = "create-edit-course"
    const courseDetails = req.body.courseDetails
    const lessonContents = req.body.lessons
    const instructorData = req.cookies.instructorData;
    const decoded: any = jwt.verify(instructorData, process.env.JWT_SECRET || "");

    const courseData = {

      instructorId: decoded.instructorId,
      courseDetails,
      lessonContents
    }
    const response = await RabbitMQClient.produce(courseData, operation)

    res.send({ response })
  }

  getLessonsContents = async (req: Request, res: Response, next: NextFunction) => {
    const operation = "get-lessons-contents"
    const instructorData = req.cookies.instructorData;
    const decoded: any = jwt.verify(instructorData, process.env.JWT_SECRET || "");
    const response = await RabbitMQClient.produce(decoded.instructorId, operation)
    // console.log(response, "gete course=====------------===========")
    res.send({ response })
  }

  getCourseDetails = async (req: Request, res: Response, next: NextFunction) => {
    const operation = "get-course-details"
    const courseId = req.params.id
    const response = await RabbitMQClient.produce(courseId, operation)
    res.send({ response })

  }

  deleteCourse =  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body,"idddddddddd course deleteeeeeee")
    const operation = "delete-course-details"
    const response = await RabbitMQClient.produce(req.body.courseId,operation)
    res.send({ response })

  }


  listCourse = (req: Request, res: Response, next: NextFunction) => {
    console.log("list course herererer")
    const instructorData = req.cookies.instructorData;
    const decoded: any = jwt.verify(instructorData, process.env.JWT_SECRET || "");
    const instructorId = decoded.instructorId

    const updatedValues = {
      instructorId: decoded.instructorId,
    };

    console.log(updatedValues)
    CourseClient.ListCourse(updatedValues, (err: Error, result: any) => {
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
        console.log("err in API gateway");
      } else {
       
        if (result.courseStatus) {
          res.status(StatusCode.OK).json({ courseData: result });
        } else {
          res.status(StatusCode.Unauthorized).json({ courseData: false });
        }
      }
    })

  }

  


}
