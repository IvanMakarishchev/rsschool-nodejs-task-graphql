import { GraphQLFloat, GraphQLInputObjectType } from "graphql";
import { UUIDType } from "../../queries/types/uuid.js";

export const createUserInput = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: {
    name: {type: UUIDType},
    balance: {type: GraphQLFloat},
  }
})