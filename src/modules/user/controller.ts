import { Request, Response, NextFunction } from "express";

export const register = (req: Request, res: Response, next: NextFunction) => {
    console.log("iam herer")
    console.log(req.body);
};
