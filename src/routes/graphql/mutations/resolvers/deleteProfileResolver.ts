import { FastifyInstance } from 'fastify';
import { GraphQLBoolean } from 'graphql';
import { UUIDType } from '../../queries/types/uuid.js';

export const deleteProfileResolver = {
  type: GraphQLBoolean,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (parent, { id }, context: FastifyInstance) => {
    if (!id) return false;
    const deleteProfile = await context.prisma.profile.findUnique({
      where: {
        id: id,
      },
    });
    if (!deleteProfile) return false;
    return (await context.prisma.profile.delete({
      where: {
        id: id,
      },
    }))
      ? true
      : false;
  },
};
