// This file extends the Express Request type to include the user property
import 'express';

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
