import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  graphql,
} from 'graphql';
import { profilesResolver, profileResolver } from './resolves/profileResolver.js';
import { userResolver, usersResolver } from './resolves/usersResolver.js';
import { postResolver, postsResolver } from './resolves/postResolver.js';
import { memberResolver, membersResolver } from './resolves/memberResolver.js';
import { post } from './types/postType.js';
import { FastifyInstance } from 'fastify';
import { createPostInput } from './mutations/createPostData.js';
import { user } from './types/userType.js';
import { profileType } from './types/profileType.js';
import { createUserInput } from './mutations/createUserData.js';
import { createProfileInput } from './mutations/createProfileData.js';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './types/uuid.js';
import { changePostInput } from './mutations/changePostData.js';
import { changeProfileInput } from './mutations/changeProfileData.js';
import { changeUserInput } from './mutations/changeUserData.js';

export const prismaDB = new PrismaClient();

const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    profiles: profilesResolver,
    profile: profileResolver,
    users: usersResolver,
    user: userResolver,
    posts: postsResolver,
    post: postResolver,
    memberTypes: membersResolver,
    memberType: memberResolver,
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: post,
      args: {
        dto: { type: new GraphQLNonNull(createPostInput) },
      },
      resolve: (parent, { dto }, context: FastifyInstance) => {
        return context.prisma.post.create({
          data: dto,
        });
      },
    },
    createUser: {
      type: user,
      args: {
        dto: { type: new GraphQLNonNull(createUserInput) },
      },
      resolve: (parent, { dto }, context: FastifyInstance) => {
        return context.prisma.user.create({
          data: dto,
        });
      },
    },
    createProfile: {
      type: profileType,
      args: {
        dto: { type: new GraphQLNonNull(createProfileInput) },
      },
      resolve: (parent, { dto }, context: FastifyInstance) => {
        return context.prisma.profile.create({
          data: dto,
        });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (parent, { id }, context: FastifyInstance) => {
        if (!id) return false;
        const deletePost = await context.prisma.post.findUnique({
          where: {
            id: id,
          },
        });
        if (!deletePost) return false;
        return (await context.prisma.post.delete({
          where: {
            id: id,
          },
        }))
          ? true
          : false;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (parent, { id }, context: FastifyInstance) => {
        if (!id) return false;
        const deleteProfile = await context.prisma.profile.findUnique({
          where: {
            id: id,
          },
        });
        if (!deleteProfile) return false;
        return (await context.prisma.profile.delete({
          where: {
            id: id,
          },
        }))
          ? true
          : false;
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (parent, { id }, context: FastifyInstance) => {
        if (!id) return false;
        const deleteUser = await context.prisma.user.findUnique({
          where: {
            id: id,
          },
        });
        if (!deleteUser) return false;
        return (await context.prisma.user.delete({
          where: {
            id: id,
          },
        }))
          ? true
          : false;
      },
    },
    changePost: {
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
    },
    changeProfile: {
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
    },
    changeUser: {
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
    },
    subscribeTo: {
      type: user,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: (parent, { userId, authorId }, context: FastifyInstance) => {
        return context.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: authorId,
              },
            },
          },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (parent, { userId, authorId }, context: FastifyInstance) => {
        return (await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              authorId: authorId,
              subscriberId: userId,
            },
          },
        }))
          ? true
          : false;
      },
    },
  },
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const schema = new GraphQLSchema({
        query: query,
        mutation: mutation,
      });
      return await graphql({
        schema: schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: fastify,
      });
    },
  });
};

export default plugin;
