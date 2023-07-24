import { FastifyInstance } from 'fastify';
import { GraphQLBoolean } from 'graphql';
import { UUIDType } from '../../queries/types/uuid.js';

export const unsubsctibeFromResolver = {
  type: GraphQLBoolean,
  args: {
    userId: { type: UUIDType },
    authorId: { type: UUIDType },
  },
  resolve: async (parent, { userId, authorId }, context: FastifyInstance) => {
    return (await context.prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          authorId: authorId,
          subscriberId: userId,
        },
      },
    }))
      ? true
      : false;
  },
};
