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

$('#form_pass').on('submit', function(e) {

    e.preventDefault();

    let form = $(this);
    let url_action = form.attr('action');

    $.ajax({
        type:'POST',
        url: url_action,
        data: form.serialize(),
        success: function(res) {

            if(res == '0') {
                $('#password').css('border', 'red 1px solid');
                $('#new_password').css('border', 'red 1px solid');
                $('#new_password2').css('border', 'red 1px solid');
                $('#msg').text('Please for fill all inputs');
                

            }

            else if(res == '1') {
                $('#msg').text('Something goes wrong');
            }

            else if(res == '2') {
                $('#msg').text('Incorect password');
            }

            else if(res == '3') {
                $('#msg').text('new password do not match each other');
            }

            else if(res =='4') {
                $('#msg').text('new password must be eight characters long');
            }

            else {

                window.location.href = res;
            }
        }

    });

}); 
