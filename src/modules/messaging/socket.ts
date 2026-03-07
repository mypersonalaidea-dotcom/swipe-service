import { Server } from 'socket.io';
import http from 'http';
import { logger } from '../../utils/logger';

export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}
