import { FastifyInstance } from 'fastify';
import { GraphQLNonNull } from 'graphql';
import { user } from '../../queries/types/userType.js';
import { createUserInput } from '../data/createUserData.js';

export const createUserResolver = {
  type: user,
  args: {
    dto: { type: new GraphQLNonNull(createUserInput) },
  },
  resolve: (parent, { dto }, context: FastifyInstance) => {
    return context.prisma.user.create({
      data: dto,
    });
  },
};
