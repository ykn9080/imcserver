var express = require('express');
var router = express.Router();
module.exports=function(){
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.param('postId', function(request, response, next) {
  // Find post by ID
  // Save post to request
  request.post = {
    name: 'PHP vs. Node.js',
    url: ' http://webapplog.com/php-vs-node-js '
  };
  return next();
});

router
  .route('/posts/:postId')
  .all(function(request, response, next){
    // This will be called for request with any HTTP method
    })
  .post(function(request, response, next){
  })
  .get(function(request, response, next){
    response.json(request.post);
  })
  .put(function(request, response, next){
    // ... Update the post
    response.json(request.post);
  })
  .delete(function(request, response, next){
    // ... Delete the post
    response.json({'message': 'ok'});
  })
}
//module.exports = router;
