
//navigation

$('.ss_label').on('click', function() {
    const main_display = $('#main_display');

    switch(this.innerHTML) {
        case 'Home':

            $.ajax({
                type:'GET',
                url:"/admin/admin_home",
                success: function(data) {
                    
                    main_display.html(data);
                    
                }
            });

        break;

        case 'All content':

            $.ajax({
                type:'GET',
                url:"/admin/all_content",
                success: function(data) {
                    
                    main_display.html(data);
                    
                }
            });

        break;

        case 'Add new':

            $.ajax({
                type:'GET',
                url:"/admin/add_new",
                success: function(data) {
                  
                    main_display.html(data);

                    //trumbowyg
                    $('#txt_area').trumbowyg({
                        autogrow: true,
                        btnsDef: {
                            // Create a new dropdown
                            image: {
                                dropdown: ['insertImage', 'upload'],
                                ico: 'insertImage'
                            }
                        },
                        // Redefine the button pane
                        btns: [
                            ['viewHTML'],
                            ['formatting'],
                            ['strong', 'em', 'del'],
                            ['superscript', 'subscript'],
                            ['link'],
                            ['image'], // Our fresh created dropdown
                            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                            ['unorderedList', 'orderedList'],
                            ['horizontalRule'],
                            ['removeformat'],
                            ['fullscreen']
                        ],
                        plugins: {
                            // Add imagur parameters to upload plugin for demo purposes
                            upload: {
                                serverPath: '/admin/image_upload',
                                fileFieldName: 'image',
                            }
                        }
                    });
                    
                }
            });

        break;

        case 'Category':

            $.ajax({
                type:'GET',
                url:"/admin/category",
                success: function(data) {
                    
                    main_display.html(data);
                    
                }
            });

        break;

        case 'Inbox':

            $.ajax({
                type:'GET',
                url:"/admin/inbox",
                success: function(data) {
                    
                    main_display.html(data);
                    
                }
            });

        break;

        case 'Media':

            $.ajax({
                type:'GET',
                url:"/admin/media",
                success: function(data) {
                    
                    main_display.html(data);
                    
                }
            });

        break;

        case 'User':

            $.ajax({
                type:'GET',
                url:"/admin/user",
                success: function(data) {
                    
                    main_display.html(data);
                    
                }
            });

        break;

        case 'New user':

            $.ajax({
                type:'GET',
                url:"/admin/new_user",
                success: function(data) {
                    
                    main_display.html(data);
                    
                }
            });

        break;

        case 'Settings':

            $.ajax({
                type:'GET',
                url:"/admin/settings",
                success: function(data) {
                    
                    main_display.html(data);
                    
                }
            });

        break;

    }
});





function myFunction() {

    let nav = document.getElementById("nav");
    let label = document.getElementsByClassName("ss_label")
    let button_nav = document.getElementById("btn_nav");
    let arrow = document.getElementById("arrow"); 

    nav.classList.toggle("switch_nav");

    button_nav.classList.toggle("btn_moment");

    arrow.classList.toggle('arrow_rotate');

    for(let i = 0; i < label.length; i++) {
        label[i].classList.toggle("label_switch");
    }

}

$(".ss_list ").on('click',function() {

    $('.ss_label').removeClass("clicked_list");
    $('.ss_icon_nav').removeClass("clicked_list");

    
    this.querySelector('label').classList.toggle("clicked_list");
    this.querySelector('i').classList.toggle("clicked_list");
});



// all contents

$('#main_display').on('click', '.ss_nav_a', function(){

    $(".ss_nav_a ").css("border-bottom", "none");

    $(this).css("border-bottom", "2px solid #000000");

    const all_conetnt_holder = $('#all_content');
    const data = this.innerHTML;

    let catg;

    if(data == $('.ss_nav_a')[0].innerHTML) {
        catg = '1'
    }

    if(data == $('.ss_nav_a')[1].innerHTML) {
        catg = '2'
    }

    if(data == $('.ss_nav_a')[2].innerHTML) {
        catg = '3'
    }

    if(data == $('.ss_nav_a')[3].innerHTML) {
        catg = '4'
    }

    $.ajax({
        type: 'GET',
        url: '/admin/all_content_data' + catg,
        success: function(res) {
            all_conetnt_holder.html(res);
        }
    });

});

$("#main_display").on('click','#label_search',function() {
    let input_search = document.getElementById('search_input');

    input_search.classList.toggle("ss_input_streach");
});

$("#main_display").on("click", "#edit_category_list" ,function() {
    const main_display = $('#main_display');

    const id = $(this).parents()[5].getAttribute('data-id');
    
    $.ajax({
        type: 'GET',
        url: '/admin/all_content_data/getArticle' + id,
        success: function(res) {
            main_display.html(res);
        }
    });

});


//all users

$(".ss_list_all_users li").click(function() {

    $(".ss_list_all_users li ").css("border-bottom", "none");

    
    
    $(this).css("border-bottom", "1px solid black")
});


$(".ss_button_drop_down").click(function() {
    let list = document.getElementsByClassName("ss_list_all_users")[0];

    list.classList.toggle("drop_down_list");
   
});


//add content

$('#btn_right_block').on('click', function() {
    let right_block = document.getElementsByClassName('ss_right_block')[0];

    right_block.classList.toggle("ss_show_block");
});

function tag_category() {

    let input_text = $('.ss_input_tag').val();

    if(input_text !== '') {

        let div = $('<div> </div>');
        let span = $('<span> </span>');

        div.addClass('tag_category');

        span.text(input_text);

        div.append(span);
        
        $('.ss_tags_container').append(div);

    }

    $('.ss_input_tag').val('');

}

$('#main_display').on('click','#btn_tag', function() {
    tag_category();
});


$(document).on('keypress', function(e) {  

    if(e.code === 'Enter' || e.code === 'Space') {
        tag_category();
    }
});

/* Edit modal */

$('#main_display').on('click', '#category_edit', function() {

    $('#editModal').attr('data-id', this.getAttribute('data-id'));

});

/* Edit user*/

$('#main_display').on('click', '#button_edit_user', function() {

    let card = $(this).parents()[1];

    let name = $(card).find('.user_name').text();
    let role = $(card).find('.user_role').text();
    let email = $(card).find('.user_email').text();
    let num = $(card).find('.user_num').text();

    $('#input_user_name').val(name);
    $('#input_user_email').val(email);
    $('#input_user_num').val(num);
    $('#input_user_role').val(role);

    $('#input_user_facebook').val(this.getAttribute('data-facebook'));
    $('#input_user_twitter').val(this.getAttribute('data-twitter'));
    $('#input_user_instagram').val(this.getAttribute('data-instagram'));
    
});

/*View User*/


$('#main_display').on('click', '#view_user', function() {

    const main_display = $('#main_display');

    const id = this.getAttribute('data-id');

    $.ajax({
        type: 'GET',
        url: '/admin/view_user' + id,
        success: function(res) {

            main_display.html(res);

        }
    });
    
});