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
