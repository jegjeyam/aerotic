var Cloudant = require('cloudant'),
request = require('request'),
dateFormat = require('dateformat'),
QRCode = require('qrcode');


exports.printCert = function (req, res,cloudant_url,imgTxt,img1,img2,img3){
	var cloudant = Cloudant({url: cloudant_url});
	var email=req.session["email"]
	var url = cloudant_url + "/counter1/_design/cnt/_view/cnt";
	var now = new Date();
	request({
			 url: url, 
			 json: true
			}, function (error, response, body) {
		if (!error && response.statusCode === 200)
		{
			var user_data = body.rows; 
			
			id=user_data[0].key;
			rev=user_data[0].value[0];
			
			var pad = "00000"
			var cntr = pad.substring(0, pad.length - user_data[0].value[1].length) + user_data[0].value[1]
			
			tmp=parseInt(user_data[0].value[1])+1;
			var sl_no=req.body.sl_no
			
			var invdate=req.body.invdate
			var m_brand=req.body.m_brand
			var c_at=req.body.c_at
			var c_by=req.body.c_by

			var cust_name=req.body.cust_name
			var cust_phone=req.body.cust_phone
			var copyvalid=req.body.copyvalid
			
			var cust_addr=req.body.cust_addr
			var dealer=req.body.dealer
			var addr=req.body.addr

			var make=req.body.make
			var model=req.body.model
			var rc=req.body.rc
			var rcdate=req.body.rcdate
			var trn=req.body.trn
			var chassis=req.body.chassis

			var string_to_update = "{\"sl_no\":\"" + tmp + "\",\"_id\":\"" +id+"\",\"_rev\":\"" + rev + "\"}";
			var update_obj = JSON.parse(string_to_update);
			var db1 = cloudant.db.use("counter1");
			var c_date=req.body.c_date
			var c_by=req.body.c_by
			var c_at=req.body.c_at
			var inst_date=req.body.inst_date
			
			var engine=req.body.engine
			var km=req.body.km
			var speed=req.body.speed
			var inv=req.body.inv
			
			var fueltype=req.body.fueltype
			var rot_sl_no=req.body.rot_sl_no
			
			db1.insert(update_obj, function(err, data){
				if (!err)
				{

					var url = cloudant_url + "/aerotic/_design/mijo_users/_view/user"
					var db2 = cloudant.db.use("aerotic");
					
					request({
						 url: url, 
						 json: true
						}, function (error, response, body,req) {
					if (!error && response.statusCode === 200)
					{
							var user_data2 = body.rows; 
							
							for(var i=0; i< user_data2.length; i++)
								{ 
								  if(user_data2[i].key==email && (user_data2[i].value[0]=='admin' || user_data2[i].value[1]>0 )) {
									  
									  if (user_data2[i].value[0]!='admin')
										  updated_cert=parseInt(user_data2[i].value[1])-1;
									  else
										  updated_cert=user_data2[i].value[1];
									  
									  db2.insert({_id: user_data2[i].key, role: user_data2[i].value[0], certs: updated_cert, name:user_data2[i].value[2], _rev:user_data2[i].value[3]}, function(err, data){ 
										  if (!err)
										  {
											  console.log("New cert with sl_no:"+sl_no)
											  var db3 = cloudant.db.use("certs1");
											  
											  var d = new Date();
											  var year = d.getFullYear();
											  var month = d.getMonth();
											  var day = d.getDate();
											  var r_date1 = new Date(year + 1, month, day-1)
											  r_date1=dateFormat(r_date1, "dd-mmm-yyyy")
											  
												   
												   
											  
											  tdate=dateFormat(new Date(year, month, day),"dd-mmm-yyyy")
											  db3.insert({dealer:email, roll_no:cntr, sl_no1:sl_no,trn:trn, c_date:c_date, r_date:tdate,invdate:invdate, 
												   cust_name:cust_name, cust_addr:cust_addr, cust_phone:cust_phone, make:make, copyvalid:copyvalid,
												  model:model, rc:rc, rcdate:rcdate, chassis:chassis, inst_date:inst_date,
												  engine:engine, speed:speed,inv:inv,dealer_partner:dealer, dealer_partner_addr:addr,fueltype:fueltype,rot_sl_no:rot_sl_no, c_date:c_date,c_by:c_by, c_at:c_at,km:km}, function(err, data){
											  if (!err)
											  {

													
											  		qrcStr='Mfg By:Aerotic India Pvt Ltd. | Installed By: '+dealer+'|Cert No:'
														+sl_no+'|Fitment Date:'+dateFormat(new Date(tdate), "dd/mm/yyyy")+'|Renewal Date:'+dateFormat(new Date(r_date1), "dd/mm/yyyy")+'|Owner Name:'+cust_name+'|Make/Model:'+make+'|RC No:'+rc+'|Chassis No:'+chassis
														+'|Engine No:'+engine+'|Kilometers:'+km+'|Invoice No:'+inv+'|Calibration Date:'+dateFormat(new Date(c_date), "dd/mm/yyyy")+'|Calibrated at:'+c_at+'|Calibrated By:'+c_by
														+'|Addr. of Owner:'+cust_addr
												  QRCode.toDataURL(qrcStr, function (err, url) {


														//console.log(qrcStr)
														
														
													 ///htmlStr='<html><title>SLD FITMENT CERTIFICATE</title> <style type="text/css">div.rel {position: fixed;top: 315; right: 25px;} .logo1 { float:right } .logo2 { float:left } p {font-size:9px;} div {font-size:9px;} td {font-size:10px;} .txt3 { font-family: Gill Sans Extrabold, fantasy,system-ui,monospace ; text-align:center; color:#62626d;font-size: 12px;} .txt2 { font-size: 9px;font-family: "Gill Sans"} .input { font-size: 10px;} .txt1 {font-size: 10px; } .head1 { font-family: Gill Sans Extrabold, fantasy,system-ui,monospace ; font-size: 20px; text-align:center; color:#62626d;font-weight: 1000;} .copyright { text-align: center; padding-top: 15px; padding-bottom: 15px; text-transform: uppercase; font-weight: lighter; letter-spacing: 2px; border-top-width: 2px; } .copyright1 { font-size: 9px; font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif" } .button { width: 280px; margin-top: 10px; margin-right: auto; margin-bottom: auto; margin-left: auto; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; text-align: center; vertical-align: middle; border-radius: 10px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; border: 3px solid #A9471D; background-color:#A9471D; transition: all 0.3s linear; color: #ffffff} .hero_header { border-radius: 25px; border: 3px solid #62626d; padding: 3px; width: 200px; height: 14px; text-align: center; font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif"; text-align: center; font-weight: 1000; font-size: 10px; vertical-align: middle; } .hero_header1 { font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif"; font-weight: 800; font-size: 11px; vertical-align: middle; } .sign{font-weight:bold;font-size: 9px} body { margin: 0; background-image: url("http://localhost:8080/img/bg.jpg");background-repeat: repeat;} </style> <body> <table cellpadding="2" cellspacing="0" align="center" border="8" height="100%" width="595" bordercolor="#464647"> <tr><td valign="top"> <table cellpadding="1" cellspacing="1" align=left style="text-align:left" width="100%"><tr><td width="20%">&nbsp;&nbsp;<img width=95 height=73 src="http://localhost:8080/img/l1.jpg" /></td><td align=left><br style="line-height:0.1px;" /><span class="head1" align="left">AEROTIC INDIA PVT LTD </span><br style="line-height:0.5px;" /> <span class="txt3">Ceritified by ISO 9001-2015 </span> <br /> <br /> <span class="txt2">A36/3, First Floor, Block A, Naraina Industrial Area, Phase-1, <br style="line-height:0.1px;" />New Delhi, Delhi - 110028, India</span> </td><td width="10%" nowrap="true" align="right" class="txt2" style="vertical-align: top">Manufacturer Copy &nbsp;&nbsp;</td><tr></table> <br><br> <table cellpadding="1" cellspacing="1" align=left style="text-align:left" width="100%"><tr><td width="30%" class="txt1">Fitment Certificate No : #sl_no#</td><td><div class="hero_header">FITMENT CERTIFICATE</div> </td></tr><table> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="2" border="0" width=100%><tr><td valign="top" colspan="5" class="hero_header1">Vehicle Details</td></tr> <tr><td width="15%" class="input" nowrap="true">Registration No</td><td width="25%" class="input">: #rc#</td><td width="20%" class="input">Registration Date</td><td width="20%" class="input">: #reg_date#</td><td width=10% rowspan=4><img width="80" height="80" src="#qrc#"></td></tr> <tr><td class="input" nowrap="true">Chassis No</td><td class="input">: #chassis#</td><td class="input">Engine No</td><td class="input">: #engine#</td></tr> <tr><td class="input" nowrap="true">Make/Model</td><td class="input">: #make#</td><td class="input">Test Report Number</td><td class="input">: #trn#</td></tr> <tr><td class="input" nowrap="true">Copy Valid Date Upto</td><td class="input">: #valid_date#</td><td class="input">Kilometers</td><td class="input">: #km#</td></tr> </table> <table cellpadding="1" cellspacing="1" border="0" ><tr><td valign="top" class="hero_header1">Vehicle Owner Details</td></tr> <tr><td class="input" nowrap="true">Name : #cust_name#&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mobile : #mobil#</td></tr> <tr><td class="input" nowrap="true">Address : #cust_addr# </td></tr> </table> </td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="2" border="0" width=100% border=0><tr><td valign="top" colspan="5" class="hero_header1">SLD Details</td></tr> <tr><td width="25%" class="input" nowrap="true">SLD Serial No : #sl_no1#</td><td width="35%" class="input">Fuel Type : #fueltype#</td><td td width="35%" class="input">Invoice No : #inv#</td></tr> <tr><td class="input" nowrap="true">Model No : #model#</td><td class="input" nowrap=true>Install Date : #inst_date#</td><td class="input">Invoice Date : #date#</td></tr> <tr><td class="input" nowrap="true">Speed : #speed#</td><td class="input" nowrap=true>Renewal Date : #r_date#</td><td class="input">Rotor Seal No : #rot_sl_no#</td></tr> <tr><td class="input" nowrap="true">Calibrated By : #c_by#</td><td class="input">Calibrated At : #c_at#</td><td class="input">Calibrated Date : #c_date#</td></tr> </table> </td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%" style="border-width: thin;"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="1" border="0" width=100% border=0> <tr><td class="input" nowrap="true">Installed By : #dealer#</td></tr> <tr><td class="input" nowrap="true">Address : #addr# </td></tr> </table> </td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="2" border="0" width=100% border=0> <tr><td class="input"><img src="http://localhost:8080/img/pic.jpg" height="125" width="500"></td></tr> </table></td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="2" border="0" width=100% border=0> <tr><td style="font-size: 9px;">This is to acknowledge and confirm that we have got our vehicle bearing registration no #rc# Limitation Device manufactured by Aerotic India Pvt. Ltd. bearing Sr. No #sl_no1#. We have checked the performance of the vehicle after fitment of the said Speed Limitation Device and We Confirm that the speed of the vehicle is set to #speed# Kmph and the unit sealed at Five Point and functioning as per norms laid out in AIS 018. We are satisfied with the performance of the vita in all respects. We undertake not to rise any dispute or any legal claims against Aerotic India Pvt. Ltd. in the event that the above mentioned seals are found broken/torn/tampered a the more specifically with the respect to any variance in the speed limit set at the me of delivery, after expiry of warranty Period of 12 months from the date of installation.</td></tr> </table></td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <br><br><br><br> <table cellpadding="4" cellspacing="4" width="90%"><tr><td class="sign">Signature of Customer</td><td class="sign">Signature of RTA/RTO/STA</td><td class="sign"> Signature of Installer</td></tr></table></td></tr></table> </td></tr> </table> </body></html> '
													  imageSec='<table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="2" border="0" width=100% border=0> <tr><td class="input">#IMG#</td></tr></table></td></tr></table><br>'
													  imageSec=imageSec.replace('#IMG#',imgTxt)
													  htmlStr='<html><title>SLD FITMENT CERTIFICATE</title> <style type="text/css">div.rel {position: fixed;top: 315; right: 25px;} .logo1 { float:right } .logo2 { float:left } p {font-size:9px;} div {font-size:9px;} td {font-size:10px;} .txt3 { font-family: Gill Sans Extrabold, fantasy,system-ui,monospace ; text-align:center; color:#62626d;font-size: 12px;} .txt2 { font-size: 9px;font-family: "Gill Sans"} .input { font-size: 10px;} .txt1 {font-size: 10px; } .head1 { font-family: Gill Sans Extrabold, fantasy,system-ui,monospace ; font-size: 20px; text-align:center; color:#62626d;font-weight: 1000;} .copyright { text-align: center; padding-top: 15px; padding-bottom: 15px; text-transform: uppercase; font-weight: lighter; letter-spacing: 2px; border-top-width: 2px; } .copyright1 { font-size: 9px; font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif" } .button { width: 280px; margin-top: 10px; margin-right: auto; margin-bottom: auto; margin-left: auto; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; text-align: center; vertical-align: middle; border-radius: 10px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; border: 3px solid #A9471D; background-color:#A9471D; transition: all 0.3s linear; color: #ffffff} .hero_header { border-radius: 25px; border: 3px solid #62626d; padding: 3px; width: 200px; height: 14px; text-align: center; font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif"; text-align: center; font-weight: 1000; font-size: 10px; vertical-align: middle; } .hero_header1 { font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif"; font-weight: 800; font-size: 11px; vertical-align: middle; } .sign{font-weight:bold;font-size: 9px} body { margin: 0; background-image: url("http://localhost:8080/img/bg.jpg");background-repeat: repeat;} </style> <body> <table cellpadding="2" cellspacing="0" align="center" border="8" height="100%" width="595" bordercolor="#464647"> <tr><td valign="top"> <table cellpadding="1" cellspacing="1" align=left style="text-align:left" width="100%"><tr><td width="20%">&nbsp;&nbsp;<img width=95 height=73 src="http://localhost:8080/img/l1.jpg" /></td><td align=left><br style="line-height:0.1px;" /><span class="head1" align="left">AEROTIC INDIA PVT LTD </span><br style="line-height:0.5px;" /> <span class="txt3">Ceritified by ISO 9001-2015 </span> <br /> <br /> <span class="txt2">A36/3, First Floor, Block A, Naraina Industrial Area, Phase-1, <br style="line-height:0.1px;" />New Delhi, Delhi - 110028, India</span> </td><tr></table> <br><br> <table cellpadding="1" cellspacing="1" align=left style="text-align:left" width="100%"><tr><td width=100% align=center><div class="hero_header">CALIBRATION CERTIFICATE</div> </td></tr><table> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="2" border="0" width=100%><tr><td valign="top" colspan="5" class="hero_header1">Vehicle Details</td></tr> <tr><td width="15%" class="input" nowrap="true">Registration No</td><td width="25%" class="input">: #rc#</td><td width="20%" class="input">Registration Date</td><td width="20%" class="input">: #reg_date#</td><td width=10% rowspan=4><img width="80" height="80" src="#qrc#"></td></tr> <tr><td class="input" nowrap="true">Chassis No</td><td class="input">: #chassis#</td><td class="input">Engine No</td><td class="input">: #engine#</td></tr> <tr><td class="input" nowrap="true">Make/Model</td><td class="input">: #make#</td><td class="input">Test Report Number</td><td class="input">: #trn#</td></tr> <tr><td class="input" nowrap="true">Copy Valid Date Upto</td><td class="input">: #valid_date#</td><td class="input">Kilometers</td><td class="input">: #km#</td></tr> </table> <table cellpadding="1" cellspacing="1" border="0" ><tr><td valign="top" class="hero_header1">Vehicle Owner Details</td></tr> <tr><td class="input" nowrap="true">Name : #cust_name#&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mobile : #mobil#</td></tr> <tr><td class="input" nowrap="true">Address : #cust_addr# </td></tr> </table> </td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="2" border="0" width=100% border=0><tr><td valign="top" colspan="5" class="hero_header1">SLD Details</td></tr> <tr><td width="25%" class="input" nowrap="true">SLD Serial No : #sl_no1#</td><td width="35%" class="input">Fuel Type : #fueltype#</td><td td width="35%" class="input">Invoice No : #inv#</td></tr> <tr><td class="input" nowrap="true">Model No : #model#</td><td class="input" nowrap=true>Install Date : #inst_date#</td><td class="input">Invoice Date : #date#</td></tr> <tr><td class="input" nowrap="true">Speed : #speed#</td><td class="input" nowrap=true>Renewal Date : #r_date#</td><td class="input">Rotor Seal No : #rot_sl_no#</td></tr> <tr><td class="input" nowrap="true">Calibrated By : #c_by#</td><td class="input">Calibrated At : #c_at#</td><td class="input">Calibrated Date : #c_date#</td></tr> </table> </td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%" style="border-width: thin;"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="1" border="0" width=100% border=0> <tr><td class="input" nowrap="true">Installed By : #dealer#</td></tr> <tr><td class="input" nowrap="true">Address : #addr# </td></tr> </table> </td></tr></table> <br> #IMG# <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="1" cellspacing="2" border="0" width=100% border=0> <tr><td style="font-size: 9px;">This is to acknowledge and confirm that we have got our vehicle bearing registration no #rc# Limitation Device manufactured by Aerotic India Pvt. Ltd. bearing Sr. No #sl_no1#. We have checked the performance of the vehicle after fitment of the said Speed Limitation Device and We Confirm that the speed of the vehicle is set to #speed# Kmph and the unit sealed at Five Point and functioning as per norms laid out in AIS 018. We are satisfied with the performance of the vita in all respects. We undertake not to rise any dispute or any legal claims against Aerotic India Pvt. Ltd. in the event that the above mentioned seals are found broken/torn/tampered a the more specifically with the respect to any variance in the speed limit set at the me of delivery, after expiry of warranty Period of 12 months from the date of installation.</td></tr> </table></td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <br><br><br><br> <table cellpadding="4" cellspacing="4" width="90%"><tr><td class="sign">Signature of Customer</td><td class="sign">Signature of RTA/RTO/STA</td><td class="sign"> Signature of Installer</td></tr></table></td></tr></table> </td></tr> </table> </body></html> '
														htmlStr=htmlStr.replace('#IMG#',imageSec)
														htmlStr=htmlStr.replace('#sl_no#',cntr)
														htmlStr=htmlStr.replace('#qrc#',url)
														htmlStr=htmlStr.replace('#sl_no1#',sl_no)
														htmlStr=htmlStr.replace('#sl_no1#',sl_no)
														htmlStr=htmlStr.replace('#c_date#',dateFormat(new Date(c_date), "dd/mm/yyyy"))
														
														htmlStr=htmlStr.replace('#inst_date#',dateFormat(new Date(inst_date), "dd/mm/yyyy"))
														htmlStr=htmlStr.replace('#r_date#',dateFormat(new Date(r_date1), "dd/mm/yyyy"))
														htmlStr=htmlStr.replace('#invdate#',dateFormat(new Date(invdate), "dd/mm/yyyy"))
														htmlStr=htmlStr.replace('#valid_date#',dateFormat(new Date(copyvalid), "dd/mm/yyyy"))
														htmlStr=htmlStr.replace('#km#',km)
														htmlStr=htmlStr.replace('#c_at#',c_at)
														htmlStr=htmlStr.replace('#c_by#',c_by)
														
														htmlStr=htmlStr.replace('#cust_name#',cust_name)
														htmlStr=htmlStr.replace('#cust_addr#',cust_addr)
														htmlStr=htmlStr.replace('#mobil#',cust_phone)
														
														htmlStr=htmlStr.replace('#dealer#',dealer)
														htmlStr=htmlStr.replace('#addr#',addr)
														
														htmlStr=htmlStr.replace('#make#',make)
														htmlStr=htmlStr.replace('#model#',model)
														htmlStr=htmlStr.replace('#rc#',rc)
														htmlStr=htmlStr.replace('#rc#',rc)
														htmlStr=htmlStr.replace('#reg_date#',dateFormat(new Date(rcdate), "dd/mm/yyyy"))
														htmlStr=htmlStr.replace('#chassis#',chassis)

														htmlStr=htmlStr.replace('#engine#',engine)
														htmlStr=htmlStr.replace('#trn#',trn)
														
														htmlStr=htmlStr.replace('#speed#',speed)
														htmlStr=htmlStr.replace('#speed#',speed)
														
														htmlStr=htmlStr.replace('#inv#',inv)
														htmlStr=htmlStr.replace('#date#',dateFormat(new Date(tdate), "dd/mm/yyyy"))
														
														htmlStr=htmlStr.replace('#inv#',inv)
														htmlStr=htmlStr.replace('#fueltype#',fueltype)
														htmlStr=htmlStr.replace('#rot_sl_no#',rot_sl_no)
														
														res.pdfFromHTML({
													        filename: 'generated'+sl_no+'.pdf',
													        htmlContent: htmlStr,
													        options: {"timeout": 3000}
													    });
														//console.log(htmlStr)
														console.log("pdf generated")
													})
													
												  	
													//res.writeHead(200, {'Content-Type': 'application/pdf'});
											  }else{console.log('Error updating Certs')}})
									  
										}else{
											console.log('Error updating Aerotic DB count..');
											//console.log("{_id: \""+user_data2[i].key+", role: \""+user_data2[i].value[0]+", certs: "+updated_cert+", name:\""+user_data2[i].value[1]+", _rev:\""+user_data2[i].value[2]+"}")
										}}); //update of mijo db cnt
									  	
										break	
								   }//end if email match
									  
								}
							
						}
					});
						
					
				}
				else
				{
					console.log("Error inserting into DB " + err);
					name_string="{\"added\":\"DB insert error\"}";
					res.contentType('application/json');
					res.send(JSON.parse(string_to_update));
				}
			});//end db1.insert
			
		}
	});
	
	
}	
	
//----------	
	
	
exports.downloadCert = function (invdate,cntr,sl_no,m_brand,c_at,c_by,cust_name,cust_addr,dealer,addr,make,model,rc,chassis,c_date,engine,km,speed,inv)
{
	
	  var d = new Date();
	  var year = d.getFullYear();
	  var month = d.getMonth();
	  var day = d.getDate();
	  var r_date1 = new Date(year + 1, month, day-1)
	  r_date1=dateFormat(r_date1, "dd-mmm-yyyy")
	  

		qrcStr='Mfg By:Aerotic India Pvt Ltd. | Installed By '+dealer+'|Cert No:'
		+sl_no+'|Fitment Date:'+tdate+'|Renewal Date:'+r_date1+'|Owner Name:'+cust_name+'|Make/Model:'+make+'Model:'+model+'|RC No:'+rc+'|Chassis No:'+chassis
		+'|Engine No:'+engine+'|Kilometers:'+km+'|Invoice No:'+inv+'|Calibration Date:'+c_date+'|Calibrated at:'+c_at+'|Calibrated By:'+c_by
		+'|Addr. of Owner:'+cust_addr
		
		QRCode.toDataURL(qrcStr, function (err, url) {
			htmlStr='<html><title>SLD FITMENT CERTIFICATE</title> <style type="text/css">div.rel {position: fixed;top: 315; right: 25px;} .logo1 { float:right } .logo2 { float:left } p {font-size:9px;} div {font-size:9px;} td {font-size:10px;} .txt3 { font-family: Gill Sans Extrabold, fantasy,system-ui,monospace ; text-align:center; color:#62626d;font-size: 14px;} .txt2 { font-size: 12px;} .head1 { font-family: Gill Sans Extrabold, fantasy,system-ui,monospace ; font-size: 27px; text-align:center; color:#62626d;font-weight: 1000;} .copyright { text-align: center; padding-top: 15px; padding-bottom: 15px; text-transform: uppercase; font-weight: lighter; letter-spacing: 2px; border-top-width: 2px; } .copyright1 { font-size: 9px; font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif" } .button { width: 280px; margin-top: 10px; margin-right: auto; margin-bottom: auto; margin-left: auto; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; text-align: center; vertical-align: middle; border-radius: 10px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; border: 3px solid #A9471D; background-color:#A9471D; transition: all 0.3s linear; color: #ffffff} .txt1 {font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif"} .hero_header { border-radius: 25px; border: 3px solid #62626d; padding: 3px; width: 250px; height: 18px; text-align: center; font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif"; text-align: center; font-weight: 1000; font-size: 16px; vertical-align: middle; } .hero_header1 { font-family: "Gill Sans", "Gill Sans MT", "Myriad Pro", "DejaVu Sans Condensed", Helvetica, Arial, "sans-serif"; font-weight: 800; font-size: 14px; vertical-align: middle; } .sign{font-weight:bold;font-size: 14px} body { margin: 0; background-image: url("http://localhost:8080/img/bg.jpg");background-repeat: repeat;} </style> <body> <table cellpadding="2" cellspacing="0" align="center" border="8" height="100%" width="97%" bordercolor="#464647"> <tr><td valign="top"> <table cellpadding="1" cellspacing="1" align=left style="text-align:left" width="100%"><tr><td width="20%">&nbsp;&nbsp;<img src="http://localhost:8080/img/l1.jpg" /></td><td align=left><br style="line-height:0.1px;" /><span class="head1" align="left">AEROTIC INDIA PVT LTD </span><br style="line-height:0.5px;" /> <span class="txt3">Ceritified by ISO 9001-2015 </span> <br /> <br /> <span class="txt2">A36/3, First Floor, Block A, Naraina Industrial Area, Phase-1, <br style="line-height:0.1px;" />New Delhi, Delhi - 110028, India</span> </td><td width="10%" nowrap="true" align="right" class="txt2">Manufacturer Copy &nbsp;&nbsp;</td><tr></table> <br><br> <table cellpadding="1" cellspacing="1" align=left style="text-align:left" width="100%"><tr><td width="40%" class="txt1">Fitment Certificate No : #sl_no#</td><td><div class="hero_header">FITMENT CERTIFICATE</div> </td></tr><table> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="3" cellspacing="4" border="0" width=100%><tr><td valign="top" colspan="5" class="hero_header1">Vehicle Details</td></tr> <tr><td width="15%" class="input" nowrap="true">Registration No</td><td width="20%" class="input">: #rc#</td><td width="15%" class="input">Registration Date</td><td width="20%" class="input">: #reg_date#</td><td rowspan=4><img width="55" height="55" src="#qrc#"></td></tr> <tr><td class="input" nowrap="true">Chassis No</td><td class="input">: #chassis#</td><td class="input">Engine No</td><td class="input">: #engine#</td></tr> <tr><td class="input" nowrap="true">Make/Model</td><td class="input">: #make#</td><td class="input">Test Report Number</td><td class="input">: #TRN#</td></tr> <tr><td class="input" nowrap="true">Copy Valid Date Upto</td><td class="input" colspan=3>: #valid_date#</td></tr> </table> <br> <table cellpadding="3" cellspacing="4" border="0" ><tr><td valign="top" class="hero_header1">Vehicle Owner Details</td></tr> <tr><td class="input" nowrap="true">Name : #cust_name#&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mobile : #mobil#</td></tr> <tr><td class="input" nowrap="true">Address : #cust_addr# </td></tr> </table> </td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="3" cellspacing="4" border="0" width=100% border=0><tr><td valign="top" colspan="5" class="hero_header1">SLD Details</td></tr> <tr><td width="35%" class="input" nowrap="true">SLD Serial No : #sl_no1#</td><td width="25%" class="input">Fuel Type : #fueltype#</td><td class="input">Invoice No : #inv#</td></tr> <tr><td class="input" nowrap="true">Model No : #model#</td><td class="input">Installation Date : #c_date#</td><td class="input">Invoice Date : #date#</td></tr> <tr><td class="input" nowrap="true">Speed : #speed#</td><td class="input">Renewal Date : #r_date#</td><td class="input">Rotor Seal No : #rot_sl_no#</td></tr> </table> </td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%" style="border-width: thin;"> <tr><td valign="top" width=100%> <table cellpadding="3" cellspacing="4" border="0" width=100% border=0> <tr><td class="input" nowrap="true">Installed By : #dealer#</td></tr> <tr><td class="input" nowrap="true">Address : #addr# </td></tr> </table> </td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="3" cellspacing="4" border="0" width=100% border=0> <tr><td class="input"><img src="http://localhost:8080/img/pic.jpg"></td></tr> </table></td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <table cellpadding="3" cellspacing="4" border="0" width=100% border=0> <tr><td class="input">This is to acknowledge and confirm that we have got our vehicle bearing registration no #rc# Limitation Device manufactured by Aerotic India Pvt. Ltd. bearing Sr. No #sl_no1#. We have checked the performance of the vehicle after fitment of the said Speed Limitation Device and We Confirm that the speed of the vehicle is set to #speed# Kmph and the unit sealed at Five Point and functioning as per norms laid out in AIS 018. We are satisfied with the performance of the vita in all respects. We undertake not to rise any dispute or any legal claims against Aerotic India Pvt. Ltd. in the event that the above mentioned seals are found broken/torn/tampered a the more specifically with the respect to any variance in the speed limit set at the me of delivery, after expiry of warranty Period of 12 months from the date of installation.</td></tr> </table></td></tr></table> <br> <table cellpadding="0" cellspacing="0" align="center" bordercolor="#464647" border="1" width="100%"> <tr><td valign="top" width=100%> <br><br><br><br> <table cellpadding="4" cellspacing="4" width="90%"><tr><td class="sign">Signature of Customer</td><td class="sign">Signature of RTA/RTO/STA</td><td class="sign"> Signature of Installer</td></tr></table></td></tr></table> </td></tr> </table> </body></html> '

				  
			htmlStr=htmlStr.replace('#sl_no#',cntr)
			htmlStr=htmlStr.replace('#qrc#',url)
			htmlStr=htmlStr.replace('#sl_no1#',sl_no)
			htmlStr=htmlStr.replace('#c_date#',c_date)
			htmlStr=htmlStr.replace('#r_date#',r_date1)
			htmlStr=htmlStr.replace('#invdate#',invdate)
			htmlStr=htmlStr.replace('#m_brand#',m_brand)
			htmlStr=htmlStr.replace('#c_at#',c_at)
			htmlStr=htmlStr.replace('#c_by#',c_by)
			
			htmlStr=htmlStr.replace('#cust_name#',cust_name)
			htmlStr=htmlStr.replace('#cust_addr#',cust_addr)
			
			htmlStr=htmlStr.replace('#dealer#',dealer)
			htmlStr=htmlStr.replace('#addr#',addr)
			
			htmlStr=htmlStr.replace('#make#',make)
			htmlStr=htmlStr.replace('#model#',model)
			htmlStr=htmlStr.replace('#rc#',rc)
			htmlStr=htmlStr.replace('#chassis#',chassis)

			htmlStr=htmlStr.replace('#engine#',engine)
			htmlStr=htmlStr.replace('#km#',km)
			
			htmlStr=htmlStr.replace('#speed#',speed)
			htmlStr=htmlStr.replace('#speed#',speed)
			
			htmlStr=htmlStr.replace('#inv#',inv)
			htmlStr=htmlStr.replace('#date#',tdate)
			
			htmlStr=htmlStr.replace('#inv#',inv)
			
		    res.pdfFromHTML({
		        filename: 'generated'+sl_no+'.pdf',
		        htmlContent: htmlStr,
		        options: {"timeout": 3000}
		    });
		 
			console.log("pdf downloaded")
		});
	
}
