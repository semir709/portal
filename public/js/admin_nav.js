

$('.ss_list').click(function() {

    if($(this).find('label').text() == 'Dashboard') {
        location.reload();
    }
    else {

        $('li').css('background-color', '#21292F');
        $('label').css('color', '#B0A9A9');
        $('i').css('color', '#B0A9A9');

        $(this).css('background-color', '#008cff');
        $(this).find('label').css('color', '#ffffff');
        $(this).find('i').css('color', '#ffffff');

    }


});

