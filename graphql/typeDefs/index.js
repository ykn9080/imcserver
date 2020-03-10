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
type accessGroup{
   comp: company,
   name: String,
   desc: String,
   parent: [accessGroup]
}
type menu{
   _id:ID!,
   pid: menu,
   title: String,
   desc:String,
   seq:Int,
   comp:company,
   creator:user
   access:[accessGroup],
   layout:[layout]
}
type layout{
    _id:ID!,
    ctrid:control,
    seq:Int,
    size:Int
    reference:menu
 }
type control{
   _id:ID!,
   type: String,
   title: String,
   desc: String,
   created: String,
   creator:user,
   comp: company,
   origincontrol: control,
   access: [accessGroup]
}


type Query{
  companies:[company]
  company(_id:ID!):company
  users:[user]
  user(_id:ID!):user
  accessGroups:[accessGroup]
  accessGroup(_id:ID!):accessGroup
  menues:[menu]
  menu(_id:ID!):menu
  controls:[control]
  control(_id:ID!):control
}
input MenuInput {
        id: String!
    }


type Mutation {
   addCompany(id:String!,name: String!,language:String,module:String): company,
   updateCompany(_id: ID!,id:String!, name: String!,language:String,module:String): company,
   deleteCompany(_id: ID!): DeleteResponse,
    createMenu(input: MenuInput): menu
  }

  type DeleteResponse {
    ok: Boolean!
  }

`;


// const schema = makeExecutableSchema({
//     typeDefs,
//     resolvers
// })
module.exports = typeDefs;