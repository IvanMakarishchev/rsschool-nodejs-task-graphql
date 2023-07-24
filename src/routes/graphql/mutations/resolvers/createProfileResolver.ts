import { FastifyInstance } from 'fastify';
import { GraphQLNonNull } from 'graphql';
import { profileType } from '../../queries/types/profileType.js';
import { createProfileInput } from '../data/createProfileData.js';

export const createProfileResolver = {
  type: profileType,
  args: {
    dto: { type: new GraphQLNonNull(createProfileInput) },
  },
  resolve: (parent, { dto }, context: FastifyInstance) => {
    return context.prisma.profile.create({
      data: dto,
    });
  },
};
