$(document).ready(function(){
	$("#add_button").click(function(e){
			e.preventDefault();
			//In 'data' parameter, send new name to be added to 'url', to be received by back end for further processing
		   
		   $.ajax({
				url: "/add_cert_cnt",
				type: "GET",
				dataType: "json",
				data:{email: $("#demail").val(), certs: $("#dcerts").val()},
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
						alert('Dealer Certificates increased..')
						location.reload();
						modal.style.display = "none"
			    		
			    		//$("#dcerts").val("100");
			    		//$("#dcerts").attr("placeholder", "Certificates Count");
					}
					else if(data.added === "No")
					{
						alert('Dealer Certificated Increase operation failed..')
						
					}
					
		   			
				},
				error: function() {
				  console.log('process error');
				},
			});
	});

});