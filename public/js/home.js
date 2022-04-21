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

