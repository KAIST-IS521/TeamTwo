function verFunction() {

    //should send value to server

    var verify = true;

    if(verify == true)
    {
        alert("Verified");
    }
    else{
        alert("Insert the correct value again!");
    }
}

$(document).ready(function() {
    $('#random-request').click(function(event) {
        event.preventDefault();
        var id_form = $(this).prev();
        var id_val = id_form.val();
        $.ajax({url: '/requestPGP',
                method: 'post',
                data: {'github-id': id_val},
                dataType: 'json',
                success: function(result) {
                    if (result.status != 1) {
                        alert('invalid github id, try again :P');
                    } else {
                        $('randomvalue').text(result.encrypt);
                    }
                }
        });
    });

    $('button.signupbtn').click(function(event) {
        event.preventDefault();

        $.ajax({url: '/register',
                method: 'post',
                dataType: 'json',
                data: {'id': $('#id').val(),
                       'pw': $('#pw').val(),
                       'github-id': $('#id_git').val(),
                       'enc-data': $('#response-value').val(),
                },
                success: function(result) {
                    alert(result.message);
                    if (result.status == 1) {
                        location.href = '/';
                    }
                }
        });
    });

    $('button.cancelbtn').click(function(event) {
        location.href = '/';
    });

    $('#pw').keyup(function(){
        $('font[name=check]').text('');
    }); //#user_pass.keyup

    $('#pw2').keyup(function(){
        if($('#pw').val()!=$('#pw2').val()){
            $('font[name=check]').text('');
            $('font[name=check]').html("Incorrected Password");
        }else{
            $('font[name=check]').text('');
            $('font[name=check]').html("Corrected Password");
        }
    }); //#chpass.keyup
});
