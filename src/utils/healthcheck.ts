import express, { Request, Response } from "express";
import RabbitMQClient from "../modules/courses/rabbitMQ/client";
import axios from "axios";

const router = express.Router();

// Health check functions
const checkDatabaseConnection = async (): Promise<boolean> => {
  // Add your database connection check logic here
  return true; // Simplified for this example
};

const checkRabbitMQConnection = async (): Promise<boolean> => {
  try {
    await RabbitMQClient.checkConnection(); // Assuming checkConnection() is a method in your RabbitMQ client
    return true;
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    return false;
  }
};

const checkServiceHealth = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch (error) {
    console.error(`Service at ${url} is down:`, error);
    return false;
  }
};

// Health check endpoint
router.get('/', async (_req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: await checkDatabaseConnection(),
      rabbitMQ: await checkRabbitMQConnection(),
      userService: await checkServiceHealth('http://0.0.0.0:8080/health'), // Adjust URLs as needed
      orderService: await checkServiceHealth('http://order-service-url/health'), // Adjust URLs as needed
    }
  };

  const allHealthy = Object.values(healthcheck.checks).every(status => status);
  if (allHealthy) {
    res.status(200).send(healthcheck);
  } else {
    res.status(503).send(healthcheck);
  }
});

export default router;
