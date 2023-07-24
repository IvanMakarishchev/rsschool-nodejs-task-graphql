import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { memberId } from "../../queries/types/memberType.js";

export const changeProfileInput = new GraphQLInputObjectType({
  name: "ChangeProfileInput",
  fields: {
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    memberTypeId: {type: memberId},
  }
})