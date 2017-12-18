// ==UserScript==
// @name         Auto Comparator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autó kiértékelő eszköz
// @author       lordmairtis
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://www.hasznaltauto.hu/talalatilista/auto/*
// @match        https://new.hasznaltauto.hu/talalatilista/auto/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const SPINNER = `<i class="fa fa-spinner fa-spin fa-2x fa-fw" style="float: right; margin-top: 15px;"></i>`;
    const GET_VALUE_BUTTON = $(`<i class="fa fa-magic fa-2x" style="float: right; margin-top: 15px;
                            background-color: orange; border-radius: 18px; border: 7px;
                            border-color: orange; border-style: solid; cursor: pointer;" aria-hidden="true"></i>`);
    const COMPARE_BUTTON = `<li class="inaktiv">
                                <a rel="nofollow" target="_blank" href="http://localhost:3000"><strong>Összehasonlítás</strong></a>
                            </li>`

    let lastClickedButton;

    let getValueButtonClicked = (event) => {
        lastClickedButton = event.target;
        const carRef = $(lastClickedButton).parentsUntil('.talalati_lista').prev().find('h2>a')[0].href;
        const data = { "carUrls": [carRef] };
        const value = $.ajax({
                url: 'https://localhost:5000',
                method: 'POST',
                contentType: "application/json;",
                data: JSON.stringify(data)
        }).done(function( response ) {
          if(lastClickedButton && response && response[0].worth) {
            const worthElement = "<div style='float: right; margin-top: 15px; font-weight: bold;'>ÉRTÉK: " + response[0].worth + "</div>";
            replaceElement($('.fa-spinner')[0], worthElement);
          }
        });
        replaceElement(lastClickedButton, SPINNER);
    };

    GET_VALUE_BUTTON.click(getValueButtonClicked);

    //add bootstrap to head
    $('head').append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">');

    //ready
    $(() => {
        if(document.URL.match(/https:\/\/(www|new){1}.hasznaltauto.hu\/talalatilista\/auto.*/g)) {
            $('.talalati_lista_vetelar').after(GET_VALUE_BUTTON);
            $('.tabmenu').children().last().after(COMPARE_BUTTON);
        }        
    });

    //DOM manipulation utilities

    //Replaces the element with new element. Uses the previousElementSibling attribute, so element must have it
    function replaceElement(element, newElement) {
        if(!element.previousElementSibling) {
            console.error("Invalid replacement called in comparator addon!");
            return;
        }
        $(element.previousElementSibling).after(newElement);
        $(element).remove();
    }
})();


