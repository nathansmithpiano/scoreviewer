//Prevents right-clicking
$(function() {
    $(this).bind("contextmenu", function(e) {
        e.preventDefault();
    });
}); 
    
//prevents dragging images
$(document).ready(function () {
    $('body').on('dragstart', function () {
        return false;
    });
});