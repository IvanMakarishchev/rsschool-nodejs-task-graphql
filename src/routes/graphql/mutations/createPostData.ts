import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const createPostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    author: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: {type: UUIDType }
  },
});
