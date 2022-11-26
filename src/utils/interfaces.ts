import WebSocket from 'ws';

export interface Rooms {
  [key: string]: {
    [key: string]: WebSocket
  }
}
