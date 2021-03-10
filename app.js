
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http'),
  Cloudant = require('cloudant'),
  request = require('request');
  
const fileUpload = require('express-fileupload');

var bodyParser = require('body-parser')

fs = require('fs');

var joinPath = require('path.join');

var Session = require('express-session');
var google = require('googleapis');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
const ClientId = "673441921122-goh3kqqqogqgn89jsk8dv15ap8bspmko.apps.googleusercontent.com";
const ClientSecret = "t14aOsXxdZCx6umuWsI9dDfi";
var RedirectionUrl = "https://aerotic.eu-gb.mybluemix.net/oauthCallback";
//RedirectionUrl = "http://localhost:8080/oauthCallback";

//To Store URL of Cloudant VCAP Services as found under environment variables on from App Overview page
var cloudant_url;
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

cloudant_url = "https://74f1ba94-afc3-4b43-8038-5543bc698c86-bluemix:9b7d8ab0cded5dfd354eb60f11280fc12aaff5b9a14256dc34509228ef8f278a@74f1ba94-afc3-4b43-8038-5543bc698c86-bluemix.cloudant.com"
//Connect using cloudant npm and URL obtained from previous step
var cloudant = Cloudant({url: cloudant_url});
//Edit this variable value to change name of database.
var dbname = 'aerotic';

var app = express();
pdf = require('express-pdf');

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(fileUpload());
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static('public'))
app.use(pdf);


var dateFormat = require('dateformat');
var now = new Date();

/*
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
*/


app.use(Session({
    secret: 'aero-sect-1980933071',
    resave: true,
    saveUninitialized: true
}));

function getOAuthClient () {
    return new OAuth2(ClientId ,  ClientSecret, RedirectionUrl);
}

function getAuthUrl () {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google email
    var scopes = [
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });

    return url;
}

function loggedIn(req, res, next) {
	
	
	//console.log(req.get('host'))
	try{
		req.session
		}catch(e){res.redirect('/login');}
	//if(!req.session) res.redirect('/login');
	if (!req.session["tokens"]) {
        res.redirect('/login');
    } else {
    	next();
    }
	
	
}



app.use("/oauthCallback", function (req, res) {
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code;
    var email;
    var flag=0;
    oauth2Client.getToken(code, function(err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if(!err) {
    	  
        oauth2Client.setCredentials(tokens);
        
        plus.people.get({
            auth: oauth2Client,
            resourceName: 'people/me',
            personFields: 'emailAddresses,names',
            userId: 'me'
        }, function (err, user) {
            if( err ) {  res.redirect('/login'); }
            console.log("user "+ user +" logged on")
            var email=user.emails[0].value
            var flag=0;
            var url = cloudant_url + "/aerotic/_design/mijo_users/_view/user";
    		request({
    				 url: url, 
    				 json: true
    				}, function (error, response, body) {
    			if (!error && response.statusCode === 200)
    			{
    				var user_data = body.rows; //body.rows contains an array of IDs, Revision numbers and Names from the view
    				
    				for(var i=0; i< user_data.length; i++)
    					{ 
    					  if(user_data[i].key==email) {
    						  console.log("user "+ email+" logged on")
    						session["tokens"]=tokens;
    						session["email"]=email;
    						session["role"]=user_data[i].value[0];
    						flag=1;
    						break;
    					  }
    					}
    				if (flag==1)
    		        	res.redirect('/');
    		        else
    		        	res.redirect('/login?retcode=1');
    			}
    		});
            
        });
        
      }
      else{
        res.send('Login failed!!');
      }
    });
});


//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------


app.get('/', loggedIn, function(req, res){ 
	
	var url = cloudant_url + "/aerotic/_design/mijo_users/_view/user";
	var email=req.session["email"]
	request({
			 url: url, 
			 json: true
			}, function (error, response, body,req) {
		if (!error && response.statusCode === 200)
		{
			var user_data = body.rows; //body.rows contains an array of IDs, Revision numbers and Names from the view
			
			for(var i=0; i< user_data.length; i++)
				{ 
				  if(user_data[i].key==email) {
					  
					  res.render('index',{user:user_data[i].key, role:user_data[i].value[0], cert:user_data[i].value[1]});
					break;
				  }
				}
			
		}
	});
	
	}
	
);


/*
app.get('/', loggedIn, function(req, res){ 
	
	res.render('index',{user:req.session["email"], role:req.session["role"]});

	}
);
*/

app.get('/new', loggedIn, function(req, res){ 
	
	var url = cloudant_url + "/aerotic/_design/mijo_users/_view/user";
	var email=req.session["email"]
	request({
			 url: url, 
			 json: true
			}, function (error, response, body,req) {
		if (!error && response.statusCode === 200)
		{
			var user_data = body.rows; //body.rows contains an array of IDs, Revision numbers and Names from the view
			
			for(var i=0; i< user_data.length; i++)
				{ 
				  if(user_data[i].key==email) {
					  
					  res.render('cert_form',{user:user_data[i].key, role:user_data[i].value[0], cert:user_data[i].value[1]});
					break;
				  }
				}
			
		}
	});
	
	}
	
);


app.use('/login', function(req, res){ 
	
	
	var retCode=req.param('retcode',"0");var url = getAuthUrl(); res.render('login', { url: url,retCode:retCode });
	});


//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------


app.post('/cert', loggedIn, function(req, res){
	var img1=""
	var img2=""
	var img3="";
	var img=""
				
		   if (!!req.files){
			   if(!!req.files.image1)
				   {
				   	req.files.image1.mv(__dirname+"/public/img/"+req.files.image1.name, function(err) {
					    if (err)
					      return res.status(500).send(err);
					 
					    img=img+'<img src="http://localhost:8080/img/"'+req.files.image1.name+' height="125" width="125">'
					    img1=req.files.image1.name;
					  });
				   }
			   
			   if(!!req.files.image2)
			   {
			   	req.files.image2.mv(__dirname+"/public/img/"+req.files.image2.name, function(err) {
				    if (err)
				      return res.status(500).send(err);
				 
				    img=img+'<img src="http://localhost:8080/img/"'+req.files.image2.name+' height="125" width="125">'
				    img2=req.files.image2.name;
				    
				  });
			   }
			   
			   if(!!req.files.image3)
			   {
			   	req.files.image3.mv(__dirname+"/public/img/"+req.files.image3.name, function(err) {
				    if (err)
				      return res.status(500).send(err);
				 
				    img=img+'<img src="http://localhost:8080/img/"'+req.files.image3.name+' height="125" width="125">'
				    img3=req.files.image3.name;
				  });
			   }
			   
		   }
	
	var printCert = require("./cert.js").printCert;
	printCert(req, res,cloudant_url,img,img1,img2,img3);
});



app.get('/add_dealer',loggedIn,function(req, res){ 

	var addDealer = require("./dealer.js").addDealer;
	addDealer(req, res,cloudant_url);
	
});


app.get('/listd',loggedIn,function(req, res){ 
	var listDealer = require("./dealer.js").listDealer;
	listDealer(req, res,cloudant_url);
});

app.get('/add_cert_cnt',loggedIn,function(req, res){ 
	var addCertCnt = require("./dealer.js").addCertCnt;
	addCertCnt(req, res,cloudant_url);
});


app.get('/listc',loggedIn,function(req, res){ 
	
	var url = cloudant_url + "/certs1/_find"
	//var email_present = 0; //flag variable for checking if name is already present before inserting
	//var email=req.query.email
	var db3 = cloudant.db.use("certs1");

	var email=req.session["email"]
	var cloudantquery;
	
	if (req.session["role"]!="admin")
	{
		cloudantquery = {
	
			   "selector": {
			        "dealer": {
			            "$eq": email
			        }
				
			   },
			   "fields": [
				      "_id",
				      "_rev",
				      "dealer",
				      "roll_no",
				      "sl_no1",
				      "c_date",
				      "cust_name"
				      
				   ],
			   "sort": [
			      {
			         "dealer": "asc"
			      }
			   ]
			}

	}else{
	 cloudantquery = {
			   "selector": {
				      "_id": {
				         "$gt": "0"
				      }
				   },
				   "fields": [
				      "_id",
				      "_rev",
				      "dealer",
				      "roll_no",
				      "sl_no1",
				      "c_date",
				      "cust_name"
				      
				   ],
				   "sort": [
				      {
				         "_id": "asc"
				      }
				   ]
				};
	}
	request({
			method: 'POST', 
			 url: url,
			 json: true,
			 body: cloudantquery
			}, function (error, response, body) {
		if (!error && response.statusCode === 200)
		{
			//console.log(body)
			var cert_data = body.docs;
			
			res.render('cert_list',{role:req.session["role"], certs:cert_data});
			
		}
		else
		{
			console.log("No data from URL. Response : " + response.statusCode);
			name_string="{\"no data present\":\"No\"}";
			res.contentType('application/json');
			res.send(JSON.parse(name_string));
		}
	});

	
});

var port = 8080;
var server = http.createServer(app);
server.listen(port);
server.on('listening', function () {
    console.log(`listening to ${port}`);
});

