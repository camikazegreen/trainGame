function initializeBuildStations(map){

    function hasClass(el, className) {
        if (el.classList)
            return el.classList.contains(className)
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }
    function addClass(el, className) {
      if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
    }

    function removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className)
        else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className=el.className.replace(reg, ' ')
        }
    }
	$(document).ready(function() {
        var el = document.createElement('div');
    $('input[type=radio][name=station-chooser]').change(function() {
         
        if (this.value == 'depot') {
            console.log("Making a depot");
            if (hasClass(el,"station")){
                removeClass(el,"station");
            }
            if (hasClass(el,"terminal")){
                removeClass(el,"terminal");
            }
            addClass(el,"depot");
        }
        else if (this.value == 'station') {
            console.log("Making a station")
            if (hasClass(el,"depot")){
                removeClass(el,"depot");
            }
            if (hasClass(el,"terminal")){
                removeClass(el,"terminal");
            }
            addClass(el,"station");
        }
        else if (this.value == 'terminal'){
        	console.log("Making a terminal")
            if (hasClass(el,"station")){
                removeClass(el,"station");
            }
            if (hasClass(el,"depot")){
                removeClass(el,"depot");
            }
            addClass(el,"terminal");
        }
        new mapboxgl.Marker(el)
        .setLngLat(map.currentSquare.center)
        .addTo(map);
    });
    $('input[type=radio][name=range-chooser]').change(function(){
        if (this.value == '1'){
            console.log(1);
        }
        else if (this.value == '2'){
            console.log(2);
        }
        else if (this.value == '3'){
            console.log(3);
        }
    });
    $('input[type=radio][name=sidings-chooser]').change(function(){
        if (this.value == '2'){
            if (hasClass(el,"four")){
                removeClass(el,"four");
            }
            if (hasClass(el,"six")){
                removeClass(el,"six");
            }
            addClass(el,"two");
        }
        else if (this.value == '4'){
            if (hasClass(el,"two")){
                removeClass(el,"two");
            }
            if (hasClass(el,"six")){
                removeClass(el,"six");
            }
            addClass(el,"four");
        }
        else if (this.value == '6'){
            if (hasClass(el,"two")){
                removeClass(el,"two");
            }
            if (hasClass(el,"four")){
                removeClass(el,"four");
            }
            addClass(el,"six");
        }
        console.log(el.classList)
    });
});
}