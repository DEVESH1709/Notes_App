import { Request } from 'express';
export {}; 
declare global {
  namespace Express {
    interface User {
      userId: string;
    }

    interface Request {
      user?: User;
    }
  }
}
