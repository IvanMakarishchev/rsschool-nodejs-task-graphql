import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLObjectType, GraphQLSchema, graphql, parse, validate } from 'graphql';
import { profilesResolver, profileResolver } from './resolves/profileResolver.js';
import { userResolver, usersResolver } from './resolves/usersResolver.js';
import { postResolver, postsResolver } from './resolves/postResolver.js';
import { memberResolver, membersResolver } from './resolves/memberResolver.js';
import depthLimit from 'graphql-depth-limit';

// const Post = new GraphQLObjectType({
//   name: 'Post',
//   fields: () => ({
//     id: { type: GraphQLID },
//     title: { type: GraphQLString },
//     content: { type: GraphQLString },
//     author: new GraphQLList(User),
//     authorId: { type: GraphQLID },
//   }),
// });

// const SubscribersOnAuthors = new GraphQLObjectType({
//   name: 'SubscribersOnAuthors',
//   fields: () => ({
//     subscriber: new GraphQLList(User),
//     subscriberId: { type: GraphQLID },
//     author: new GraphQLList(User),
//     authorId: { type: GraphQLID },
//   }),
// });

// const Profile = new GraphQLObjectType({
//   name: 'Profile',
//   fields: () => ({
//     id: { type: GraphQLID },
//     isMale: { type: GraphQLBoolean },
//     yearOfBirth: { type: GraphQLInt },
//     user: new GraphQLList(User),
//     userId: { type: GraphQLID },
//     memberType: { type: MemberType },
//     memberTypeId: { type: GraphQLString },
//   }),
// });

// const User = new GraphQLObjectType({
//   name: 'User',
//   fields: () => ({
//     id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     balance: { type: GraphQLInt },
//     profile: new GraphQLList(Profile),
//     posts: { type: new GraphQLList(GraphQLString) },
//     userSubscribedTo: { type: new GraphQLList(SubscribersOnAuthors) },
//     subscribedToUser: { type: new GraphQLList(SubscribersOnAuthors) },
//   }),
// });

// const MemberType = new GraphQLObjectType({
//   name: 'MemberType',
//   fields: () => ({
//     id: { type: UUIDType },
//     isMale: { type: GraphQLBoolean },
//     yearOfBirth: { type: GraphQLInt },
//     // user: new GraphQLList(User),
//   }),
// });

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

// const mutation = new GraphQLObjectType({});

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
