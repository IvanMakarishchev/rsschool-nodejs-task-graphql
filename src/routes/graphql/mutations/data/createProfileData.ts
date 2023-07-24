import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { UUIDType } from "../../queries/types/uuid.js";
import { memberId } from "../../queries/types/memberType.js";

export const createProfileInput = new GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields: {
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    userId: {type: UUIDType},
    memberTypeId: {type: memberId},
  }
})