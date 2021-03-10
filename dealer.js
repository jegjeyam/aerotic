var Cloudant = require('cloudant'),
request = require('request');


exports.listDealer = function (req, res,cloudant_url) {
	
	var cloudant = Cloudant({url: cloudant_url});
	var url = cloudant_url + "/aerotic/_design/mijo_users/_view/user"
	
	var db = cloudant.db.use("aerotic");
	
	request({
		 url: url,
		 json: true
		}, function (error, response, body) {
			if (!error && response.statusCode === 200)
			{
				//Check if current input is present in the table, else add. If present then return with error message
				var user_data = body.rows;
				
				var dealers = []
				for(var i=0; i< user_data.length; i++)
				{
					var doc = user_data[i];
					if(doc.value[0]=="dealer")
					{
						dealer={email:doc.key,cert:doc.value[1],name:doc.value[2]}
						dealers.push(dealer)
					}
					
				}
				res.render('dealer_list',{dealers:dealers});
			}
			else
			{
				console.log("No data from URL. Response : " + response.statusCode);
				name_string="{\"no data present\":\"No\"}";
				res.contentType('application/json');
				res.send(JSON.parse(name_string));
			}
		});
}

exports.addDealer = function (req, res,cloudant_url) {
	
	var cloudant = Cloudant({url: cloudant_url});
	
	var url = cloudant_url + "/aerotic/_design/mijo_users/_view/user"
	var email_present = 0; //flag variable for checking if name is already present before inserting
	var email=req.query.email
	var db = cloudant.db.use("aerotic");

	if(req.session["role"]=="admin"){
		//In this case, check if the ID is already present, else, insert a new document
		request({
				 url: url,
				 json: true
				}, function (error, response, body) {
			if (!error && response.statusCode === 200)
			{
				//Check if current input is present in the table, else add. If present then return with error message
				var user_data = body.rows;
				var loop_len = user_data.length;
				for(var i=0; i< loop_len; i++)
				{
					var doc = user_data[i];
					if(email === doc.key)
					{
						email_present = 1;
						break;
					}
				}
				if(email_present === 0) 
				{
					
					db.insert({_id: req.query.email, name: req.query.name, role: "dealer", certs: req.query.certs}, function(err, data){
						if (!err)
						{
							console.log("Added new dealer");
							name_string="{\"added\":\"Yes\"}";
							res.contentType('application/json'); //res.contentType and res.send is added inside every block as code returns immediately
							res.send(JSON.parse(name_string));
						}
						else
						{
							console.log("Error inserting into DB " + err);
							console.log(req.query)
							name_string="{\"added\":\"No\"}";
							res.contentType('application/json');
							res.send(JSON.parse(name_string));
	
						}
					});
			    }
				else
				{
					console.log("Email is already present");
					name_string="{\"added\":\"Email Exists\"}";
					res.contentType('application/json');
					res.send(JSON.parse(name_string));
				}
			}
			else
			{
				console.log("No data from URL. Response : " + response.statusCode);
				name_string="{\"added\":\"No\"}";
				res.contentType('application/json');
				res.send(JSON.parse(name_string));
			}
		});
	}
	else
	{
		console.log("ALERT : Invalid Operation.. suspected hacking!!");
		name_string="{\"Sorry!!\":\"No\"}";
		res.contentType('application/json');
		res.send(JSON.parse(name_string));
	}
	
}


exports.addCertCnt = function (req, res,cloudant_url) {
	
	var cloudant = Cloudant({url: cloudant_url});
	
	var url = cloudant_url + "/aerotic/_design/mijo_users/_view/user"
	var current_cnt = 0; 
	var email=req.query.email
	var db = cloudant.db.use("aerotic");
	var rev="";
	var dealer_name="";
		
	if(req.session["role"]=="admin"){
		request({
				 url: url,
				 json: true
				}, function (error, response, body) {
			if (!error && response.statusCode === 200)
			{
				//Check if current input is present in the table, else add. If present then return with error message
				var user_data = body.rows;
				var loop_len = user_data.length;
				for(var i=0; i< loop_len; i++)
				{
					var doc = user_data[i];
					console.log("in Db : " + doc.value[1]);
					if(email === doc.key)
					{
						current_cnt = parseInt(doc.value[1]);
						dealer_name=doc.value[2]
						rev=doc.value[3]
						break;
					}
				}
				current_cnt=current_cnt+parseInt(req.query.certs);
				db.insert({_id: req.query.email, name: dealer_name, role: "dealer", certs: current_cnt,_rev:rev}, function(err, data){
						if (!err)
						{
							console.log("Added new dealer");
							name_string="{\"added\":\"Yes\"}";
							res.contentType('application/json'); //res.contentType and res.send is added inside every block as code returns immediately
							res.send(JSON.parse(name_string));
						}
						else
						{
							console.log("Error inserting into DB " + err);
							console.log(req.query)
							name_string="{\"added\":\"No\"}";
							res.contentType('application/json');
							res.send(JSON.parse(name_string));
	
						}
				});
			    
			}
			else
			{
				console.log("No data from URL. Response : " + response.statusCode);
				name_string="{\"added\":\"No\"}";
				res.contentType('application/json');
				res.send(JSON.parse(name_string));
			}
		});
	}
	else
	{
		console.log("ALERT : Invalid Operation.. suspected hacking!!");
		name_string="{\"Sorry!!\":\"No\"}";
		res.contentType('application/json');
		res.send(JSON.parse(name_string));
	}
}	