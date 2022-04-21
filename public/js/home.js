$('.ss_article').on('click', function() {

    console.log(this);

   
    //ajax
});


$('#content_holder').on('click','#content_img_holder', function() {

    const id = $(this).parent().attr('data-id');

    window.location.href = '/content/' + id;
    

    // $.ajax({
    //     type:'GET',
    //     url: '/getContent' + id,
    //     success: function(res) {
    //         console.log(res);
    //     }


    // });

});