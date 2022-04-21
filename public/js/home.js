$('.ss_article').on('click', function() {

    console.log(this);

   
    //ajax
});


$('#content_holder').on('click','#content_img_holder', function() {

    console.log('asdads');

    const id = $(this).parent().attr('data-id');

    window.location.href = '/content/' + id;
    

});