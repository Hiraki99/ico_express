function delete_error(){
    $("#error_oldpassword").css('display','none');
    $("#error_newpassword").css('display','none');
    $("#error_confirmpassword").css('display','none');
}
$("input").focus(function(){
    delete_error();
    
});
$('input').keyup(function(e){
    if(e.keyCode == 8)
        $(this).val('');
});
$(document).ready(function(){
    $("#change_password").click(function(){
        delete_error();
        var old_password = $("#val_oldpassword").val();
        var new_password = $('#val_newpassword').val();
        var confirm_newpassword = $('#val_confirmpassword').val();
        if(old_password.length <=0){
            $("#error_oldpassword").css('display','block');
            return false;
        }
        if(new_password.length < 8){
            $("#error_newpassword").css('display','block');
            return false;
        }
        if( new_password != confirm_newpassword){
            $("#error_confirmpassword").css('display','block');
            return false;
        }

        data = {
            "old_password":md5(old_password),
            "new_password":md5(new_password),
            "confirm_newpassword":md5(confirm_newpassword)
        }
        $.ajax({
            url: '/admin/changePassword',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(json) {
                console.log(json)
                if(json.success ==1){
                    $("#success_changepassowrd").css('display','block');
                    $("#val_oldpassword").val('');
                    $('#val_newpassword').val('');
                    $('#val_confirmpassword').val('');
                }else {
                    switch(json.error){
                        case 0:
                            $("#error_oldpassword").css('display','block');
                            break;
                        case 2:
                            $("#error_confirmpassword").css('display','block');
                            break;
                    }
                    
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                delete_error();
            }
        });
    })
});
