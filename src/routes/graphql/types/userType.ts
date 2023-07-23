import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { profileType } from './profileType.js';
import { post } from './postType.js';
import { prismaDB } from '../index.js';

export const user = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
      args: { id: { type: UUIDType } },
      resolve: async (args: { id: string }) => {
        return !args.id
          ? null
          : await prismaDB.profile.findFirst({
              where: {
                userId: args.id,
              },
            });
      },
    },
    posts: {
      type: new GraphQLList(post),
      args: { id: { type: UUIDType } },
      resolve(args: { id: string }) {
        return !args.id
          ? null
          : prismaDB.post.findMany({
              where: {
                authorId: args.id,
              },
            });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(user),
      args: { id: { type: UUIDType } },
      resolve(args: { id: string }) {
        return !args.id
          ? null
          : prismaDB.user.findMany({
              where: {
                subscribedToUser: {
                  some: {
                    subscriberId: args.id,
                  },
                },
              },
            });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(user),
      args: { id: { type: UUIDType } },
      resolve(args: { id: string }) {
        return !args.id
          ? null
          : prismaDB.user.findMany({
              where: {
                userSubscribedTo: {
                  some: {
                    authorId: args.id,
                  },
                },
              },
            });
      },
    },
  }),
});
