$("#login_button").click(function (){
    $('#form').css('display','none');       
    $("#loading").css('display','block');
    var user_name = $("#username").val();
    var password = $("#password").val();
    var recaptcha = $('#g-recaptcha-response').val();
   
    if(user_name.length <= 0){
        $('#form').css('display','block');

        $('#username').css('border','1px solid red');

        $("#loading").css('display','none');
        
        grecaptcha.reset();
        return false;
    }
    if(password.length < 8){
        $('#form').css('display','block');

        $('#password').css('border','1px solid red')
        $('#password').val('Password too short')
        $("#loading").css('display','none');
        
        grecaptcha.reset();
        
        return false;
    }
    data = {
        "user_name":user_name,
        "password":md5(password),
        "recaptcha":recaptcha
    }
    
    $.ajax({
        url: '/admin/loginAdmin',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(json) {
            console.log(json);
            $("#loading").css('display','none');
            console.log(json.error_warning);
            grecaptcha.reset();
            if (json.error_warning) {
                $('#form').css('display','block');
                $("#error-signin-admin").css('display','block');
                $("#error-signin-admin").html(json.error_warning);
            } else if (json.success && json.link_redirect) {
                $("#loading").css('display','none');
                console.log('/'+json.link_redirect);
                window.location.href = json.link_redirect;
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $("#loading").css('display','none');
            $("#error-signin-admin").css('display','block');
            $('#form').css('display','block');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            grecaptcha.reset();
            $("#error-signin-admin").html('Username or password is incorrect!');
        }
    });
});
$('input').focus(function(e){
    $("#error-signin-admin").css('display','none');  
})
function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
function validateAddress (address) {
    return /^(0x)?[0-9a-f]{40}$/.test(address);
};
$("#create-button").click(function (){
    console.log(76)
    $('#form').css('display','none');       
    $("#loading").css('display','block');
    var user_name = $("#val-username").val();
    var nickname  = $("#val-nickname").val();
    var password  = $("#val-confirm-password").val();
    var type      = $("#type").val();
    var privateKey = $("#val-confirm-key").val();
    var email     = $("#val-email").val();
    var address   = $("#val-address").val().toLowerCase();
    var gasPrice = $('#val-gasPrice').val();
    if(user_name.length <= 5){
        $('#form').css('display','block');
        $("#val-username").css('border','1px solid red');
        $("#val-username").val('');
        $("#loading").css('display','none');
        return false;
    }

    if(nickname.length <= 0){
        $('#form').css('display','block');
        $("#val-nickname").css('border','1px solid red');
        $("#val-nickname").val('');
        $("#loading").css('display','none');
        return false;
    }
    if(!validateEmail(email)){
        $('#form').css('display','block');
        $("#val-email").css('border','1px solid red');
        $("#val-email").val('');
        $("#loading").css('display','none');
        return false;
    }
    if(!validateAddress(address)){
        $('#form').css('display','block');
        $("#val-address").css('border','1px solid red');
        $("#val-address").val('');
        $("#loading").css('display','none');
        return false;
    }
    data = {
        "username":user_name,
        "nickname":nickname,
        "type":type,
        "password":md5(password),
        "email" : email,
        "address": address,
        "key":privateKey,
        "gasPrice":gasPrice
    }
    console.log(data);
    $.ajax({
        url: '/admin/create-account',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(json) {
            console.log(json);
            $("#loading").css('display','none');
            console.log(json.error_warning);
            
            if (json.error_warning) {
                $('#form').css('display','block');
                $("#error-signin-admin").css('display','block');
                $("#error-signin-admin").html(json.error_warning);
            } else if (json.success && json.link_redirect) {
                $("#loading").css('display','none');
                console.log('/'+json.link_redirect);
                window.location.href = json.link_redirect;
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $("#loading").css('display','none');
            $("#error-signin-admin").css('display','block');
            $('#form').css('display','block');
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            
            $("#error-signin-admin").html('Username or password is incorrect!');
        }
    });
});