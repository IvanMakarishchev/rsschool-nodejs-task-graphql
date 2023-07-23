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

export const userPostsResolver = {
  type: new GraphQLList(post),
  resolve(parent, args: { id: string }, context: FastifyInstance) {
    return !args.id
      ? null
      : context.prisma.post.findMany({
          where: {
            authorId: args.id,
          },
        });
  },
};

export const postResolver = {
  type: post,
  args: { id: { type: UUIDType } },
  resolve: async (parent, args: { id: string }, context: FastifyInstance) => {
    return !args.id
      ? null
      : await context.prisma.post.findFirst({
          where: {
            id: args.id,
          },
        });
  },
};
