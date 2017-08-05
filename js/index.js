var nbDrop = 858; 

$(function () {
    $('.about-container').hide();
    createRain();
});

function about () {
    $('.main-menu').fadeOut(function () {
        $('.about-container').fadeIn();
    });
}

function start () {
    $('.about-container').fadeOut(function() {
        $('.main-menu').fadeIn();
    });
}

function randRange( minNum, maxNum) {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

function createRain() {

    for(var i=1;i<nbDrop;i++) {
        var dropLeft = randRange(0,1600);
        var dropTop = randRange(-1000,1400);

        $('#overlay').append('<div class="drop" id="drop'+i+'"></div>');
        $('#drop'+i).css('left',dropLeft);
        $('#drop'+i).css('top',dropTop);
	}

}