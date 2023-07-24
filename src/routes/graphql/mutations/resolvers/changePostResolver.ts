import { FastifyInstance } from 'fastify';
import { GraphQLNonNull } from 'graphql';
import { post } from '../../queries/types/postType.js';
import { UUIDType } from '../../queries/types/uuid.js';
import { changePostInput } from '../data/changePostData.js';

export const changePostResolver = {
  type: post,
  args: {
    id: { type: UUIDType },
    dto: { type: new GraphQLNonNull(changePostInput) },
  },
  resolve: (parent, { id, dto }, context: FastifyInstance) => {
    if (!id) return null;
    return context.prisma.post.update({
      where: {
        id: id,
      },
      data: dto,
    });
  },
};
