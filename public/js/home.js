$('.ss_article').on('click', function() {

    console.log(this);

   
    //ajax
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


//navigation home
$('#other_button').on('click', function() {

    $('.ss_block_others').toggle('.ss_show_oher');

});

//click lists 
$('.list_categroy_all').on('click', function() {

    $('.list_categroy_all').css('color', '#fff');
    $(this).css('color', '#d69c14');

    const name = $(this).text();

    window.location.href = '/category/' + name;

});


