var express = require('express');
var request = require('request');
var cheerio = require("cheerio");
var url2 = require('url');
var router = express.Router();
var mongoose = require('mongoose'),
  Request = mongoose.model('Requests');

request = request.defaults({ proxy : 'http://10.31.0.1:8080',jar: true});
//request = request.defaults({ jar: true});


var options = {
    url: 'http://www.google.com/ncr',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16'
    }
};

var  returnstr={};
returnstr.pending="1";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Request page' });
});

router.post('/',function(req, res,next) {
	console.dir(req.body.query);
	if(req.body.query)
	{
		res.statusCode=200;
		returnstr.action="0x1";
		request(options, function () {

		    request('https://www.google.com/search?gws_rd=ssl&site=&source=hp&q='+req.body.query+'&oq='+req.body.query, function (error, response, body) {
		    	if(error)
		    	{
		    		returnstr.speech="Sorry sir, there was an internal server error";
		    		var new_request=new Request(returnstr);
        			new_request.save(function(err, task) {
					    if (err)
					      return res.send(err);
					    return res.end(JSON.stringify(returnstr));
					});
		    	}
		    	else
		    	{
			    	//console.log(body);
			        var $ = cheerio.load(body);
			        console.log("Loaded body");
			        var result=$("h3.r a").get();
			        var hasWiki=0;
			        var output="";
			        for(var i=0;i<result.length;i++)
			        {
			        	var lnk=result[i].attribs.href;
			        	var queryData = url2.parse(lnk, true).query;
			        	if(queryData.q)
			        	{
			        		if(queryData.q.indexOf('en.wikipedia.org') != -1)
			        		{
			        			output=queryData.q;
			        			console.log(queryData.q);
			        			hasWiki=1;
			        			break;
			        		}
			        	}

			        }
			        if(hasWiki==0)
			        {
			        	var lnk=result[0].attribs.href;
			        	var queryData = url2.parse(lnk, true).query;
			        	if(queryData.q)
			        	{
			        		output=queryData.q;
			        		console.log(queryData.q);
			        	}
			        	else
			        	{
			        		returnstr.speech="Sorry sir, could not find anything on the internet at the moment.";
		    				var new_request=new Request(returnstr);
				        			new_request.save(function(err, task) {
									    if (err)
									      return res.send(err);
									    return res.end(JSON.stringify(returnstr));
									});
			        	}
			        }
			        //console.log('')
			        if(hasWiki==1){
				        request(output,function(e,r,b){
				        	if(e)
				        	{
				        		console.log(e);
				        		returnstr.speech="Sorry sir, could not find anything on the internet at the moment.";
			    				var new_request=new Request(returnstr);
				        			new_request.save(function(err, task) {
									    if (err)
									      return res.send(err);
									    return res.end(JSON.stringify(returnstr));
									});
				        	}
				        	else
				        	{
				        		var $=cheerio.load(b);
				        		var resu=$("p").first().text();
				        		out=resu.replace(/ *\([^)]*\) */g, "").replace(/ *\[[^\]]*]/, '').replace('/\n/g','');
				        		console.log(resu);
				        		returnstr.speech=out;
				        		var new_request=new Request(returnstr);
				        			new_request.save(function(err, task) {
									    if (err)
									      return res.send(err);
									    return res.end(JSON.stringify(returnstr));
									});
				        	}
				        });
					}
					else
					{
				        var re_url="http://api.smmry.com/&SM_API_KEY=D0E01A9979&SM_LENGTH=4&SM_URL="+output;
				        request(re_url,function(e,r,b){
				        	if(e)
				        	{
				        		console.log(e);
				        		returnstr.speech="Sorry sir, could not find anything on the internet at the moment.";
			    				var new_request=new Request(returnstr);
				        			new_request.save(function(err, task) {
									    if (err)
									      return res.send(err);
									    return res.end(JSON.stringify(returnstr));
									});
				        	}
				        	else
				        	{				    
				        		var data=JSON.parse(b);
				        		if (data.hasOwnProperty('sm_api_error'))
				        		{
				        			console.log(b);
				        			returnstr.speech="Sorry sir, could not find anything on the internet at the moment.";
			    					var new_request=new Request(returnstr);
				        			new_request.save(function(err, task) {
									    if (err)
									      return res.send(err);
									    return res.end(JSON.stringify(returnstr));
									});
				        		}
				        		else
				        		{
				        			returnstr.speech=data.sm_api_content;
				        			var new_request=new Request(returnstr);
				        			new_request.save(function(err, task) {
									    if (err)
									      return res.send(err);
									    return res.end(JSON.stringify(returnstr));
									});
				        			
				        		}
				        		
				        	}
				        });
			    	}
			        
			    }
		    });
		});

	}
	else
		res.render('index', {title:'Reuest Page'});
});

module.exports = router;
