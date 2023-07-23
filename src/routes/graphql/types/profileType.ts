import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { memberId, memberTypes } from './memberType.js';
import { prismaDB } from '../index.js';

export const profileType = new GraphQLObjectType({
  name: 'Profiles',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: {
      type: memberId,
    },
    memberType: {
      type: memberTypes,
      args: { memberTypeId: { type: memberId } },
      resolve: async (parent, args: { memberTypeId: string }) => {
        return prismaDB.memberType.findFirst({
          where: {
            id: args.memberTypeId,
          },
        });
      },
    },
  }),
});
