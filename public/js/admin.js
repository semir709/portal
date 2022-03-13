
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

        case 'Log out':

            $.ajax({
                type:'POST',
                url:"/admin/logout",
                success: function(data) {

                    window.location = data;   
                    
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

$('#main_display').on('click','#post_content_btn', function() {

    let input_title = $('#input_title').val();
    let txt_area = $('#txt_area').val();
    let inputGroup_publish = $('#inputGroup_publish option:selected').text();
    let inputGroup_post = $('#inputGroup_post option:selected').text()
    let inputGroup_category = $('#inputGroup_category');
    let img_content = $('#img_content').attr('src');

    let category_ch = [];

    for(let i = 0; i < inputGroup_category.children().length; i++) { 
        category_ch[i] = $(inputGroup_category.children()[i]).children().text();
    }

    const data = {

        input_title: input_title,
        txt_area: txt_area,
        inputGroup_publish: inputGroup_publish,
        inputGroup_post: inputGroup_post,
        img_content: img_content,
        category_ch: category_ch
    }

    $.ajax({
        type: 'POST',
        url: '/admin/add_new/post',
        data: data,
        success: function(res) {
            console.log('success');
        }
    });
    
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

//singin

$('#main_text_area').trumbowyg();


$('#btn_send').on('click', function() {

    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);

    const name = $('#singin_name').text();
    const img = $('#img_singin').attr('src');
    const email = $('#email_singin').val();
    const num = $('#num_singin').val();
    const facebook = $('#facebook_singin').val();
    const instagram = $('#instagram_singin').val();
    const twitter = $('#twitter_singin').val();
    const password = $('#custom_password_singin').val();
    const txt_area = $('#main_text_area_singin').text();
    const role = $('#role').text();

    const id = urlParam.get('id');
    const url_name = urlParam.get('name');
    const url_role = urlParam.get('role');
    const url_mail = urlParam.get('email');

    let new_name_arr = url_name.split('_');
    let new_name = '';

    for(let i = 0; i < new_name_arr.length; i++) {
        new_name += new_name_arr[i];
        new_name += ' '; 
    }

    console.log('Send');


    const data = {
        name,
        img,
        email,
        num,
        facebook,
        instagram,
        twitter,
        password,
        txt_area,
        role,
        id,
        url_role,
        url_mail,
        new_name
    }

    $.ajax({
        type:'POST',
        url:'/singin/send_request',
        data:data,
        success: function(res) {

        }
    });

});

//Add user 

$('#main_display').on('click','#send_mail', function() {

    const name = $('#add_user_name').val();
    const email = $('#add_user_email').val();

    const super_admin = document.getElementById('super_admin_check');
    const admin = document.getElementById('admin_check');
    const editor = document.getElementById('editor_check');
    const author = document.getElementById('author_check');
    const contributor = document.getElementById('contributor_check');
    const supporter = document.getElementById('supporter_check');

    let checkbox = 0;

    /*
    super admin 1
    admin 2
    editor 3
    author 4
    contributor 5
    supporter 6

    */

    if(super_admin.checked) {
        checkbox = 1;
    }

    if(admin.checked) {
        checkbox = 2;
    }

    if(editor.checked) {
        checkbox = 3;
    }

    if(author.checked) {
        checkbox = 4;
    }

    if(contributor.checked) {
        checkbox = 5;
    }

    if(supporter.checked) {
        checkbox = 6;
    }

    const data = {
        name,
        email,
        checkbox
    }

    $.ajax({
        type: 'POST',
        url: '/admin/add_new_user',
        data: data,
        success: function(res) {

        }
    });



});