import { FastifyInstance } from 'fastify';
import { GraphQLBoolean } from 'graphql';
import { UUIDType } from '../../queries/types/uuid.js';

export const deletePostResolver = {
  type: GraphQLBoolean,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (parent, { id }, context: FastifyInstance) => {
    if (!id) return false;
    const deletePost = await context.prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    if (!deletePost) return false;
    return (await context.prisma.post.delete({
      where: {
        id: id,
      },
    }))
      ? true
      : false;
  },
};
