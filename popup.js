// Copyright (c) 2018 Zsolt Deák. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be
// found in the LICENSE file.


/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
	// Query filter to be passed to chrome.tabs.query - see
	// https://developer.chrome.com/extensions/tabs#method-query
	var queryInfo = {
		active: true,
		currentWindow: true
	};

	chrome.tabs.query(queryInfo, (tabs) => {
		// chrome.tabs.query invokes the callback with a list of tabs that match the
		// query. When the popup is opened, there is certainly a window and at least
		// one tab, so we can safely assume that |tabs| is a non-empty array.
		// A window can only have one active tab at a time, so the array consists of
		// exactly one tab.
		var tab = tabs[0];

	// A tab is a plain object that provides information about the tab.
	// See https://developer.chrome.com/extensions/tabs#type-Tab
	var url = tab.url;

	// tab.url is only available if the "activeTab" permission is declared.
	// If you want to see the URL of other tabs (e.g. after removing active:true
	// from |queryInfo|), then the "tabs" permission is required to see their
	// "url" properties.
	console.assert(typeof url == 'string', 'tab.url should be a string');

		callback(url);
	});

	// Most methods of the Chrome extension APIs are asynchronous. This means that
	// you CANNOT do something like this:
	//
	// var url;
	// chrome.tabs.query(queryInfo, (tabs) => {
	//   url = tabs[0].url;
	// });
	// alert(url); // Shows "undefined", because chrome.tabs.query is async.
}


function showSavedCarLinks() {
	chrome.storage.sync.get(null, (cars) => {
		if(chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		}
		addUrlsToList(Object.keys(cars) || [])
	});
}


function saveCarLink(url, callback) {
	chrome.storage.sync.get(null, (cars) => {
		if(chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			callback(false);
		}
		const urls = Object.keys(cars);
		if(urls.length < 10 && !urls.includes(url)) {
			cars[url] = '';
			chrome.storage.sync.set(cars);
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
			chrome.storage.sync.remove(url);
		})
	}
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {
	var addCarButton = $('#addCar');
	addCarButton.click(() => {
		getCurrentTabUrl((url) => {
			saveCarLink(url, (success) => {
				if(success) {
					addUrlsToList([url])
				}
			});
		});
	});

	showSavedCarLinks();
});
