import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import ChatRouter from './routes/chat.js';
import MessageRouter from './routes/messages.js';
import UserRouter from './routes/user.js';
import AuthRouter from './routes/auth.js';

import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { authStrategy } from './middlewares/passportStrategy.js';

const URI = process.env.MONGODB_URI;

mongoose.connect(URI).then(() => {
  console.log('Connected to DB');
}).catch((error) => console.log(error));

const app = express();

const corsOptions = {
  origin: [process.env.ALLOWED_ORIGINS.split(' ')],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

passport.use(authStrategy);

app.get('/status', (req, res) => res.send('OK'));

app.use('/chats', passport.authenticate('jwt', { session: false }), ChatRouter);
app.use('/messages', passport.authenticate('jwt', { session: false }), MessageRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), UserRouter);

app.use('/', AuthRouter);

app.use(errorMiddleware);

app.all('*', (_, res) => {
  res.status(404).json({ error: 404 });
});

app.listen(process.env.PORT || 5000, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
