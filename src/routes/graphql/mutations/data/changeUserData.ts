import { GraphQLFloat, GraphQLInputObjectType } from "graphql";
import { UUIDType } from "../../queries/types/uuid.js";

export const changeUserInput = new GraphQLInputObjectType({
  name: "ChangeUserInput",
  fields: {
    name: {type: UUIDType},
    balance: {type: GraphQLFloat},
  }
})