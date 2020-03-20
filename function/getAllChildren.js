 const du = require('./dataUtil');

 exports.get = (menuArray, selectedKey) => {

     let treeDt = du.getTreeFromFlatData({
         flatData: menuArray.map(node => ({ ...node, title: node.title })),
         getKey: node => node._id, // resolve a node's key
         getParentKey: node => node.pid, // resolve a node's parent's key
         rootKey: selectedKey // The value of the parent key when there is no parent (i.e., at root level)
     });

     console.log("its getallchildren,", treeDt)
     //2. select part of treeDt auto converted to flat style again
     const subList = getChildren(treeDt, selectedKey);
     return subList;
 }

 function getChildren(collection, ids) {
     //getChildren (data.children, '10165381978')
     //

     // store ids in this variable
     var result = [];
     // determines if an id is found,
     var found = false;

     // makes sure that ids is always an array of id
     ids = [].concat(ids);

     // iterate over the collection, name the callback for recursion
     // if you prefer to use lodash, then use:
     // _.each(collection, function iterator(value) {...});
     collection.forEach(function iterator(value) {
         // Matching the list of `ids` from the iterated userId.
         // If a match is found, then we set `found` to true.
         var isStop = ~ids.indexOf(value.id) && (found = true);

         // did we get a match?
         if (found) {
             // add the matched ID and the IDs from its descendants
             result.push(value);
         }

         // itereate recursively over its descendants
         // If you prefer to use lodash then use:
         // _.each(value.children, iterator)
         (value.children || []).forEach(iterator);

         // is the currently iterated item's ID within the list of `ids`?
         if (isStop) {
             // set `found` to false, to prevent adding IDs that aren't matched
             found = false;
         }
     });

     // return an array of IDs
     return result;
 }