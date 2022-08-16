import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import 'dotenv/config';

import ChatRouter from './routes/chat.js';
import MessageRouter from './routes/messages.js';

const URI = process.env.MONGODB_URI;

console.log(URI);

mongoose.connect(URI).then(() => {
  console.log('Connected to DB');
}).catch((error) => console.log(error));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/status', (req, res) => res.send('OK'));

app.use('/chats', ChatRouter);
app.use('/messages', MessageRouter);

app.listen(process.env.PORT || 5000, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
