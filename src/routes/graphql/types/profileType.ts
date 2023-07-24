import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { memberId, memberTypes } from './memberType.js';
import { FastifyInstance } from 'fastify';

export const profileType = new GraphQLObjectType({
  name: 'Profiles',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: memberId },
    memberType: {
      type: memberTypes,
      args: { memberTypeId: { type: memberId } },
      resolve: async (
        parent,
        args: { memberTypeId: string },
        context: FastifyInstance,
      ) => {
        return context.prisma.memberType.findFirst({
          where: {
            id: args.memberTypeId,
          },
        });
      },
    },
  }),
});
