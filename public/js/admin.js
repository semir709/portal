


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
        },

        resizimg: {
            minSize: 64,
            step: 16,
        }
    }
}



/*Custom function*/

function contentValues(e) {

    const view = $(e.target).parent().attr('data-check');
    let parent;

    view == 'full' ? parent = $(e.target).parents().find('.ss_full_holder') :  parent = $(e.target).parents().find('.ss_full_holder_phone');

    console.log(view);

    let txt_area = $('#txt_area').val();
    let input_title = $('#input_title').val(); 
    let inputGroup_publish = parent.find('#inputGroup_publish option:selected').text();
    let inputGroup_post = parent.find('#inputGroup_post option:selected').text()
    let inputGroup_category = parent.find('#inputGroup_category');
    let img_content = parent.find('#img_content').attr('src');
    let upload = parent.find('#upload')[0];
    let old_image = parent.find('#img_content').attr('data-old');
    let content_id = parent.attr('data-id');

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


$('#main_display').on('click', '#img_content', function(e) {

    const input = $(e.target).parent().find('input');

    $(input).trigger('click');

});

function previewFile2(file) {

    const image = $(file).parents().find('#img_singin');
   
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

$('.ss_list').on('click', function() {
    const main_display = $('#main_display');

    const list = $(this);

    const label = $(list.find('.ss_label'));

    switch(label.attr('data-val')) {
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

    // for(let i = 0; i < label.length; i++) {
    //     label[i].innerHTML = '';
    // }

}

$(".ss_list ").on('click',function() {

    $('.ss_label').removeClass("clicked_list");
    $('.ss_icon_nav').removeClass("clicked_list");

    
    this.querySelector('label').classList.toggle("clicked_list");
    this.querySelector('i').classList.toggle("clicked_list");
});


// ALL CONTENTS

//filter all content

$('#main_display').on('click', '.ss_content_filter', function(){//----------------------------------------------------

    const catg = $(this).attr('data-id'); 

    $('#content_search').removeAttr('data-ctg');
    $('#content_search').attr('data-ctg', catg);

    $.ajax({
        type: 'GET',
        url: '/admin/all_content_data' + catg,
        success: function(res) {
            $('#all_content').html(res);
        }
    });

});

//search content
$('#main_display').on('keyup', '#content_search', function() { //----------------------------------------------------
    
    let val;

    let ctg = $('#content_search').attr('data-ctg');

    if($(this).val() == '') {

        val = 'empty-' + ctg;
    } else {
        val = $(this).val();
    }

    $.ajax({
        type:'GET',
        url:'/admin/content/search' + val,
        success: function(res) {

            $('#all_content').html(res);

            
            
        }
    });

});


$("#main_display").on("click", "#edit_category_list" ,function() {
    const main_display = $('#main_display');

    const id = $(this).parents()[5].getAttribute('data-id');
    
    $.ajax({
        type: 'GET',
        url: '/admin/all_content_data/getArticle' + id,
        success: function(res) {
            main_display.html(res);
            $('#txt_area').trumbowyg();
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

$('#main_display').on('click', '.ss_veiw_post', function() {

    const id = $(this).attr('data-id');

    window.location.href = '/content/' + id

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

// $('#main_display').on('click', '#set_schedule', function(e) {

//     e.stopPropagation();

//     const id = $(this).closest('.ss_contents_holder ').attr('data-id');

//     $.ajax({
//         type:'GET',
//         url:'/admin/content/schedule' + id,
//         success: function(res) {

//             if(res.length > 0) {

//                 $('#main_display').html(res);

//             }

//             else {
//                 alert('somethin goes wrong');
//             }
           
//          }
//     });


// });

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
$('#main_display').on('click', '#update_content', function(e) {

    const formData = contentValues(e);

    for(let [i, val] of formData) {
        console.log(i, val);
    }

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

$('#main_display').on('click', ".ss_list_ctg", function(){

    console.log('Hey');

    $('.ss_list_ctg').css("border-bottom", "none");
    
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

$('#main_display').on('click', '#trashed_user', function(e) {

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

$('#main_display').on('keyup', '#user_search', function () {

    let val;

    let ctg = $('#user_search').attr('data-ctg');

    if($(this).val() == '') {

        val = 'empty-' + ctg;
    } else {
        val = $(this).val();
    }

    $.ajax({
        type:'GET',
        url:'/admin/user_search'+ val,
        success: function(res) {
            $('#row_users').html(res);
        }

    });

});



//add content

// $('#upload').on('click',function() {


//     console.log('asdsad');

// });

$('#btn_right_block').on('click', function() {
    let right_block = document.getElementsByClassName('ss_right_block')[0];

    right_block.classList.toggle("ss_show_block");
});


//remove category tag
$('#main_display').on('click', '.tag_category' ,function(e) {

    this.remove();

});


//add category tag
function tag_category(e) {

    let same = false;
    const parent = $(e.target).parent();
    const input = $(parent).find('.ss_input_tag').val();
    const tags = $(parent).parent().find('.ss_tags_container').find('.tag_category');

    tags.each(function(i, obj) {

        let oldTags = $(obj).find('span').text();

        if(oldTags == input) {
            same = true;
        } 

    });

    if(typeof input !== 'undefined' && input !== '' && same === false) {


        let div = $('<div> </div>');
        let span = $('<span> </span>');

        div.addClass('tag_category');

        span.text(input);

        div.append(span);
        
        $('.ss_tags_container').append(div);

    } 


    $('.ss_input_tag').val('');

}

$('#main_display').on('click','#btn_tag', function(e) {
    tag_category(e);
    
});


$(document).on('keypress', function(e) {  

    if(e.code === 'Enter' || e.code === 'Space') {
        
        tag_category(e);
    }
});

$('#main_display').on('click','#post_content_btn', function(e) {
    
    const form = contentValues(e);
   

    $.ajax({
        type: 'POST',
        url: '/admin/add_new/post',
        data: form,
        contentType: false,
        processData: false,
        success: function(res) {
            const view = $(e.target).parent().attr('data-check');
            view == 'full' ? parent = $(e.target).parents().find('.ss_full_holder') :  parent = $(e.target).parents().find('.ss_full_holder_phone');
            
            if(res == 'IsEmpty') {
                alert('Something is empty');
            }

            else if(res == 'done'){

                $('#input_title').val('');
                $('.trumbowyg-editor').text('');
                parent.find('#inputGroup_publish option:selected').text('');
                parent.find('#inputGroup_post option:selected').text('')
                $('#inputGroup_category').val('');
                parent.find('#img_content').attr('src', '');

                $('.ss_tags_container').empty();

                $('#addNewModal').modal('hide');

            }
        }
    });
    
});


/* Category */

$('#main_display').on('click', '.ss_category_filter', function(){

    const catg = $(this).attr('data-id'); 

    $('#category_search').removeAttr('data-ctg');
    $('#category_search').attr('data-ctg', catg);

    $.ajax({
        type: 'GET',
        url: '/admin/category/filter' + catg,
        success: function(res) {
            $('#category_display').html(res);
        }
    });

});

$('#main_display').on('click', '#category_edit', function() {

    $('#editModal').attr('data-id', this.getAttribute('data-id'));

});

$('#main_display').on('click', '#update_category', function() {

    console.log('Hey');

    const input = $('#input_edit_category').val();
    const id = $('#editModal').attr('data-id');

    const ctg = $('#category_search').attr('data-ctg');

    console.log(ctg);

    const data = {
        input,
        id,
        ctg: ctg
    }

    $.ajax({
        type:'POST',
        url:'/admin/category_update',
        data: data,
        success: function(res) {
            if(res == 'empty') {
                const input = $('#input_edit_category');
                input.css('border', '1px solid red');

                $('<p>You need to for fill this filed !!!</p>').css('color', 'red').insertBefore(input);
            }
            else {
                $('#editModal').modal('hide');
                $('#category_display').html(res);
                $('#input_edit_category').val('');
                // $('#main_display').html(res);

                //category_display
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

$('#main_display').on('keyup', '#category_search', function() { 

    // const input = $(this).val();

    let val;

    let ctg = $('#category_search').attr('data-ctg');

    if($(this).val() == '') {

        val = 'empty-' + ctg;
    } else {
        val = $(this).val();
    }

    $.ajax({
        type:'GET',
        url:'/admin/category_input' + val,
        success: function(res) {

            $('#category_display').html(res);

        }
    });

});

/* user*/


//filter
$('#main_display').on('click', '.ss_users_filter', function(e){

    const catg = $(this).attr('data-id'); 

    $('#user_search').removeAttr('data-ctg');
    $('#user_search').attr('data-ctg', catg);

    $.ajax({
        type: 'GET',
        url: '/admin/users/filter' + catg,
        success: function(res) {

            console.log(catg);

            if(catg == '2') {
                $('#user_confrme_btn').remove();
                const btn_trashed = $(e.target).parents().find('#user_trash_btn');

                btn_trashed.css('background-color','green');
                btn_trashed.text('Recover');
                btn_trashed.attr('id', 'user_recover_btn');

            } else if(catg == '0') {
                $('#user_confrme_btn').remove();
                const btn = $('<button></button>')
                .attr('id', 'user_confrme_btn')
                .attr('type', 'button')
                .addClass('btn btn-warning ss_cofigrme_btn').text('Confirm');

                $('#user_confrme_btn').remove();
                const btn_trashed = $(e.target).parents().find('#user_recover_btn');
                btn_trashed.css('background-color','red');
                btn_trashed.text('Trashed');
                btn_trashed.attr('id', 'user_trash_btn');
                
                btn.insertAfter($('#user_update_btn'));
                

            } else {
                $('#user_confrme_btn').remove();
                const btn_trashed = $(e.target).parents().find('#user_recover_btn');
                btn_trashed.css('background-color','red');
                btn_trashed.text('Trashed');
                btn_trashed.attr('id', 'user_trash_btn');
            }

            $('#row_users').html(res);
        }
    });

});


//edit
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

    const span = $('<span></span>', {class: 'visually-hidden'});
    const button = $('<div></div>', {class: 'spinner-border text-light ss_spinner', role: 'status'}).html(span);

    $('#user_update_btn').html(button);


    
    $.ajax({
        type: 'POST',
        url:'/update_user',
        contentType: false,
        processData: false,
        data: form,
        success: function(res) {

            const inputs = $('.ss_edit_input');

            $('#user_update_btn').text('Update');

            if(res === 'image missing') {
                $('<p>Please add image</p>').addClass('p_msg').css('color', 'red').insertBefore('#cont_edit_user');

                $('#img_edit_user').css('border', '1px solid #ced4da')

                $('#img_edit_user').css('border', '1px solid red');
            }

            else if(res == 'empty') {


                $('<p>Something is empty</p>').addClass('p_msg').css('color', 'red').insertBefore('#cont_edit_user');

                inputs.css('border', '1px solid #ced4da')

                inputs.filter(function() { return this.value == ''; }).css('border', '1px solid red');

            }

            else if(res == 'email not valid') {
                
                $('<p>E-mail is not valid</p>').addClass('p_msg').css('color', 'red').insertBefore('#cont_edit_user');
                inputs.filter(function() {return $(this).attr('name') == 'email'; }).css('border', '1px solid red');
            }

            // else if(res == false) {

            // }

            else {
                $('#row_users').html(res);

                $('#editModalUsers').modal('hide');
                $('#user_update_btn').text('Update');
                $('#img_edit_user').css('border', '1px solid #ced4da');
                inputs.css('border', '1px solid #ced4da');
                $('.p_msg').hide();
            }

        }
    });

});

//moving on the trashe data
$('#main_display').on('click', '#user_trash_btn', function(e) {

    const id = $('#cont_edit_user').attr('data-id');

    $.ajax({
        type: 'get',
        url: '/delete/user' + id,
        success: function(res) {

           
            $('#row_users').html(res);
            $('#editModalUsers').modal('hide');
            

        }

    });

});

//recover user
$('#main_display').on('click', '#user_recover_btn', function(e) {

    const id = $('#cont_edit_user').attr('data-id');

    $.ajax({
        type: 'get',
        url: '/recover/user' + id,
        success: function(res) {

            if(res) {
                $('#row_users').html(res);
                $('#editModalUsers').modal('hide');
            }
            
        }

    });

});

//confirme user

$('#main_display').on('click', '#user_confrme_btn', function(e) {

    const id = $('#cont_edit_user').attr('data-id');

    $.ajax({
        type: 'get',
        url: '/confirme/user' + id,
        success: function(res) {

          
            $('#row_users').html(res);
            $('#editModalUsers').modal('hide');
            
        }

    });

});


/*View User*/


// $('#main_display').on('click', '#view_user', function() {

//     const main_display = $('#main_display');

//     const id = this.getAttribute('data-id');

//     $.ajax({
//         type: 'GET',
//         url: '/admin/view_user' + id,
//         success: function(res) {

//             main_display.html(res);

//         }
//     });
    
// });

//singin

$('#main_text_area_singin').trumbowyg(plugin);

function giveMsg (msg, element, color = 'red') {

    $(`<p>${msg}</p>`).addClass('p_msg').css('color', color).insertBefore(element);
}


$('#btn_send').on('click', function() {

    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);

    const formData = new FormData();

    const name = $('#singin_name').val();
    const img = $('#img_singin').attr('src');
    const email = $('#email_singin').val();
    const num = $('#num_singin').val();
    const password = $('#custom_password_singin').val();
    const confirmePassword = $('#custom_password_confirme_singin').val();
    const role = $('#sing_up_role').text();

    // let convertedRole = convertRole(role);

    const id = urlParam.get('id');

    const upload = document.getElementById('upload');

    formData.append('name',name);
    formData.append('file', upload.files[0]);
    formData.append('email',email);
    formData.append('num',num);
    formData.append('password',password);
    formData.append('confirme_pass', confirmePassword);
    formData.append('role',role);
    formData.append('id',id);

    $.ajax({
        type:'POST',
        url:'/singin/send_request',
        data:formData,
        contentType: false,
        processData: false,
        success: function(res) {

            const input = $('.ss_singup_input');
            const form = $('.ss_role_holder_singup');

            input.css('border', '1px solid #ccc');
            $('#img_singin').css('border', '1px solid #ccc');

            $('.p_msg').hide();

            if(res == 'IsEmpty') {

                giveMsg('Something is empty', form);
                input.filter(function() {return $(this).val() == ''}).css('border', '1px solid red');
                
            }

            else if (res === 'user exsist') {
                giveMsg('User already exists in database', form);
                $('#email_singin').css('border', '1px solid red');
                
            }

            else if(res === 'email not valid') {
                giveMsg('E-mail is not valid', form);
                $('#email_singin').css('border', '1px solid red');
            }

            else if (res === 'password not match!!!') {
                giveMsg('Password not match!', form);
                $('.ss_input_password').css('border', '1px solid red');
                
            }
            else if(res == 'password length') {
                giveMsg('Password must be 8 characters long', form);
                $('.ss_input_password').css('border', '1px solid red');
            }

            else if(res == 'image is empty') {
                giveMsg('Image is empty', form);
                $('#img_singin').css('border', '1px solid red');
                
            }

            else if(res == 'hashing err') {
                giveMsg('Hashing err', form);
                $('.ss_input_password').css('border', '1px solid red');
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

$('#main_display').on('click', '#btn_right_block', function() {

    

});

$('#main_display').on('click', '.ss_check_add_user', function() {

    $('.ss_check_add_user').prop( "checked", false);

    $(this).prop( "checked", true );
    
});

$('#main_display').on('click','#send_mail', function() {

    const div_spinner = $('<div>', {
        class: 'spinner-border ss_spinner_send',
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

            const input = $('.ss_input_add_new_user');
            const checkBox = $('.ss_check_add_user');
            input.css('border', '1px solid #ccc');

            checkBox.css('border', '1px solid #ccc');

            const elBefore = $('.ss_main_info_new_user');
            $('.p_msg').hide();

            if(res === 'IsEmpty') {

                input.filter(function() {
                    return $(this).val() == '';
                }).css('border', '1px solid red');


                if(checkBox.is(':checked') == false) {

                    checkBox.css('border', '1px solid red');

                }

                giveMsg('Something is empty', elBefore);

                $('#send_mail').html('Send');

            }

            else if(res === 'not valid') {
                
                $('#add_user_email').css('border', '1px solid red');
                $('#send_mail').html('Send');
                giveMsg('E-mail is not valid', elBefore);
            }

            else {

                $('#send_mail').html('Send');

                if(res === 'done') {

                    $('.ss_input_add_new_user').val('');
                    checkBox.prop('checked', false);

                    giveMsg('You add new user', elBefore, 'green'); 

                }

            }

        }
    });

});

//SETINGS

$('#main_display').on('click', '#btn_save_settings', function(){

    const logo = $('#input_file_settings_logo')[0].files[0];
    const icon = $('#input_file_settings_icon')[0].files[0];

    const img_logo = $('#img_logo').attr('data-oldLogo');
    const img_icon = $('#img_icon').attr('data-oldIcon');

    const title = $('#site_title').val();
    const tagline = $('#site_tagline').val();
    const post_page = $('#post_per_page').val();
    const pag_count = $('#pag_count').val();

    const form = new FormData();

    form.append('logo', logo);
    form.append('icon', icon);
    form.append('title', title);
    form.append('tagline', tagline);
    form.append('post_page', post_page);
    form.append('pag_count', pag_count);
    form.append('oldLogo', img_logo);
    form.append('oldIcon', img_icon);

    $.ajax({
        type:'POST',
        url:'/admin/settings/update',
        data: form,
        processData: false,
        contentType: false,
        success: function(res) {
            if(res == '1') {
                alert('Problem with images');
            }
            else if(res == '2') {
                alert('post per page and pag count must be type number');
            }
            else {
               
            }
        }
    });

});

$('#main_display').on('click', '#img_icon', function() {

    $('#input_file_settings_icon').trigger('click');

    
});


$('#main_display').on('click', '#img_logo', function() {

    $('#input_file_settings_logo').trigger('click');

    
});


//user password_change

function getId() {

    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get('id');

    $('#form_pass').append($('<input/>').attr('type', 'hidden')
    .attr('name', 'id')
    .attr('value', id));

}

getId();

$('#update_user_password').on('click', function(e) {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const data = {

        password: $('#password').val(),
        newPassword: $('#new_password').val(),
        newPassword2:$('#new_password2').val(),
        id: urlParams.get('id')

    }

    $.ajax({
        type:'POST',
        url: '/user_changePassword',
        data: data,
        success: function(res) {
            const input = $('.ss_pass_chng_input');

            input.css('border', '1px solid #ccc'); 

            if(res == '0') {

                input.filter(function() {
                    return $(this).val() == '';
                }).css('border', '1px solid red');

                $('#msg').text('Please fill all inputs').css('color', 'red');

            }

            else if(res == '1') {
                $('#msg').text('Something goes wrong').css('color', 'red');
            }

            else if(res == '2') {
                $('.ss_pass_main').css('border', '1px solid red');

                $('#msg').text('Inncorect password').css('color', 'red');
            }

            else if(res == '3') {

                $('.ss_pass_new').css('border', '1px solid red');

                $('#msg').text('new password do not match each other').css('color', 'red');
            }

            else if(res =='4') {

                $('.ss_pass_new').filter(function() {
                    return $(this).val().length < 7;
                }).css('border', '1px solid red');

                $('#msg').text(' password must be eight characters long').css('color', 'red');
            }

            else {

                window.location.href = res;
            }
        }

    });

}); 

