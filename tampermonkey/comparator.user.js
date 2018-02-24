// ==UserScript==
// @name         Auto Comparator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autó kiértékelő eszköz
// @author       lordmairtis
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://www.hasznaltauto.hu/talalatilista/auto/*
// @match        https://new.hasznaltauto.hu/talalatilista/auto/*
// @match        localhost:4200
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';
    let lastClickedGetValueButton;

    ///////////
    ///READY///
    ///////////
    $(() => {
        if(document.URL.match(/https:\/\/(www|new){1}.hasznaltauto.hu\/talalatilista\/auto.*/g)) {
            GM_setValue('htmls', '');
            sessionStorage.setItem('htmls', '[]');
            const buttons = $('<div></div>').append(GET_VALUE_BUTTON).append(ADD_FOR_COMPARE_BUTTON);
            $('.talalati_lista_vetelar').after(buttons);
            $('.tabmenu').children().last().after(COMPARE_BUTTON);
        } else {
            const htmls = GM_getValue('htmls', '[]');
            if(htmls != false) {
                localStorage.setItem('htmls', htmls);
            }
        }
    });
////START HTML_TEMPLATES.JS
const SPINNER = `<i class="fa fa-spinner fa-spin fa-2x fa-fw" style="float: right; margin-top: 15px;"></i>`;
const GET_VALUE_BUTTON = $(`<div style="float: right; margin-top: 8px;">
                                <i class="fa fa-magic fa-2x" style="background-color: orange;
                                border-radius: 18px; border: 7px; border-color: orange; border-style: solid; cursor: pointer;" aria-hidden="true">
                                </i>
                            </div>`);
const COMPARE_BUTTON = $(`<li class="inaktiv">
                            <a rel="nofollow" target="_blank"
                                href="http://localhost:4200"
                                id="compareButton">
                                <strong>Összehasonlítás(<span class="compare-number">0</span>)</strong>
                            </a>
                        </li>`);
const ADD_FOR_COMPARE_BUTTON = $(`<input type="button" style="float: right; margin-top: 15px; margin-right: 5px;
                                    background-color: #f0f0f0;
                                    border: 1px solid #e6e6e6;
                                    padding: 3px 10px;
                                    font-size: 12px;
                                    color: #0464a4;
                                    cursor: pointer;" value="Összehasonlít">`);
////START EVENT_HANDLERS.JS
//EVENT HANDLERS' UTILS
function refreshHtmls(htmlDictItem) {
	let htmls = JSON.parse(sessionStorage.getItem('htmls'));
	const index = htmls.findIndex(element => Object.keys(element)[0] === Object.keys(htmlDictItem)[0]);
	if(index === -1){
	  	htmls.push(htmlDictItem);
	} else {
	  	htmls.splice(index, index + 1);
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
////START GLOBAL_DOM_MANIPULATION.JS
//add bootstrap to head
$('head').append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">');

//////////////////////////////
//DOM manipulation utilities//
//////////////////////////////

//Replaces the element with new element. Uses the previousElementSibling attribute, so element must have it
function replaceElement(element, newElement) {
    if(!element) {
        console.error("Invalid replacement called in comparator addon!");
        return;
    }
    $(element).replaceWith(newElement);
}

function getUrlForButton(button) {
    return $(button).parentsUntil('.talalati_lista').prev().find('h2>a')[0].href;
}

function refreshToCompareCounter(count) {
      $('.compare-number').html(count);
}

function toggleAddToCompareColor() {
  //switch color and background color
  const backgroundColor = $(event.target).css('background-color');
  const color = $(event.target).css('color');
  $(event.target).css('background-color', color);
  $(event.target).css('color', backgroundColor);
}

})();
