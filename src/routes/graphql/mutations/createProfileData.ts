import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { UUIDType } from "../types/uuid.js";
import { memberId } from "../types/memberType.js";

export const createProfileInput = new GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields: {
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    userId: {type: UUIDType},
    memberTypeId: {type: memberId},
  }
})