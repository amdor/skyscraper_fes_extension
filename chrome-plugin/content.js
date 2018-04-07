
function setCars(cars) {
	const carsString = JSON.stringify(cars);
	localStorage.setItem('htmls', carsString);
    window.dispatchEvent( new StorageEvent('storage', {key: 'htmls', newValue: carsString, url: window.location}) );
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
