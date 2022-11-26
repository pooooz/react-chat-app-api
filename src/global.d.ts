import { JwtPayload } from 'jsonwebtoken';

declare global {
  export interface CustomJWTPayload extends JwtPayload {
    id?: number;
    name?: string;
    email?: string;
  }
}

declare global {
  namespace Express {
    export interface User {
      id: string;
      email: string;
      name: string;
    }
  }
}
