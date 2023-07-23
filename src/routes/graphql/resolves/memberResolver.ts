import { FastifyInstance } from 'fastify';
import { GraphQLList } from 'graphql';
import { enumMemberId, memberTypes } from '../types/memberType.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export const membersResolver = {
  type: new GraphQLList(memberTypes),
  resolve(parent, args, context: FastifyInstance) {
    return context.prisma.memberType.findMany();
  },
};

export const memberResolver = {
  type: memberTypes,
  args: { id: { type: enumMemberId } },
  resolve: (parent, args: { id: MemberTypeId }, context: FastifyInstance) => {
    if (!args.id) return null;
    return context.prisma.memberType.findUnique({
      where: {
        id: args.id,
      },
    });
  },
};
