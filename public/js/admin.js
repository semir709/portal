

const plugin = {
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
}

/*Custom function*/

function contentValues() {

    let input_title = $('#input_title').val();
    let txt_area = $('#txt_area').val();
    let inputGroup_publish = $('#inputGroup_publish option:selected').text();
    let inputGroup_post = $('#inputGroup_post option:selected').text()
    let inputGroup_category = $('#inputGroup_category');
    let img_content = $('#img_content').attr('src');
    let upload = document.getElementById('upload');
    let old_image = $('#img_content').attr('data-old');
    let content_id = $('#main_form').attr('data-id');

    let category_ch = [];

    for(let i = 0; i < inputGroup_category.children().length; i++) { 
        category_ch[i] = $(inputGroup_category.children()[i]).children().text();
    }

    const formData = new FormData();

    formData.append('input_title',input_title);
    formData.append('txt_area', txt_area);
    formData.append('inputGroup_publish', inputGroup_publish);
    formData.append('inputGroup_post', inputGroup_post);
    formData.append('img_content', img_content);
    formData.append('category_ch', category_ch);
    formData.append('file', upload.files[0]);
    formData.append('old_image', old_image);
    formData.append('id_content', content_id);

    return formData;

}

/*
    super admin 1
    admin 2
    editor 3
    author 4
    contributor 5
    supporter 6

    */

function convertRole (role) {
    if(role === 'super admin') {
        return 1;
    } 

    if(role === 'admin') {
        return 2;
    } 

    if(role === 'editor') {
        return 3;
    } 

    if(role === 'author') {
        return 4;
    } 

    if(role === 'contributor') {
        return 5;
    } 

    if(role === 'supporter') {
        return 6;
    } 
}

function previewFile2(file) {

    const image = $(file).parent().find('img');
    const f = $(file)[0].files[0];
    const reader = new FileReader();
  
    reader.onloadend = function () {
        image.attr('src', reader.result);
    
    }
  
    if (f) {
      reader.readAsDataURL(f);
    } else {
        image.attr('src', '');
    }

}

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
                    $('#txt_area').trumbowyg(plugin);
                    
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

$('#main_display').on('click', '.ss_list_stack', function(e) {

    e.stopPropagation();

    if ($('.ss_list_stack_list').hasClass("ss_show_lists")) {
        $(".ss_list_stack_list").removeClass("ss_show_lists");
    }
      
    else {
        $(".ss_list_stack_list").removeClass("ss_show_lists");
        $('.ss_list_stack_list').addClass("ss_show_lists");
    }

});

$('#main_display').on('click', '#set_trash', function(e) {

    e.stopPropagation();

    const id = $(this).closest('.ss_contents_holder ').attr('data-id');

    $.ajax({
        type:'GET',
        url:'/admin/content/trash' + id,
        success: function(res) {

            if(res.length > 0) {

                $('#main_display').html(res);

            }

            else {
                alert('somethin goes wrong');
            }
           
         }
    });


});

$('#main_display').on('click', '#set_draft', function(e) {
    
    e.stopPropagation();

    const id = $(this).closest('.ss_contents_holder ').attr('data-id');

    $.ajax({
        type:'GET',
        url:'/admin/content/draft' + id,
        success: function(res) {

            if(res.length > 0) {

                $('#main_display').html(res);

            }

            else {
                alert('somethin goes wrong');
            }
           
         }
    });


});

$('#main_display').on('click', '#set_schedule', function(e) {

    e.stopPropagation();

    const id = $(this).closest('.ss_contents_holder ').attr('data-id');

    $.ajax({
        type:'GET',
        url:'/admin/content/schedule' + id,
        success: function(res) {

            if(res.length > 0) {

                $('#main_display').html(res);

            }

            else {
                alert('somethin goes wrong');
            }
           
         }
    });


});

$('#main_display').on('click', '#set_public', function(e) {

    e.stopPropagation();

    const id = $(this).closest('.ss_contents_holder ').attr('data-id');

    $.ajax({
        type:'GET',
        url:'/admin/content/public' + id,
        success: function(res) {

            if(res.length > 0) {

                $('#main_display').html(res);

            }
            
            else {
                alert('somethin goes wrong');
            }
           
         }
    });


});


/* Is used in the add_content.ejs but it is part of all content*/
$('#main_display').on('click', '#update_content', function() {

    const formData = contentValues();

    $.ajax({
        type:'POST',
        url:'/admin/content/update',
        data: formData,
        processData: false,
        contentType: false,
        success: function(res) {
            if(res.length > 0) {

                $('#main_display').html(res);

            }

            else if(res == '1') {
                alert(' the image is missing');
            }
            else {
                alert('somethin goes wrong');
            }
         }
    });


});


//is used in more diffren pages

$('#main_display').on('click', ".ss_list_all li", function(){

    $(".ss_list_all li ").css("border-bottom", "none");
    
    $(this).css("border-bottom", "1px solid black");

});


//all users

$(".ss_button_drop_down").click(function() {
    let list = document.getElementsByClassName("ss_list_all_users")[0];

    list.classList.toggle("drop_down_list");
   
});

$('#main_display').on('click', '#not_confirmed_user', function() {

   $.ajax({
       type:'GET',
       url:'/admin/not_confirmed',
       success: function(res) {
           $('#row_users').html(res);
       }
   });

});

$('#main_display').on('click', '#trashed_user', function() {

    $.ajax({
        type:'GET',
        url:'/admin/trashed',
        success: function(res) {
            $('#row_users').html(res);
        }
    });

});

$('#main_display').on('click', '#confirmed_user', function() {

    $.ajax({
        type:'GET',
        url:'/admin/confirmed',
        success: function(res) {
            $('#row_users').html(res);
        }
    });

});

$('#main_display').on('input', '#input_search_users', function () {


    $.ajax({
        type:'GET',
        url:'/admin/user_search'+ $(this).val(),
        success: function(res) {
            $('#row_users').html(res);
        }

    });

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

    const formData = contentValues();

    $.ajax({
        type: 'POST',
        url: '/admin/add_new/post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(res) {

            
            if(res == 'IsEmpty') {
                alert('Something is empty');
            }

            else if(res == 'done'){

                $('#input_title').val('');
                $('.trumbowyg-editor').text('');
                $('#inputGroup_publish option:selected').text('');
                $('#inputGroup_post option:selected').text('')
                $('#inputGroup_category').val('');
                $('#img_content').attr('src', '');

                $('.ss_tags_container').empty();

            }
        }
    });
    
});

$('#main_display').on('click', '#img_content', function() {

    $('#upload').trigger('click');

});


/* Edit category */

$('#main_display').on('click', '#category_edit', function() {

    $('#editModal').attr('data-id', this.getAttribute('data-id'));

});

$('#main_display').on('click', '#update_category', function() {

    const input = $('#input_edit_category').val();
    const id = $('#editModal').attr('data-id');

    const data = {
        input,
        id
    }

    $.ajax({
        type:'POST',
        url:'/admin/category_update',
        data: data,
        success: function(res) {
            if(res.length > 0) {
                $('#editModal').modal('hide');
                $('#main_display').html(res);
            }
            else {
                alert('Can\'t update this category');
            }
        }
    });

});

$('#main_display').on('click', '#category_use', function() {
    
    $.ajax({
        type:'GET',
        url: '/admin/category_use',
        success: function(res) {
            $('#category_display').html(res);
        }
    });

});

$('#main_display').on('click', '#category_trashed', function() {

    $.ajax({
        type:'GET',
        url: '/admin/category_trashed',
        success: function(res) {
            $('#category_display').html(res);
        }
    });

});

$('#main_display').on('click', '#category_delete', function() {

    $('#deleteModal').attr('data-id', this.getAttribute('data-id'));

});

$('#main_display').on('click', '#category_trashe', function() {

    const data =  {
        id: $('#deleteModal').attr('data-id')
    }

    $.ajax({
        type:'POST',
        url:'/admin/category/edit_trashed',
        data: data,
        success: function(res) {
            if(res.length > 0) {
                $('#deleteModal').modal('hide');
                $('#category_display').html(res);
            }
            else {
                alert('Can\'t update this category');
            }
        }
    });

});

$('#main_display').on('click', '#category_recover', function() {

    const data =  {
        id: $('#category_recover').attr('data-id')
    }

    $.ajax({
        type:'POST',
        url:'/admin/category/category_recover',
        data: data,
        success: function(res) {
            if(res.length > 0) {
                $('#category_display').html(res);
            }
            else {
                alert('Can\'t update this category');
            }
        }
    });

});

$('#main_display').on('input', '#search_category', function() {

    const input = $(this).val();

    $.ajax({
        type:'GET',
        url:'/admin/category_input' + input,
        success: function(res) {

            $('#category_display').html(res);

        }
    });

});

/* Edit user*/

$('#main_display').on('click', '#button_edit_user', function() {

    const card = $(this).parents()[1];
    const id = $(card).attr('data-id');


    $.ajax({
        type: 'GET',
        url:'/edit_user?id='+ id,
        success: function(res) {

            const option = $('.ss_role_option');

            $('#img_edit_user').attr('title', res.image);

            $('#cont_edit_user').attr('data-id', res.id_user);
            $('#input_user_name').val(res.full_name);
            $('#input_user_email').val(res.e_mail);
            $('#input_user_num').val(res.num);
            $('#img_edit_user').attr('src', res.image);
            $('#input_user_facebook').val(res.facebook);
            $('#input_user_twitter').val(res.twitter);
            $('#input_user_instagram').val(res.instagram);

            const role = res.user_role;

            for(let i = 0; i < option.length; i++) {
                if(role == $(option[i]).attr('value')) {

                    $(option[i]).prop('selected', true);
                }
            }

        }
    });
    
});

$('#main_display').on('click', '#img_edit_user', function() {

    $('#file_edit_user').trigger('click');

});

$('#main_display').on('click', '#user_update_btn', function() {

    const id = $('#cont_edit_user').attr('data-id');

    const f = document.getElementById('form_edit_user');
    const form = new FormData(f);
    const img_src = $('#img_edit_user').attr('src');
    const file = $('#file_edit_user');
    const file_final = file[0].files[0];

    form.append('old_image', $('#img_edit_user').attr('title'));

    if(typeof file_final === 'undefined') {
        
        form.append('src',img_src);
    }

    else {
        form.append('image',file_final.name);
    }

    form.append('id', id);
    
    $.ajax({
        type: 'POST',
        url:'/update_user',
        contentType: false,
        processData: false,
        data: form,
        success: function(res) {

            console.log(res);

            if(res === true) {
                $('#editModalUsers').modal('hide');
            }
            else if(res === 'image missing') {
                alert('Image missing');
            }

            else {
                alert('Something goes wrong!!!');
            }

        }
    });

});

$('#main_display').on('click', '#user_trash_btn', function() {

    const id = $('#cont_edit_user').attr('data-id');

    $.ajax({
        type: 'get',
        url: '/delete/user' + id,
        success: function(res) {
            if(res) {
                $('#editModalUsers').modal('hide');
            }
            else {
                alert('Some things goes wrong1!!');
            }
        }

    });

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

$('#main_text_area_singin').trumbowyg(plugin);


$('#btn_send').on('click', function() {

    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);

    const formData = new FormData();

    const name = $('#singin_name').val();
    const img = $('#img_singin').attr('src');
    const email = $('#email_singin').val();
    const num = $('#num_singin').val();
    const facebook = $('#facebook_singin').val();
    const instagram = $('#instagram_singin').val();
    const twitter = $('#twitter_singin').val();
    const password = $('#custom_password_singin').val();
    const txt_area = $('#main_text_area_singin').val();
    const role = $('#role').text();

    let convertedRole = convertRole(role);

    const id = urlParam.get('id');

    const upload = document.getElementById('upload');

    formData.append('name',name);
    formData.append('file', upload.files[0]);
    formData.append('email',email);
    formData.append('num',num);
    formData.append('facebook',facebook);
    formData.append('instagram',instagram);
    formData.append('twitter',twitter);
    formData.append('password',password);
    formData.append('txt_area',txt_area);
    formData.append('role',convertedRole);
    formData.append('id',id);

    $.ajax({
        type:'POST',
        url:'/singin/send_request',
        data:formData,
        contentType: false,
        processData: false,
        success: function(res) {

            if(res === false) {
                
                if(name === '') {
                    $('#singin_name').css('border', '1px solid red');
                }

                if(email ==='') {
                    $('#email_singin').css('border', '1px solid red');
                }

                if(num ==='') {
                    $('#num_singin').css('border', '1px solid red');
                }

                if(facebook ==='') {
                    $('#facebook_singin').css('border', '1px solid red');
                }

                if(instagram ==='') {
                    $('#instagram_singin').css('border', '1px solid red');
                }

                if(twitter ==='') {
                    $('#twitter_singin').css('border', '1px solid red');
                }

                if(password ==='') {
                    $('#custom_password_singin').css('border', '1px solid red');
                }
               
                if(txt_area ==='') {

                    $('.trumbowyg-box').css('border', '1px solid red');
                }

                if(img === '') {
                    $('#img_singin').css('border', '1px solid red')
                }
                
            }

            else if (res === 'user') {
                alert('User already exists in database');
            }

            else if(res === 'not valid') {
                alert('E-mail is not valid');
                $('#email_singin').css('border', '1px solid red');
            }

            else {

                window.location.href = res;

            }

        }
    });

});

$('#img_singin').on('click', function() {

    $('#upload').trigger('click');

});


//Add user 

$('#main_display').on('click','#send_mail', function() {

    const div_spinner = $('<div>', {
        class: 'spinner-border',
        role: 'status'
    });

    const span_spinner = $('<span>', {class: 'visually-hidden'});

    div_spinner.html(span_spinner);

    $('#send_mail').html(div_spinner);

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

            if(res === false) {

                $('#send_mail').html('Send');

                if(name === '') {
                    
                    $('#add_user_name').css('border', '1px solid red');
                }

                if(email ==='') {
                    
                    $('#add_user_email').css('border', '1px solid red');
                }

                if(checkbox === 0) {
                    $('#super_admin_check').css('border', '1px solid red');
                    $('#admin_check').css('border', '1px solid red');
                    $('#editor_check').css('border', '1px solid red');
                    $('#author_check').css('border', '1px solid red');
                    $('#contributor_check').css('border', '1px solid red');
                    $('#supporter_check').css('border', '1px solid red'); 
                }

            }

            else if(res === 'not valid') {
                alert('E-mail is not valid');
                $('#add_user_email').css('border', '1px solid red');
                $('#send_mail').html('Send');
            }

            else {

                $('#send_mail').html('Send');

                if(res === 'done') {

                    $('#add_user_name').val('');
                    $('#add_user_email').val('');
                    $('#super_admin_check').prop('checked', false);
                    $('#admin_check').prop('checked', false);;
                    $('#editor_check').prop('checked', false);
                    $('#author_check').prop('checked', false);
                    $('#contributor_check').prop('checked', false);
                    $('#supporter_check').prop('checked', false);

                    const div_msg = $('<div>', {
                        class: 'alert alert-success',
                        role: 'alert'
                    }).text('A simple success alert—check it out!');

                    const button_x = $('<button>', {
                        class: 'btn-close'
                    }).attr('data-bs-dismiss', 'alert');

                    div_msg.append(button_x);

                    $('#row_add_user').prepend(div_msg);

                }

            }

        }
    });

});
