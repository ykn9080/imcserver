// const { merge } = require('lodash');

// const menu = require('./menu');
// const user = require('./user');
// const resolvers = merge({},
//     menu.resolver, user.resolvers);



// console.log('this is resolvers', resolvers)
// console.log('this for menu.resolvers', menu.resolvers, menu)

// var Graphql = require("graphql");
// //var { makeExecutableSchema } = require("graphql-tools");

// //var { company, menu, control, accessGroup } = require("../model/models");
// var company = require("../../model/models")["Company"];

// var menu = require("../../model/models")["Menu"];

const resolvers = {
    Query: {
        async companies() {
            return await company.find({});
        },
        async company(parent, { _id }) {
            return await company.findById(_id)
        },
        async users() {
            return await user.find({}).populate("comp")
        },
        async user(parent, { _id }) {
            //return await user.findById(_id);
            return await user.findById(_id).populate("comp");
        },
        async accessGroups() {
            return await accessGroup.find({});
        },
        async accessGroup(parent, { _id }) {
            return await accessGroup.findById(_id)
        },
        async menues() {
            return await menu.find({}).populate("pid").populate("layout.ctrid").populate("comp").populate("access");
        },
        // async menues_type(parent, { type }) {
        //     return await menu.find({ type: type }).populate("pid").populate("layout.ctrid").populate("comp").populate("access");
        // },
        async menues_type(parent, args, ctx, info) {
            return await menu.find({ type: 'user' });
        },
        async menu(parent, { _id }) {
            return await menu.findById(_id).populate("pid").populate("layout.ctrid").populate("comp").populate("access");
        },
        async controls() {
            return await control.find({}).populate("comp").populate("access");
        },
        async control(parent, { _id }) {
            return await control.findById(_id).populate("comp").populate("access")
        },
        async bootforms() {
            return await bootform.find({}).populate("comp");
        },
        async bootform(parent, { _id }) {
            return await bootform.findById(_id).populate("comp");
        },
        // async formElements() {
        //     return await formElment.find({}).populate("comp");
        // },
        // async formElement(parent, { _id }) {
        //     return await formElement.findById(_id).populate("comp");
        // }
    },
    Mutation: {
        async createCompany(root, args) {
            console.log(args.input)
            const comp = new company(args.input);
            await comp.save();
            return comp;
            /* playgroun sample
            mutation{
              createComp(input:{
                id:"22"
                name:"testcomp222"
                language:"kr"}){
                name
                _id
              }
            }
            */
        },
        async updateCompany(root, { _id, input }) {
            const data = await company.findByIdAndUpdate(_id, input, { new: true })
            if (!data) {
                throw new Error('Error')
            }
            return data
            /* playgroun sample
            mutation{
              updateComp(_id:"5e6876f40304567c4a6d8506",input:{
                id:"221"
                name:"testcomp2221"
                language:"kr"}){
                name
                id
                _id
              }
            }
            */
        },
        deleteCompany(root, { _id }) {
            const ok = Boolean(company.findById(_id));
            company.remove({ _id: _id }).exec();
            //company.findByIdAndRemove(_id);
            return { ok };

            /* playgroun sample
             mutation{
              deleteCompany(_id:"5e68871e2703769cc6112609"){
                 ok
              }
            }
            */
        },
        async createUser(root, args) {
            const menuitem = new user(args.input);
            await menuitem.save();
            return menuitem;
        },
        async updateUser(root, { _id, input }) {
            const data = await user.findByIdAndUpdate(_id, input, { new: true })
            if (!data) {
                throw new Error('Error')
            }
            return data
        },
        async deleteUser(root, { _id }) {
            const ok = Boolean(user.findById(_id));
            user.findByIdAndRemove(_id);
            return { ok };
        },
        async createAccessGroup(root, args) {
            const item = new accessGroup(args.input);
            await item.save();
            return item;
        },
        async updateAccessGroup(root, { _id, input }) {
            const data = await accessGroup.findByIdAndUpdate(_id, input, { new: true })
            if (!data) {
                throw new Error('Error')
            }
            return data
        },
        async deleteAccessGroup(root, { _id }) {
            const ok = Boolean(accessGroup.findById(_id));
            accessGroup.findByIdAndRemove(_id);
            return { ok };
        },
        async createMenu(root, args) {
            const menuitem = new menu(args.input);
            await menuitem.save();
            return menuitem;
        },
        async updateMenu(root, { _id, input }) {
            const data = await menu.findByIdAndUpdate(_id, input, { new: true })
            if (!data) {
                throw new Error('Error')
            }
            return data
        },
        async deleteMenu(root, { _id }) {
            const ok = Boolean(menu.findById(_id));
            menu.findByIdAndRemove(_id);
            return { ok };
        },
        async createControl(root, args) {
            const ctr = new control(args.input);
            await ctr.save();
            return ctr;
        },
        async updateControl(root, { _id, input }) {
            const data = await control.findByIdAndUpdate(_id, input, { new: true })
            if (!data) {
                throw new Error('Error')
            }
            return data
        },
        async deleteControl(root, { _id }) {
            const ok = Boolean(control.findById(_id));
            control.findByIdAndRemove(_id);
            return { ok };
        },
        async createBootform(root, args) {
            const ctr = new bootform(args.input);
            await ctr.save();
            return ctr;
        },
        async updateBootform(root, { _id, input }) {
            const data = await bootform.findByIdAndUpdate(_id, input, { new: true })
            if (!data) {
                throw new Error('Error')
            }
            return data
        },
        async deleteBootform(root, { _id }) {
            const ok = Boolean(bootform.findById(_id));
            bootform.findByIdAndRemove(_id);
            return { ok };
        },
       // async createFormElement(root, args) {
       //      const ctr = new formElement(args.input);
       //      await ctr.save();
       //      return ctr;
       //  },
       //  async updateFormElement(root, { _id, input }) {
       //      const data = await formElement.findByIdAndUpdate(_id, input, { new: true })
       //      if (!data) {
       //          throw new Error('Error')
       //      }
       //      return data
       //  },
       //  async deleteFormElement(root, { _id }) {
       //      const ok = Boolean(formElement.findById(_id));
       //      formElement.findByIdAndRemove(_id);
       //      return { ok };
       //  }
    }
};

//typeDef에서 에러나는 부분보관
// type formElement{
 //   _id:ID!,
 //    controlType:String,
 //    labelText:String,
 //    name: String,
 //    desc:String,
 //    placeholder:String,
 //    formText:String,
 //    as:String,
 //    rowGroup:String,
 //    optionArray:[String]
 //    company: company
 // }


  //   formElement:[formElement]
  // formElement(_id:ID!):formElement


 // input FormElementInput{
 //    controlType:String,
 //    labelText:String,
 //    name: String,
 //    desc:String,
 //    placeholder:String,
 //    formText:String,
 //    as:String,
 //    rowGroup:String,
 //    optionArray:[String]
 //    company: ID
 // }


  // createFormElement(input: FormElementInput): formElement
  // updateFormElement(_id: ID!,input: FormElementInput): formElement
  // deleteFormElement(_id: ID!): DeleteResponse


module.exports = resolvers;