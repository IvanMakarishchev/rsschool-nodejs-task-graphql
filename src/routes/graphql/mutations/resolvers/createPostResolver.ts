import { FastifyInstance } from 'fastify';
import { GraphQLNonNull } from 'graphql';
import { post } from '../../queries/types/postType.js';
import { createPostInput } from '../data/createPostData.js';

export const createPostResolver = {
  type: post,
  args: {
    dto: { type: new GraphQLNonNull(createPostInput) },
  },
  resolve: (parent, { dto }, context: FastifyInstance) => {
    return context.prisma.post.create({
      data: dto,
    });
  },
};
