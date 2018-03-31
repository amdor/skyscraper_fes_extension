// Copyright (c) 2018 Zsolt Deák. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be
// found in the LICENSE file.


var currentTab = {};
const SKYSCRAPER_URLS = ['http://localhost:4200/', 'https://autocomparator.herokuapp.com/'];


function getCurrentTabUrl(callback) {
	var queryInfo = {
		active: true,
		currentWindow: true
	};

	chrome.tabs.query(queryInfo, (tabs) => {
		var tab = tabs[0];

		currentTab = tab;

		var url = tab.url;

		console.assert(typeof url == 'string', 'tab.url should be a string');
		callback(url);
	});
}


function showSavedCarLinks() {
	chrome.storage.local.get(null, (cars) => {
		if(chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		}
		addUrlsToList(Object.keys(cars) || [])
	});
}


function saveCar(url, html, callback) {
	chrome.storage.local.get(null, (cars) => {
		if(chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			callback(false);
		}
		const urls = Object.keys(cars);
		if(urls.length < 10 && !urls.includes(url)) {
			cars[url] = html;
			chrome.storage.local.set(cars);
			callback(true);
		}
		callback(false);
	});
}

function addUrlsToList(urls) {
	for(url of urls) {
		const listItem = $('<li><i class="fa fa-minus fa-3x"></i> ' + url + '</li>');
		$('#urlList').append(listItem);
		listItem.click(() => {
			listItem.remove();
			chrome.storage.local.remove(url);
		})
	}
}


///////////
// MAIN////
///////////
document.addEventListener('DOMContentLoaded', () => {
	var addCarButton = $('#addCar');
	addCarButton.click(() => {
		getCurrentTabUrl((url) => {
			if(SKYSCRAPER_URLS.includes(url)) {
				chrome.storage.local.get(null, (cars) => {
					chrome.tabs.sendRequest(currentTab.id, {action: 'setCars', cars: cars}, (source) => {

					});
				});
			} else {
				chrome.tabs.sendRequest(currentTab.id, {action: "getSource"}, (source) => {
					saveCar(url, source, (success) => {
						if(success) {
							addUrlsToList([url])
						}
					});
				});
			}
		});
	});

	showSavedCarLinks();

	getCurrentTabUrl((url) => {
		if(SKYSCRAPER_URLS.includes(url)) {
			addCarButton.css('color', 'green');
		} else {
			addCarButton.css('color', '');
		}
	});
});
