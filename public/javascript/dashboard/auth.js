$("#enable_two_fa").click(function(){
    $("#two-factor-enabling").css("display","block");
    $("#status_twoFA").css("display","none");
})
$("#btn_cancel_authy").click(function(){
    $("#two-factor-enabling").css("display","none");
    $("#status_twoFA").css("display","block");
});
$("#two-factor-btn").click(function(){
    console.log($("#two-factor-key").val())
    var formdata = {
        "auth_key":$("#two-factor-key").val(),
        "auth_code":$("#two-factor-code").val()
    };

    $.ajax({
        url: '/account/enable2FA',
        type: 'post',
        data: formdata,
        dataType: 'json',
        success: function(json) {
            if (json.error_warning) {
                $("#two_factor_code-error").html(json.error_warning);
            } else {
                $("#status_twoFA").css("display","block");
                $("#update_authy").css("display","none");
                $("#warning").html(" Enable");
                $("#enable_two_fa").css("display","none")
                $("#disable_two_fa").css("display","block")
            }

        },
        error: function(xhr, ajaxOptions, thrownError) {
              
        }
    });
})
$("#disable_two_fa").click(function(){
    $.ajax({
        url: '/account/disable2FA',
        type: 'post',
        // data: formdata,
        dataType: 'json',
        success: function(json) {
            if (json.error_warning) {
                $("#two_factor_code-error").html(json.error_warning);
            } else {
                $("#warning").html(" DISABLE");
                $("#enable_two_fa").css("display","block");
                $("#disable_two_fa").css("display","none");
            }

        },
        error: function(xhr, ajaxOptions, thrownError) {
              
        }
    });
})