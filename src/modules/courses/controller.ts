import { Request, Response, NextFunction } from "express";

import { StatusCode } from "../../interfaces/enums";
import { CourseClient } from "./config/grpc-client/courseClient";
import jwt from "jsonwebtoken";

import RabbitMQClient from "../../rabbitMQ/client"


export default class courseController {



  createCourse = async (req: Request, res: Response, next: NextFunction) => {
    const operation = "create-course"
    console.log(req.body.courseDetails, "99999999999999999999999999999999999999")
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


  // getCourseDetails = (req: Request, res: Response, next: NextFunction) => {


  //   const updatedValues = {
  //     courseId: req.params.id,
  //   };
  //   console.log(updatedValues, "[[[[[[[]]]]]]]]")

  //   CourseClient.GetCourseDetails(updatedValues, (err: Error, result: any) => {
  //     if (err) {
  //       res.status(StatusCode.Unauthorized).json({ message: err });
  //       console.log("err in API gateway");
  //     } else {
  //       console.log("----", result, "----------------");
  //       if (result.courseStatus) {
  //         console.log(result,"ooooooooooooooooooooooooooo")
  //         res.status(StatusCode.OK).json({ courseDetails: result });
  //       } else {
  //         res.status(StatusCode.Unauthorized).json({ courseData: false });
  //       }
  //     }
  //   })

  // }



  // createCourse = (req: Request, res: Response, next: NextFunction) => {

  //   const instructorData = req.cookies.instructorData;
  //   const decoded: any = jwt.verify(instructorData, process.env.JWT_SECRET || "");

  //   // Creating a new object with existing properties of values and instructorId
  //   const updatedValues = {
  //     ...req.body.values,
  //     instructorId: decoded.instructorId,
  //   };
  //   console.log(updatedValues);
  //   CourseClient.CreateCourse(updatedValues, (err: Error, result: any) => {
  //     if (err) {
  //       res.status(StatusCode.Unauthorized).json({ message: err });
  //       console.log("err in API gateway");
  //     } else {
  //       console.log("----", result, "----------------");
  //       if (result.courseStatus) {
  //         res.json({ status: true });
  //       } else {
  //         res.json({ status: false });
  //       }
  //     }
  //   });
  // };

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

  

  editCourseDetails = (req: Request, res: Response, next: NextFunction) => {

    console.log(req.body.courseData, "oooooooooopppppppppppppppppp")
    CourseClient.EditCourseDetails(req.body.courseData, (err: Error, result: any) => {
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
        console.log("err in API gateway");
      } else {
        console.log("----", result, "----------------");
        if (result.courseStatus) {
          res.status(StatusCode.OK).json({ courseDetails: result });
        } else {
          res.status(StatusCode.Unauthorized).json({ courseData: false });
        }
      }
    })

  }


}
