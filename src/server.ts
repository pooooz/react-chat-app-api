import http from 'http';

import { WebSocketServer } from 'ws';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import ChatRouter from './routes/chats';
import MessageRouter from './routes/messages';
import UserRouter from './routes/user';
import AuthRouter from './routes/auth';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { authStrategy } from './middlewares/passportStrategy';
import { configureWebSocket } from './utils/configureWebSocket';

const URI = process.env.MONGODB_URI as string;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(' ');

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });
configureWebSocket(webSocketServer);

mongoose.connect(URI).then(() => {
  console.log('Connected to DB');
}).catch((error) => console.error(error));

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

passport.use(authStrategy);

app.use('/chats', passport.authenticate('jwt', { session: false }), ChatRouter);
app.use('/messages', passport.authenticate('jwt', { session: false }), MessageRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), UserRouter);
app.use('/', AuthRouter);
app.use(errorMiddleware);

app.all('*', (_, res) => {
  res.status(404).json({ error: 404 });
});

app.listen(
  process.env.PORT || 5000,
  () => console.log(`Server is running on http://localhost:${process.env.PORT}`),
);

server.listen(
  process.env.WEBSOCKET_PORT || 5001,
  () => console.log(`WebSocket is running on http://localhost:${process.env.WEBSOCKET_PORT}`),
);
