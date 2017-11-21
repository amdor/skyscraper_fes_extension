// ==UserScript==
// @name         Auto Comparator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autó kiértékelő eszköz
// @author       lordmairtis
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://www.hasznaltauto.hu/talalatilista/auto/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let getValueButtonClicked = (event) => {
        const carRef = $(event.target).parentsUntil('.talalati_lista').prev().find('h2>a')[0].href;
        const data = { "carUrls": [carRef] };
        const value = $.ajax({
                url: 'https://localhost:5000',
                method: 'POST',
                contentType: "application/json;",
                data: JSON.stringify(data)
        }).done(function( data ) {
          console.log(JSON.stringify(data));
        });
    };
    const GET_VALUE_BUTTON = $(`<i class="fa fa-magic fa-2x" style="float: right; margin-left: 18px;
                            background-color: orange; border-radius: 18px; border: 7px;
                            border-color: orange;border-style: solid;" aria-hidden="true"></i>`).click(getValueButtonClicked);
    $('head').append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">');
    $(() => {
        $('.talalati_lista_ceglogo').remove();
        $('.talalati_lista_parkolo_cont').before(GET_VALUE_BUTTON);
    });
})();


