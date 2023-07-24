import { FastifyInstance } from 'fastify';
import { GraphQLList } from 'graphql';
import { user } from '../types/userType.js';
import { UUIDType } from '../types/uuid.js';

export const usersResolver = {
  type: new GraphQLList(user),
  resolve(parent, args, context: FastifyInstance) {
    return context.prisma.user.findMany();
  },
};

export const userResolver = {
  type: user,
  args: { id: { type: UUIDType } },
  resolve: async (parent, args: { id: string }, context: FastifyInstance) => {
    return !args.id
      ? null
      : await context.prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
  },
};
