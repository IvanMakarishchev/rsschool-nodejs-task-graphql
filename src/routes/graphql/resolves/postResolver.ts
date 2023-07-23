import { FastifyInstance } from 'fastify';
import { GraphQLList } from 'graphql';
import { post } from '../types/postType.js';
import { UUIDType } from '../types/uuid.js';

export const postsResolver = {
  type: new GraphQLList(post),
  resolve(parent, args, context: FastifyInstance) {
    return context.prisma.post.findMany();
  },
};

export const postResolver = {
  type: post,
  args: { id: { type: UUIDType } },
  resolve: async (parent, args: { id: string }, context: FastifyInstance) => {
    if (!args.id) return null;
    return await context.prisma.post.findUnique({
      where: {
        id: args.id,
      },
    });
  },
};
