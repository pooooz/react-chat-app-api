import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

import ChatRouter from './routes/chat.js';
import MessageRouter from './routes/messages.js';
import AuthRouter from './routes/auth.js';
import { verifyToken } from './middlewares/tokenMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const URI = process.env.MONGODB_URI;

mongoose.connect(URI).then(() => {
  console.log('Connected to DB');
}).catch((error) => console.log(error));

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/status', (req, res) => res.send('OK'));

app.use('/chats', ChatRouter);
app.use('/messages', MessageRouter);

app.use('/', AuthRouter);

app.get('/profile', verifyToken, (req, res) => {
  res.send('Im secured');
});

app.use(errorMiddleware);

app.all('*', (_, res) => {
  res.status(404).json({ error: 404 });
});

app.listen(process.env.PORT || 5000, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
