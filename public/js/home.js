$('.ss_article').on('click', function() {

    console.log(this);

   
    //ajax
});

//navigation home
$('#other_button').on('click', function() {

    $('.ss_block_others').toggle('.ss_show_other');

});

//closing other content list on any diffrent click

$(document).mouseup(function(e) 
{
    let container = $(".ss_block_others ");
    let other_button_a = $('#other_button').children()[1];
    let other_button_i = $('#other_button').children()[0];

    if ((!container.is(e.target) && container.has(e.target).length === 0)
        &&(!$(other_button_a).is(e.target) && $(other_button_a).has(e.target).length === 0)
        &&(!$(other_button_i).is(e.target) && $(other_button_i).has(e.target).length === 0)) 
    {

        if(container.css('display') == 'block'){
            container.toggle('ss_show_other');
        } 
    }
});


//click on the main content
$('.ss_main_content_click').on('click', function() {

    const id = $(this).attr('data-id');
    window.location.href = '/content/' + id;

});


//click on the content
$('.content_holder').on('click', '.ss_content_holder', function() {

    const id = $(this).attr('data-id');
    window.location.href = '/content/' + id;

});


//click lists 
$('.list_categroy_all').on('click', function() {

    $('.list_categroy_all').css('color', '#fff');
    $(this).css('color', '#d69c14');

    const name = $(this).text();

    window.location.href = '/category/' + name;

});


