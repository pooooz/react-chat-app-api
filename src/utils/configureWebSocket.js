import { v4 as uuid } from 'uuid';
import { Messages } from '../models/messages.js';

const rooms = {};

const leave = (room, connectionId) => {
  if (!rooms[room][connectionId]) return;

  if (Object.keys(rooms[room]).length === 1) delete rooms[room];

  else delete rooms[room][connectionId];
};

const join = (room, connectionId, socket) => {
  if (!rooms[room]) rooms[room] = {};
  if (!rooms[room][connectionId]) rooms[room][connectionId] = socket;
};

export const configureWebSocket = (wss) => {
  wss.on('connection', (ws) => {
    const connectionId = uuid();
    ws.on('message', (message) => {
      const stringedMessage = message.toString();
      const {
        type, text, author, chatId,
      } = JSON.parse(stringedMessage);

      switch (type) {
        case 'join':
          join(chatId, connectionId, ws);
          break;
        case 'leave':
          leave(chatId, connectionId);
          break;
        case 'message':
          Messages.create({ text, author, chatId }).then((created) => {
            Object.entries(rooms[chatId]).forEach(([, sock]) => {
              sock.send(JSON.stringify(created));
            });
          }).catch((error) => {
            console.error(error);
          });
          break;
        default:
          console.warn(`Type: ${type} unknown`);
          break;
      }
    });

    ws.on('error', (error) => ws.send(error));
  });
};
