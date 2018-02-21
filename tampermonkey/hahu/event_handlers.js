
//EVENT HANDLERS
function getValueButtonClicked(event) {
		lastClickedGetValueButton = event.target;
		const carRef = getUrlForButton(lastClickedGetValueButton);
		$.ajax({
			url: carRef,
			success: (htmlContent) => {
				const data = { "carUrls": [carRef], 'html': htmlContent };
				$.ajax({
						url: 'https://localhost:5000',
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
		//switch color and background color
		const backgroundColor = $(event.target).css('background-color');
		const color = $(event.target).css('color');
		$(event.target).css('background-color', color);
		$(event.target).css('color', backgroundColor);

		refreshUrlList(carRef);
		sessionStorage.setItem('carUrls', JSON.stringify(urlList));
}

function saveCarRefs (event) {
		GM_setValue('carUrls', JSON.stringify(urlList));
}

//BIND EVENTS
GET_VALUE_BUTTON.click(getValueButtonClicked);
ADD_FOR_COMPARE_BUTTON.click(addForCompareClicked);
COMPARE_BUTTON.click(saveCarRefs);
