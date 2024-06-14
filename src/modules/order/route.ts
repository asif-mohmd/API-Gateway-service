import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import orderController from "./controller";
import multer from "multer";

const controller = new orderController();

const orderRoute: Application = express();


orderRoute.use(express.json()); // Add this line if you want to parse JSON request bodies


orderRoute.post("/checkout/session" ,controller.checkoutOrder );
orderRoute.get("/purchased/users", controller.getPurchasedUsers)
orderRoute.get("/order-analysis", controller.orderAnalysis)
orderRoute.get("/total-order-analysis",controller.totalOrderAnalysis)



export default orderRoute;
