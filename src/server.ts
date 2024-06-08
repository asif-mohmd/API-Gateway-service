import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './modules/user/route';
import instructorRoute from './modules/instructor/route';
import adminRoute from './modules/admin/route';
import courseRoute from './modules/courses/route';
import RabbitMQClient from './modules/courses/rabbitMQ/client';
import orderRoute from './modules/order/route';
import healthCheckRouter from './utils/healthcheck';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5001;

app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.geniusgrid.online'); // Adjust this to your frontend's origin
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(cors({
  origin: "http://localhost:5000",
  // origin: ['https://geniusgrid.online', 'https://www.geniusgrid.online'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use(cookieParser());

app.use('/api/', userRouter);
app.use('/api/admin', adminRoute);
app.use('/api/instructor', instructorRoute);
app.use('/api/course', courseRoute);
app.use('/api/order', orderRoute);

// Uncomment if health check route is needed
// app.use('/health', healthCheckRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  RabbitMQClient.initialize();
});
