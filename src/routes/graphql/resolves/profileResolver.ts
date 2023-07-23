import { FastifyInstance } from 'fastify';
import { GraphQLList } from 'graphql';
import { profileType } from '../types/profileType.js';
import { UUIDType } from '../types/uuid.js';

export const profilesResolver = {
  type: new GraphQLList(profileType),
  resolve(parent, args, context: FastifyInstance) {
    return context.prisma.profile.findMany();
  },
};

export const userProfileResolver = {
  type: profileType,
  args: { id: { type: UUIDType } },
  resolve: async (parent, args: { id: string }, context: FastifyInstance) => {
    if (!args.id) return null;
    return await context.prisma.profile.findUnique({
      where: {
        userId: args.id,
      },
    });
  },
};

export const profileResolver = {
  type: profileType,
  args: { id: { type: UUIDType } },
  resolve: async (parent, args: { id: string }, context: FastifyInstance) => {
    if (!args.id) return null;
    return await context.prisma.profile.findUnique({
      where: {
        id: args.id,
      },
    });
  },
};
