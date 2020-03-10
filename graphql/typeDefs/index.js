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
   users: [user],
   subGroup: [accessGroup]
}
type menu{
   _id:ID!,
   pid: String,
   title: String,
   desc:String,
   seq:Int,
   private:Boolean,
   comp:company,
   access:[accessGroup],
   layout:[layout]
}
type layout{
    _id:ID!,
    ctrid:control,
    seq:Int,
    size:Int
 }
type control{
   _id:ID!,
   type: String,
   title: String,
   desc: String,
   created: String,
   comp: company,
   origincontrol: control,
   access: [accessGroup],
   private: Boolean
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

 

`;


// const schema = makeExecutableSchema({
//     typeDefs,
//     resolvers
// })
module.exports = typeDefs;