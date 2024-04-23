import { Request, Response, NextFunction } from "express";

import { StatusCode } from "../../interfaces/enums";
import { CourseClient } from "./config/grpc-client/courseClient";
import jwt from "jsonwebtoken";

export default class courseController {
  createCourse = (req: Request, res: Response, next: NextFunction) => {

    const instructorData = req.cookies.instructorData;
    const decoded: any = jwt.verify(instructorData, process.env.JWT_SECRET || "");

    // Creating a new object with existing properties of values and instructorId
    const updatedValues = {
      ...req.body.values,
      instructorId: decoded.instructorId,
    };
    console.log(updatedValues);
    CourseClient.CreateCourse(updatedValues, (err: Error, result: any) => {
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
        console.log("err in API gateway");
      } else {
        console.log("----", result, "----------------");
        if (result.courseStatus) {
          res.json({ status: true });
        } else {
          res.json({ status: false });
        }
      }
    });
  };

  listCourse = (req: Request, res: Response, next: NextFunction) => {
    console.log("list course herererer")
    const instructorData = req.cookies.instructorData;
    console.log(instructorData,"insIddd")
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
        console.log("----", result, "----------------");
        if (result.courseStatus) {
          res.status(StatusCode.OK).json({ courseData: result });
        } else {
          res.status(StatusCode.Unauthorized).json({ courseData :false  });
        }
      }
    })

  }

  getCourseDetails = (req: Request, res: Response, next: NextFunction) => {
    

    const updatedValues = {
      courseId: req.params.id,
    };
    console.log(updatedValues,"[[[[[[[]]]]]]]]")

    CourseClient.GetCourseDetails(updatedValues, (err: Error, result: any) => {
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
        console.log("err in API gateway");
      } else {
        console.log("----", result, "----------------");
        if (result.courseStatus) {
          res.status(StatusCode.OK).json({ courseDetails: result });
        } else {
          res.status(StatusCode.Unauthorized).json({ courseData :false  });
        }
      }
    })

  }

  editCourseDetails= (req: Request, res: Response, next: NextFunction) => {
    
    console.log(req.body.courseData,"oooooooooopppppppppppppppppp")
    CourseClient.EditCourseDetails(req.body.courseData, (err: Error, result: any) => {
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
        console.log("err in API gateway");
      } else {
        console.log("----", result, "----------------");
        if (result.courseStatus) {
          res.status(StatusCode.OK).json({ courseDetails: result });
        } else {
          res.status(StatusCode.Unauthorized).json({ courseData :false  });
        }
      }
    })

  }


  addLessonContent= (req: Request, res: Response, next: NextFunction) => {
    
    let lesson = req.body.lessons

    console.log(lesson)




    
    CourseClient.AddLessonContent(lesson, (err: Error, result: any) => {
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
        console.log("err in API gateway");
      } else {
        console.log("----", result, "----------------");
        if (result.courseStatus) {
          res.status(StatusCode.OK).json({ courseDetails: result });
        } else {
          res.status(StatusCode.Unauthorized).json({ courseData :false  });
        }
      }
    })

  }



}
