import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { profileResolver } from '../resolves/profileResolver.js';
import { postsResolver } from '../resolves/postResolver.js';
import { profileType } from './profileType.js';
import { FastifyInstance } from 'fastify';

export const user = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
      args: { id: { type: UUIDType } },
      resolve: async (parent, args: { id: string }, context: FastifyInstance) => {
        if (!args.id) return null;
        return await context.prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
    posts: postsResolver,
  },
});
