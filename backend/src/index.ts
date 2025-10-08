import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import expressWinston from 'express-winston';

import { userRouter } from './routes/user.routes.js';
import helmet from 'helmet';
import { healthCheckRouter } from './routes/healthcheck.route.js';
import { logger } from './utils/logger.js';
import { productRouter } from './routes/products.routes.js';
import { salesRouter } from './routes/sales.route.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};
app.use(cors(corsOptions));

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} → {{res.statusCode}}',
    expressFormat: true,
    colorize: false,
  })
);

app.use('/api', healthCheckRouter);
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', salesRouter);

app.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
});
