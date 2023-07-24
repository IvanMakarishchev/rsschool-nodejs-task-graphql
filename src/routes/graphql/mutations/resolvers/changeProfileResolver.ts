import { FastifyInstance } from 'fastify';
import { GraphQLNonNull } from 'graphql';
import { profileType } from '../../queries/types/profileType.js';
import { UUIDType } from '../../queries/types/uuid.js';
import { changeProfileInput } from '../data/changeProfileData.js';

export const changeProfileResolver = {
  type: profileType,
  args: {
    id: { type: UUIDType },
    dto: { type: new GraphQLNonNull(changeProfileInput) },
  },
  resolve: (parent, { id, dto }, context: FastifyInstance) => {
    if (!id) return null;
    return context.prisma.profile.update({
      where: {
        id: id,
      },
      data: dto,
    });
  },
};
