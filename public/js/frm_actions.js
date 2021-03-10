$(document).ready(function(){
	$("#add_name_button").click(function(e){
			e.preventDefault();
			//In 'data' parameter, send new name to be added to 'url', to be received by back end for further processing
		   
		   $.ajax({
				url: "/add_dealer",
				type: "GET",
				dataType: "json",
				data:{email: $("#demail").val(), name: $("#dname").val(), role: "dealer", certs: $("#dcerts").val()},
				contentType: "application/json",
				cache: true,
				timeout: 5000,
				complete: function() {
				  //called when complete
				  console.log('process complete');
				},
				success: function(data) {
					//Based on what's received from back end(app.js), show appropriate message.
					if(data.added === "Yes")
					{
						alert('Dealer Added..')
						$("#dname").val("");
			    		$("#dname").attr("placeholder", "Dealer Name");
			    		
			    		$("#demail").val("");
			    		$("#demail").attr("placeholder", "Dealer Email");
			    		
			    		$("#dcerts").val("100");
			    		$("#dcerts").attr("placeholder", "Certificates Count");
					}
					else if(data.added === "No")
					{
						alert('Dealer Add operation failed..')
						
					}
					else if(data.added === "Email Exists")
					{
						alert('Dealer Email Already Exists..')
					}
					
		   			
				},
				error: function() {
				  console.log('process error');
				},
			});
	});

});