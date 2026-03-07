import { Request, Response, NextFunction } from 'express';

// Simulated simple rate limiter middleware since we haven't installed a full package like express-rate-limit yet
const requests: Record<string, number> = {};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const limit = 100;
  
  if (!requests[ip]) requests[ip] = 0;
  requests[ip]++;

  if (requests[ip] > limit) {
    return res.status(429).json({ success: false, message: 'Too many requests' });
  }

  next();
};

// Reset counts every minute
setInterval(() => {
  for (const ip in requests) delete requests[ip];
}, 60000);
