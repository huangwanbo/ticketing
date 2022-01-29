import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {currentUserRouter} from './routes/current-user'
import { signinUserRouter } from './routes/singin';
import { signupUserRouter } from './routes/singup';
import { sigoutUserRouter } from './routes/singout';
import { NotFoundError } from '@hwbtickets/common';
import { errorHandler } from '@hwbtickets/common';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUserRouter);
app.use(signupUserRouter);
app.use(signinUserRouter)
app.use(sigoutUserRouter);
app.all('*', () => {
    throw new NotFoundError();
})
app.use(errorHandler);

export { app };