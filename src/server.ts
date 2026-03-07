import http from 'http';
import app from './app';
import { setupSocket } from './modules/messaging/socket';
import { env } from './config/env';
import { prisma } from './config/database';
import { logger } from './utils/logger';

const server = http.createServer(app);

// Setup WebSockets
setupSocket(server);

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
