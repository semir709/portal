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

