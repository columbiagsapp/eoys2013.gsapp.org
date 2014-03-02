


var title = "GSAPP End of Year Show 2013";

exports.get = function(req, res){
	console.log('eoys2013router.get(), req.url: '+req.url);
	
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	switch(url_array[1]){
		case 'eoys2013':
			if(url_array[2] == 'index'){
				res.render('index', {});
			}
			break;
			
		default:
			res.render('feed', { title: title });
			//res.send(501, 'This IP does not serve that host domain');//501 = not implemented
			break;
	}
};