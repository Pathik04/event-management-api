import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import eventsRouter from './routes/events.route.js';
import { errorHandler } from './middlewares/errorHandler.js';
import usersRoute from './routes/users.route.js';

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/users', usersRoute);
app.use('/events', eventsRouter);


app.use(errorHandler);

export default app;
