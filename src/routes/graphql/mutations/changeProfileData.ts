import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { UUIDType } from "../types/uuid.js";
import { memberId } from "../types/memberType.js";

export const changeProfileInput = new GraphQLInputObjectType({
  name: "ChangeProfileInput",
  fields: {
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    memberTypeId: {type: memberId},
  }
})