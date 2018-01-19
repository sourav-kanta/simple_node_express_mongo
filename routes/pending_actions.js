var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
  Request = mongoose.model('Requests');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Request.find({"pending":"1"}, function(err, request) {
    if (err || request.length==0)
      return res.end("[]");
  	Request.update({pending:"1"}, {$set : { pending : "0"}}, {upsert:true, multi: true}, function(err,result){
  		if(err)
  			return res.end("[]");
  		else
    		return res.json(request);	
  	});
  });
});

module.exports = router;
