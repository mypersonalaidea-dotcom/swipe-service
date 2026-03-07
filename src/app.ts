import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profile/profile.routes';
import flatsRoutes from './modules/flats/flats.routes';
import matchingRoutes from './modules/matching/matching.routes';
import messagingRoutes from './modules/messaging/messaging.routes';
import socialRoutes from './modules/social/social.routes';
import masterRoutes from './modules/master/master.routes';
import adminRoutes from './modules/admin/admin.routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/flats', flatsRoutes);
app.use('/api/v1/discover', matchingRoutes);
app.use('/api/v1/conversations', messagingRoutes);
app.use('/api/v1', socialRoutes); // /saved-profiles, /reports, /blocks
app.use('/api/v1/master', masterRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorHandler);

export default app;
