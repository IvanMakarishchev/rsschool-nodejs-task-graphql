import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
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
