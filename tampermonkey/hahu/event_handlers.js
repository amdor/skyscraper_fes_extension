//EVENT HANDLERS' UTILS
function refreshHtmls(htmlDictItem) {
	let htmls = JSON.parse(sessionStorage.getItem('htmls'));
	const newKey = Object.keys(htmlDictItem)[0];
	if(!Object.keys(htmls).includes(newKey)){
		htmls[newKey] = htmlDictItem[newKey];
	} else {
		delete htmls[newKey];
	}
	sessionStorage.setItem('htmls', JSON.stringify(htmls));
	return htmls.length;
}


//EVENT HANDLERS
function getValueButtonClicked(event) {
		lastClickedGetValueButton = event.target;
		const carRef = getUrlForButton(lastClickedGetValueButton);
		$.ajax({
			url: carRef,
			success: (htmlContent) => {
				const htmlMap = {};
				htmlMap[carRef] = htmlContent;
				const data = { "carUrls": [carRef], 'htmls': htmlMap };
				$.ajax({
						url: 'https://skyscraper-bes.herokuapp.com',
						method: 'POST',
						contentType: "application/json;",
						data: JSON.stringify(data),
						timeout: 3000,
						success: ( response ) => {
							if(lastClickedGetValueButton && response && response[0].worth) {
								const worthElement = "<div style='float: right; margin-top: 15px; font-weight: bold;'>ÉRTÉK: " + response[0].worth + "</div>";
								replaceElement('.fa-spinner', worthElement);
							}
						},
						error: (jqXHR, textStatus) => {
							console.error(jqXHR.status + textStatus);
							replaceElement('.fa-spinner', GET_VALUE_BUTTON);
						}
				});
			}
		});

		replaceElement(lastClickedGetValueButton, SPINNER);
}

function addForCompareClicked(event) {
		const carRef = getUrlForButton(event.target);
		$.ajax({
			url: carRef,
			success: (htmlContent) => {
				const htmlMap = {};
				htmlMap[carRef] = htmlContent;
				const count = refreshHtmls(htmlMap);
				refreshToCompareCounter(count);
			},
			error: () => {
				toggleAddToCompareColor();
			}
		});
		toggleAddToCompareColor();
}

function saveCarRefs (event) {
		GM_setValue('htmls', sessionStorage.getItem('htmls'));
}

//BIND EVENTS
GET_VALUE_BUTTON.click(getValueButtonClicked);
ADD_FOR_COMPARE_BUTTON.click(addForCompareClicked);
COMPARE_BUTTON.click(saveCarRefs);
