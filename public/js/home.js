$('.ss_article').on('click', function() {

    console.log(this);

   
    //ajax
});


$('.content_holder').on('click','#content_img_holder', function() {

    const id = $(this).parent().attr('data-id');
    window.location.href = '/content/' + id;
    

});

$('.content_holder').on('click','#content_info_holder', function() {

    const id = $(this).parent().attr('data-id');
    window.location.href = '/content/' + id;
    

});


$('.content_holder').on('click','#side_content_img_holder', function() {

    const id = $(this).parent().attr('data-id');
    window.location.href = '/content/' + id;
    

});


$('.content_holder').on('click','#side_content_info_holder', function() {

    const id = $(this).parent().attr('data-id');
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


