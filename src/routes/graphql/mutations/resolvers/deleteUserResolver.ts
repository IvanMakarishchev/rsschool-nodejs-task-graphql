import { FastifyInstance } from 'fastify';
import { GraphQLBoolean } from 'graphql';
import { UUIDType } from '../../queries/types/uuid.js';

export const deleteUserResolver = {
  type: GraphQLBoolean,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (parent, { id }, context: FastifyInstance) => {
    if (!id) return false;
    const deleteUser = await context.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!deleteUser) return false;
    return (await context.prisma.user.delete({
      where: {
        id: id,
      },
    }))
      ? true
      : false;
  },
};
