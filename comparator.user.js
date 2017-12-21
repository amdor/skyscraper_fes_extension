// ==UserScript==
// @name         Auto Comparator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autó kiértékelő eszköz
// @author       lordmairtis
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://www.hasznaltauto.hu/talalatilista/auto/*
// @match        https://new.hasznaltauto.hu/talalatilista/auto/*
// @match        localhost:3000
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';
    let urlList = [];
    const SPINNER = `<i class="fa fa-spinner fa-spin fa-2x fa-fw" style="float: right; margin-top: 15px;"></i>`;
    const GET_VALUE_BUTTON = $(`<div style="float: right; margin-top: 8px;">
                                    <i class="fa fa-magic fa-2x" style="background-color: orange;
                                    border-radius: 18px; border: 7px; border-color: orange; border-style: solid; cursor: pointer;" aria-hidden="true">
                                    </i>
                                </div>`);
    const COMPARE_BUTTON = $(`<li class="inaktiv">
                                <a rel="nofollow" target="_blank"
                                    href="http://localhost:3000"
                                    id="compareButton">
                                    <strong>Összehasonlítás(<span class="compare-number">0</span>)</strong>
                                </a>
                            </li>`);
    const ADD_FOR_COMPARE_BUTTON = $(`<input type="button" style="float: right; margin-top: 15px; margin-right: 5px; background-color: #f0f0f0;
                                        border: 1px solid #e6e6e6;
                                        padding: 3px 10px;
                                        font-size: 12px;
                                        color: #0464a4;
                                        cursor: pointer;" value="Összehasonlít">`);

    let lastClickedGetValueButton;

    //EVENT HANDLERS
    let getValueButtonClicked = (event) => {
        lastClickedGetValueButton = event.target;
        const carRef = getUrlForButton(lastClickedGetValueButton);
        const data = { "carUrls": [carRef] };
        const value = $.ajax({
                url: 'https://localhost:5000',
                method: 'POST',
                contentType: "application/json;",
                data: JSON.stringify(data)
        }).done(function( response ) {
          if(lastClickedGetValueButton && response && response[0].worth) {
            const worthElement = "<div style='float: right; margin-top: 15px; font-weight: bold;'>ÉRTÉK: " + response[0].worth + "</div>";
            replaceElement($('.fa-spinner')[0], worthElement);
          }
        });
        replaceElement(lastClickedGetValueButton, SPINNER);
    };

    let addForCompareClicked = (event) => {
        const carRef = $(event.target).parentsUntil('.talalati_lista').prev().find('h2>a')[0].href;
        refreshUrlList(carRef);
    };
    
    let saveCarRefs = (event) => {
        GM_setValue('carUrls', urlList);
    };

    //BIND EVENTS
    GET_VALUE_BUTTON.click(getValueButtonClicked);
    ADD_FOR_COMPARE_BUTTON.click(addForCompareClicked);
    COMPARE_BUTTON.click(saveCarRefs);

    //add bootstrap to head
    $('head').append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">');

    ///////////
    ///READY///
    ///////////
    $(() => {
        if(document.URL.match(/https:\/\/(www|new){1}.hasznaltauto.hu\/talalatilista\/auto.*/g)) {
            const buttons = $('<div></div>').append(GET_VALUE_BUTTON).append(ADD_FOR_COMPARE_BUTTON);
            $('.talalati_lista_vetelar').after(buttons);
            $('.tabmenu').children().last().after(COMPARE_BUTTON);
        } else {
            urlList = GM_getValue('carUrls', []);
        }
    });

    //////////////////////////////
    //DOM manipulation utilities//
    //////////////////////////////

    //Replaces the element with new element. Uses the previousElementSibling attribute, so element must have it
    function replaceElement(element, newElement) {
        if(!element.previousElementSibling) {
            console.error("Invalid replacement called in comparator addon!");
            return;
        }
        $(element.previousElementSibling).after(newElement);
        $(element).remove();
    }

    function refreshUrlList(ref) {
        if(!urlList.includes(ref)) {
            urlList.push(ref);   
        } else {
            const index = urlList.indexOf(ref);
            urlList.splice(index, index + 1);
        }
        $('.compare-number').html(urlList.length);
    }

    function getUrlForButton(button) {
        return $(button).parentsUntil('.talalati_lista').prev().find('h2>a')[0].href;
    }
})();


