var Graphql = require("graphql");
var { makeExecutableSchema } = require("graphql-tools");

//var { company, menu, control, accessGroup } = require("../model/models");
var company = require("../../model/models")["Company"];

var menu = require("../../model/models")["Menu"];
var user = require("../../model/models")["User"];
const typeDefs = `
type company{
  _id:ID!,
   id: String,
    name: String,
    language: String,
    module: String
}
type user{
  _id:ID!,
  id:String,
  password:String!,
  email: String!,
  name: String!,
  group: String,
  comp: company
}
type menu{
  _id:ID!,
   id: String,
    pid: String
}
type geo{
  lat:Float,
  lng:Float
}

type Query{
  companies:[company]
  users:[user]
  getuser(_id:ID!):user
  getmenu(_id:ID!):menu
  menues:[menu]
}
 input MenuInput {
    id: String!
}
type Mutation {
    createMenu(input: MenuInput): menu
}

`;


// const schema = makeExecutableSchema({
//     typeDefs,
//     resolvers
// })
module.exports = typeDefs;