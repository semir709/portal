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

$(".ss_list ").click(function() {

    $('.ss_label').removeClass("clicked_list");
    $('.ss_icon_nav').removeClass("clicked_list");

    
    this.querySelector('label').classList.toggle("clicked_list");
    this.querySelector('i').classList.toggle("clicked_list");
});



// all contents

$(".ss_nav_a ").click(function() {

    $(".ss_nav_a ").css("border-bottom", "none");

    $(this).css("border-bottom", "2px solid #000000");
    
    
});

$("#label_search").click(function() {
    let input_search = document.getElementById('search_input');

    input_search.classList.toggle("ss_input_streach");
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

//trumbowyg
$('#txt_area').trumbowyg();

//add content

$('#btn_right_block').on('click', function() {
    let right_block = document.getElementsByClassName('ss_right_block')[0];

    right_block.classList.toggle("ss_show_block");
});
