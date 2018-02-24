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
