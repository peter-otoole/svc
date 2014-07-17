$(document).ready(function(){
	$( "#banner_logo-img" ).click(function() {
		location = "/";		
	});
	$( "#banner_title" ).click(function() {
		location = "/";	
	});
	
	var imgData = $("#img-data").html();
	$("#public-share-image").html("<img id='public-share-image-img' src='"+imgData+"' >");
});


