

require({},[], function () {
	

	var apiKeyInput = $('#api_key');
	var apiSecretInput = $('#api_secret');
	var fromDateInput = $('#from_date');
	var toDateInput = $('#to_date');
	var whereInput = $('#where');
	var eventInput = $('#events');	
	var bucketInput = $('#bucket');	
	var exportButton = $('#exportButton');
	var resultHref = $('#resultHref');

	exportButton.click( function ( ev ){

		ev.preventDefault();
		
		var today = new Date();
		var hour = today.getHours() > 12 ? today.getHours() - 12 : (today.getHours() < 10 ? "0" + today.getHours() : today.getHours());
		var expire = Date.UTC( today.getFullYear(), today.getMonth(), today.getDate(), hour, today.getMinutes(), today.getSeconds() + 20);
		
		var params = [ 	'api_key=' + apiKeyInput.val(),
						'from_date=' + fromDateInput.val(),
						'to_date=' + toDateInput.val(),
						'expire=' + expire
					];
						
		var valid = true;
		for( var index in params ){
			var paramVal = params[index].split('=');
			var parent = $('#' + paramVal[0]).parent();
			parent.removeClass('has-error');
			if( paramVal[1] == 'null' || paramVal[1].length==0 ){
				valid = false;
				parent.addClass('has-error');
			}
		}
		
		if(!valid)
		return;
		
		var secret = $('#api_secret');
		if( secret.val().length == 0){
			secret.addClass('has-error');
		}	
		
		
		if( whereInput.val().length>0){
			params.push('where=' + whereInput.val());
		}
		
		if( eventInput.val().length>0){
			try{
				var jsonObj = JSON.parse('[' + eventInput.val() + ']');
				var stringRep = JSON.stringify(jsonObj);
				params.push('event=' + stringRep);
			}catch(e){
				eventInput.parent().addClass('has-error');
			}
		}
		
		if( bucketInput.val().length>0){
			params.push('bucket=' + bucketInput.val());
		}
		
	
		//sort them
		params.sort();
		
		//concat them
		var concat = '';
		for( var index in params ){
			concat += params[index];
		}
		
		var sig_key = CryptoJS.MD5(concat + secret.val()).toString(CryptoJS.enc.Hex);
		
		var url = 'https://data.mixpanel.com/api/2.0/export?';
		var sep = "&"
		for(var index in params){
			
			if(index==0)
			url+= params[index];
			else
			url+= '&' + params[index];
		
		}
		
		url+='&sig=' + sig_key;
		
		resultHref.attr('href',url);
		resultHref.html(url);
		
	
	});
	




});

	


