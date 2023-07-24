import { FastifyInstance } from 'fastify';
import { user } from '../../queries/types/userType.js';
import { UUIDType } from '../../queries/types/uuid.js';

export const subscribeToResolver = {
  type: user,
  args: {
    userId: { type: UUIDType },
    authorId: { type: UUIDType },
  },
  resolve: (parent, { userId, authorId }, context: FastifyInstance) => {
    return context.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userSubscribedTo: {
          create: {
            authorId: authorId,
          },
        },
      },
    });
  },
};
