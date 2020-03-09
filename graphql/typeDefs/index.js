var Graphql = require("graphql");
var { makeExecutableSchema } = require("graphql-tools");
scalar Date;
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
    pid: String,
   title: String,
   desc:String,
   seq:Int,
   private:Boolean,
   access:[access],
   layout:{
    _id:ID!,
    ctrid:ID,
    seq:Int,
    size:Int
   }
}

type control{
   _id:ID!,
   type: String,
    title: String,
    desc: String,
    created: Date,
    comp: company,
    origincontrol: control,
    access: [accessGroup],
    private: Boolean
}
type accessGroup{
   comp: company,
    name: String,
    desc: String,
    users: [user],
    subGroup: [accessGroup]
}

type Query{
  companies:[company]
  users:[user]
  accessGroups[accessGroup]
menues:[menu]
    controls:[control]
    

  company(_id:ID!):company
  user(_id:ID!):user
  accessGroup(_id:ID!):accessGroup
  menu(_id:ID!):menu
  control(_id:ID!):control
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