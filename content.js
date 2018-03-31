
function setUrls(cars) {

}


chrome.extension.onRequest.addListener(function(request, sender, callback) {
	switch (request.action) {
		case 'getSource':
			callback(document.getElementsByTagName('html')[0].innerHTML);
			break;
		case 'setCars':
			setUrls(request.cars);
			break;
	}
});
