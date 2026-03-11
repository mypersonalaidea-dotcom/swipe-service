import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profile/profile.routes';
import flatsRoutes from './modules/flats/flats.routes';
import matchingRoutes from './modules/matching/matching.routes';
import messagingRoutes from './modules/messaging/messaging.routes';
import socialRoutes from './modules/social/social.routes';
import masterRoutes from './modules/master/master.routes';
import adminRoutes from './modules/admin/admin.routes';
import { errorHandler } from './middleware/error.middleware';
import { env } from './config/env';

const app: Application = express();

// ─── Security Headers ─────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
  contentSecurityPolicy: true,
}));

// ─── CORS ─────────────────────────────────────────────────────────────────
// Only allow requests from your actual frontend origins.
// Add more origins as needed (e.g. your Render frontend URL).
const allowedOrigins: string[] = (env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o: string) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (native mobile / curl / Postman)
    // but block browser cross-origin requests from unknown domains.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parser ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ─── Request Logging ──────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Global Rate Limiter ──────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// ─── Strict Auth-Route Limiter ────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 login/signup attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

// ─── Disable Fingerprinting ───────────────────────────────────────────────
app.disable('x-powered-by');

// ─── Routes ───────────────────────────────────────────────────────────────
// Auth routes get the strict limiter
app.use('/api/v1/auth', authLimiter, authRoutes);

// All other routes — auth is enforced PER-ROUTE inside the module
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/flats', flatsRoutes);
app.use('/api/v1/matching', matchingRoutes);
app.use('/api/v1/messages', messagingRoutes);
app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/master', masterRoutes);
app.use('/api/v1/admin', adminRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

export default app;
