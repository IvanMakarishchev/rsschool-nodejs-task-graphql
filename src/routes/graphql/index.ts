import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLObjectType, GraphQLSchema, graphql, parse, validate } from 'graphql';
import {
  profilesResolver,
  profileResolver,
} from './queries/resolvers/profileResolver.js';
import { userResolver, usersResolver } from './queries/resolvers/usersResolver.js';
import { postResolver, postsResolver } from './queries/resolvers/postResolver.js';
import { memberResolver, membersResolver } from './queries/resolvers/memberResolver.js';
import { PrismaClient } from '@prisma/client';
import { createPostResolver } from './mutations/resolvers/createPostResolver.js';
import { createUserResolver } from './mutations/resolvers/createUserResolver.js';
import { createProfileResolver } from './mutations/resolvers/createProfileResolver.js';
import { deletePostResolver } from './mutations/resolvers/deletePostResolver.js';
import { deleteProfileResolver } from './mutations/resolvers/deleteProfileResolver.js';
import { deleteUserResolver } from './mutations/resolvers/deleteUserResolver.js';
import { changePostResolver } from './mutations/resolvers/changePostResolver.js';
import { changeProfileResolver } from './mutations/resolvers/changeProfileResolver.js';
import { changeUserResolver } from './mutations/resolvers/changeUserResolver.js';
import { subscribeToResolver } from './mutations/resolvers/subscribeToResolver.js';
import { unsubsctibeFromResolver } from './mutations/resolvers/unsubscribeFromResolver.js';
import depthLimit from 'graphql-depth-limit';

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
    createPost: createPostResolver,
    createUser: createUserResolver,
    createProfile: createProfileResolver,
    deletePost: deletePostResolver,
    deleteProfile: deleteProfileResolver,
    deleteUser: deleteUserResolver,
    changePost: changePostResolver,
    changeProfile: changeProfileResolver,
    changeUser: changeUserResolver,
    subscribeTo: subscribeToResolver,
    unsubscribeFrom: unsubsctibeFromResolver,
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
      const errors = validate(schema, parse(req.body.query), [depthLimit(5)]);
      return !errors.length
        ? await graphql({
            schema: schema,
            source: req.body.query,
            variableValues: req.body.variables,
            contextValue: fastify,
          })
        : { errors };
    },
  });
};

export default plugin;
