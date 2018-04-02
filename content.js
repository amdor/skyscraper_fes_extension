
function setCars(cars) {
	localStorage.setItem('htmls', JSON.stringify(cars))
}


chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	switch (request.action) {
		case 'getSource':
			callback(document.getElementsByTagName('html')[0].innerHTML);
			break;
		case 'setCars':
			setCars(request.cars);
			// false closes the async callback channel
			return false;
	}
});
