import { FastifyInstance } from 'fastify';
import { GraphQLNonNull } from 'graphql';
import { user } from '../../queries/types/userType.js';
import { UUIDType } from '../../queries/types/uuid.js';
import { changeUserInput } from '../data/changeUserData.js';

export const changeUserResolver = {
  type: user,
  args: {
    id: { type: UUIDType },
    dto: { type: new GraphQLNonNull(changeUserInput) },
  },
  resolve: (parent, { id, dto }, context: FastifyInstance) => {
    if (!id) return null;
    return context.prisma.user.update({
      where: {
        id: id,
      },
      data: dto,
    });
  },
};
