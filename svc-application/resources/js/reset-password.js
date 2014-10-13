$(document).ready(function(){

	$("#resetpasswordbutton").click(function(){
		resetPassword();
	});
});

var resetPassword = function(){

	var email = $("#emailaddress")[0].innerHTML,
		keyval = $("#key")[0].innerHTML;	

	if( ($("#newPassword").val() === $("#cPassword").val()) && ($.trim( $("#newPassword").val().length ) > 7) ){
			
		$.post( "/setnewpassword/", {password: $("#newPassword").val(), key: keyval, emailAddress: email
		}).done(function() {
			location = "/";	
		}).fail(function() {
			$("#password-reset_failed-text").css("visibility","visible");
			$("#password-reset_failed-text").effect("highlight", {color:"rgba(255,0,0,0.75);"}, 500); 	
		});		
	}else {

		$("#newPassword").effect("highlight", {color:"rgba(255,0,0,0.1);"}, 500);
		$("#cPassword").effect("highlight", {color:"rgba(255,0,0,0.1);"}, 500); 			
	}
};