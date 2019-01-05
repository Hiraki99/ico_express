
function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
var recaptcha1;
var recaptcha2;
var CaptchaCallback = function (){
    recaptcha1 = grecaptcha.render('recaptcha-1', {
        'sitekey' : '6Lc8pVMUAAAAAP2Oyt-pO17Dd2tvJ_9iJt0R8pcK', //Replace this with your Site key
        'theme' : 'light'
    });
    
    //Render the recaptcha2 on the element with ID "recaptcha2"
    recaptcha2 = grecaptcha.render('recaptcha-2', {
        'sitekey' : '6Lc8pVMUAAAAAP2Oyt-pO17Dd2tvJ_9iJt0R8pcK', //Replace this with your Site key
        'theme' : 'light'
    });
}


function getURLVar(key) {
    var value = [];

    var query = String(document.location).split('?');

    if (query[1]) {
        var part = query[1].split('&');

        for (i = 0; i < part.length; i++) {
            var data = part[i].split('=');

            if (data[0] && data[1]) {
                value[data[0]] = data[1];
            }
        }

        if (value[key]) {
            return value[key];
        } else {
            return '';
        }
    }
}

$('#signup').magnificPopup({
    type: 'inline',
    preloader: false,
    showCloseBtn: false, closeOnBgClick: false ,
    modal: true
});

function onloadCallback(name) {
    /* Place your recaptcha rendering code here */
    grecaptcha.render(name, {
        sitekey: '6Lc8pVMUAAAAAP2Oyt-pO17Dd2tvJ_9iJt0R8pcK',
        callback: function () {
            console.log('recaptcha callback');    
        }
    });
}

function DoneSignUp(){
    $("#tab_1").next().css('filter','none');
    $("#tab_2").next().css('filter','none')

    $("#form_signin").css('filter','none');
    $("#form_signup").css('filter','none');

}
var checkUserExit = function(username, callback) {
	$.ajax({
		url: '/check_username',
		type: 'POST',
		data: {
			'username': username
		},
		async: false,
		success: function(result) {
			result = $.parseJSON(result);
			callback(result.success == 1);
		}
	});
};

var checkEmailExit = function(email, callback) {
	$.ajax({
		url: '/check_email',
		type: 'POST',
		data: {
			'email': email
		},
		async: false,
		success: function(result) {
			result = $.parseJSON(result);
			callback(result.success == 1);
		}
	});
}
function convertDateToString(date){
    var date_change = new Date(date);
    var day = date_change.getDay() < 10 ? "0"+date_change.getDay() : date_change.getDay()
    var month = date_change.getMonth() < 10 ? "0"+date_change.getMonth() : date_change.getMonth()
    var hour = date_change.getHours() < 10 ? "0"+date_change.getHours() : date_change.getHours()
    var minutes = date_change.getMinutes() < 10 ? "0"+date_change.getMinutes() : date_change.getMinutes()
    return day+"-"+month + "-" +  date_change.getFullYear()+ " "+ hour+ ":"+ minutes;
}
$.ajax({
    url: '/top-news',
    type: 'post',
    dataType: 'json',
    success: function(json) {
        console.log(json);
        
        var strVar="";

        for(var i =0 ; i< json.length;i++){
            var data = json[i];
            strVar += "<div class=\"col-lg-4 offset-lg-0 col-sm-8 offset-sm-2\">";
            strVar += "   <div class=\"blog-item animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\"0\" style=\"visibility: visible;\">";
            strVar += "      <div class=\"blog-photo\"><a href=\"/news?id="+data.id+"\"><img src=\""+data.url_image+"\" alt=\"blog-photo\" onerror=\"errorImage(this)\"><\/a><\/div>";
            strVar += "      <div class=\"blog-texts\">";
            strVar += "         <ul class=\"blog-meta\">";
            strVar += "            <li><a href=\"javascript:void(0)\">"+convertDateToString(data.createdAt)+"<\/a><\/li>";
            strVar += "            <li><a href=\"#\">"+data.category+"<\/a><\/li>";
            strVar += "         <\/ul>";
            strVar += "         <h5 class=\"blog-title\"><a href=\"/news?id="+data.id+"\">"+data.title+"<\/a><\/h5>";
            strVar += "         <p>"+data.description+"<\/p>";
            strVar += "      <\/div>";
            strVar += "   <\/div>";
            strVar += "<\/div>";
        }
        $("#top_news").html('');
        $("#top_news").append(strVar);
        
    }
});
function errorImage(e){
    $(e).attr('src','/image_news/blog-thumb-b.jpg');
}
$('input').focus(function(e){
    $("#error_login").parent().css('display','none');
    $('#error_username').css('display','none');
    $('#error_email').css('display','none');
    $('#error_repeat_password').css('display','none');
    $('#error_password').css('display','none');
})
function login() {
    var recaptcha;
    $("#form_login").css('display','none');
    $("#loading_signin").css('display','block');
    
    var user_name = $("#user_login").val();
    var password = $("#pass_login").val();
    
    recaptcha = $('#g-recaptcha-response').val();
    
    var authy_code = $('#pass_two_fa').val();
    if(user_name.length <= 0){
		$("#error_login").html("Please enter your username");
        $("#captra_sign_up").css('display','block');
        $("#loading_signin").css('display','none');    
        $("#form_login").css('display','block');
        grecaptcha.reset(recaptcha1);
        return false;
	}
	if(password.length < 8){
        $("#error_login").html("Please enter your password");
        $("#captra_sign_up").css('display','block');
        $("#loading_signin").css('display','none');
        $("#form_login").css('display','block');
        grecaptcha.reset(recaptcha1);
        
        return false;
    }
    data = {
        "user_name":user_name,
        "password":md5(password),
        "recaptcha":recaptcha,
        "authy_code":authy_code,
        // "csrfmiddlewaretoken" :$('meta[name="_csrf"]').attr('content')
    }
    $.ajax({
        url: '/loginSubmitAjax',
        // headers: {'X-CSRF-Token': $('meta[name="_csrf"]').attr('content')},
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(json) {
            console.log(json);
            
            console.log(json.error_warning);
            grecaptcha.reset(recaptcha1);
            
            if (json.error_warning) {
                $("#error_login").css('display','block');
                $("#error_login").parent().css('display','block');
                $("#error_login").html(json.error_warning);
                $("#loading_signin").css('display','none');
                $("#form_login").css('display','block');
            } else if (json.success && json.link_redirect) {
                window.location.href = '/'+json.link_redirect;
                $("#loading_signin").css('display','none');
            }
            
            // $("#form_login").css('display','block');
        },
        error: function(xhr, ajaxOptions, thrownError) {
            
            
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            grecaptcha.reset(recaptcha1);
            $("#error_login").parent().css('display','block');
            $("#error_login").css('display','block');
            $("#error_login").html('Username or password is incorrect!');
            $("#loading").css('display','none');
            $("#form_login").css('display','block');
        }
    });
};


function signup(){
    $("#form_signup").css('display','none');
    $("#loading_signup").css('display','block');
    var user_name = $("#new_user").val();
    var password = $("#new_pass").val();
    var password_confirmation = $("#repeat_new_pass").val();
    var recaptcha;
    recaptcha = $('#g-recaptcha-response-1').val();
    var email = $('#email').val();
    var referal = getURLVar("referal");
    var formdata = {
        'username' : user_name,
        'password' : md5(password),
        'email' :  email,
        'referal' : referal,
        'recaptcha': recaptcha
    }
    if(user_name.length < 6 || user_name.length > 30){
        $('#error_username').css('display','block');
        $('#error_username').html('Username has length between 6 and 30 character');
        $("#captra_login").css('display','block');
        $("#loading_signup").css('display','none');
        $("#form_signup").css('display','block');
        grecaptcha.reset();
        return false;
    } else {
        var checkUser = false;
        checkUserExit(user_name, function(callback) {
            checkUser = callback;
        });

        if(!checkUser){
            $('#error_username').css('display','block');
            $("#captra_login").css('display','block');
            $('#error_username').html('Username is already exist, please try again');
            grecaptcha.reset(recaptcha2);
            $("#loading_signup").css('display','none');
            $("#form_signup").css('display','block');
            return false;
        }
    }
    if(email.length <= 0 || validateEmail(email)==false){
        $('#error_email').css('display','block');
        $("#captra_login").css('display','block');
        $("#loading_signup").css('display','none');
        $("#form_signup").css('display','block');
        DoneSignUp();
        grecaptcha.reset(recaptcha2);
        return false;
    } else {
        var checkEmail = false;
        checkEmailExit(email, function(callback) {
            checkEmail = callback;
        });

        if (!checkEmail) {
            $('#error_email').html('Email is already exist, please try again');
            $('#error_email').css('display','block');
            $("#captra_login").css('display','block');
            $("#loading_signup").css('display','none');
            $("#form_signup").css('display','block');
            grecaptcha.reset(recaptcha2);
            return false;
        }
    }
    if(password.length < 8){
        $('#error_password').css('display','block');
        $("#captra_login").css('display','block');
        $("#loading_signup").css('display','none');
        grecaptcha.reset(recaptcha2);
        return false;
    }
    if(password.length > 0 && (password_confirmation.length <= 0 || password != password_confirmation)){
        $('#error_repeat_password').css('display','block');
        $('#error_repeat_password').html("Password confirmation is invalid")
        $("#captra_login").css('display','block');
        $("#loading_signup").css('display','none');
        $("#form_signup").css('display','block');
        grecaptcha.reset(recaptcha2);
        return false;
    }
    $.ajax({
        url: '/SignUpAjax',
        type: 'post',
        data: formdata,
        dataType: 'json',
        success: function(json) {
            console.log(json);
            
            grecaptcha.reset(recaptcha2);
            if (json.error_warning) {
                $("#error_signup").css("display","block");
                $("#error_signup").parent().css("display","block");
                $("#error_signup").html(json.error_warning);
                $("#form_signup").css('display','block');
            } else if (json.success) {
               $("#form_signup").css("display","none");
               $("#verify_css").css("display","block");
               $("#noti_signup").css('display','block')
               $("#noti_signup").html("REGISTRATION LETTER IS SENT! We've sent  activation email to "+json.email+ " . Please check your e-mail (include spam) in order to complete registration and receive further instructions.");
            }
            $("#loading_signup").css('display','none');
            
        },
        error: function(xhr, ajaxOptions, thrownError) {
            
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            grecaptcha.reset(recaptcha2);
            $("#error_signup").css("display","block");
            $("#error_signup").parent().css("display","block");
            $('#error_signup').html('Username or password is incorrect!');
            $("#loading_signup").css('display','none');
            $("#form_signup").css('display','block');
        }
    });
}
try {
    $('#popup-login').magnificPopup({
        type: 'inline',
        preloader: false,
        showCloseBtn: false, closeOnBgClick: false ,
        focus:'#test-modal',
        modal: true
    });
}
catch(err) {
    
}


var register = getURLVar('register');
var email = getURLVar('email');
if (register !='' && register !=undefined){
    switch(parseInt(register)){
        case -1:
            $.magnificPopup.open({
                items: {
                    src: '#test-modal-resign' 
                },
                type: 'inline',preloader: false,
                showCloseBtn: false, closeOnBgClick: false
                
            });
            var strVar="";
            $("#resend_verify > .login-html-size > .form-message > .button").remove();
            strVar += "<div class=\"input-field animated fadeInUp button\" data-animate=\"fadeInUp\" data-delay=\".5\" style=\"visibility: visible; animation-delay: 0.5s;\"><button class=\"btn\"  type=\"submit\" data-email="+email+" onclick=\"resend_email(this);\">Resend Verify   <\/button><\/div>";
            $("#resend_verify > .login-html-size > .form-message").append(strVar);

            $('#noti_signup_resend').html('Account register with email dont existed. Please sign up again!');
            
            break;
        case 0:
            $.magnificPopup.open({
                items: {
                    src: '#test-modal-resign' 
                },
                type: 'inline',preloader: false,
                showCloseBtn: false, closeOnBgClick: false
                
            });
            var strVar="";
            $("#resend_verify > .login-html-size > .form-message > .button").remove();
            strVar += "<div class=\"input-field animated fadeInUp button\" data-animate=\"fadeInUp\" data-delay=\".5\" style=\"visibility: visible; animation-delay: 0.5s;\"><button class=\"btn\"  type=\"submit\" data-email="+email+" onclick=\"resend_email(this);\">Resend Verify   <\/button><\/div>";
            $("#resend_verify > .login-html-size > .form-message").append(strVar);
            
            $('#noti_signup_resend').html('Time for verify account expried! Please click resend to receive email verify account! ');
            
            break;
        case 1:
            
            $('#success_register').html('Register success, please log in new account!');
            $('#success_register').css('display','block');
            $.magnificPopup.open({
                items: {
                    src: '#test-modal' 
                },
                type: 'inline',preloader: false,
                showCloseBtn: false, closeOnBgClick: false
                  
            });
        
            break;
        case 2:
            $.magnificPopup.open({
                items: {
                    src: '#test-modal-siginup' 
                },
                type: 'inline',preloader: false,
                showCloseBtn: false, closeOnBgClick: false
                
            });
            break;
    }
}
var error = getURLVar('error');
var success = getURLVar('success');
if (error && error !=undefined){
    $.magnificPopup.open({
        items: {
            src: '#test-modal' 
        },
        type: 'inline',preloader: false,
        showCloseBtn: false, closeOnBgClick: false
          
    });
    
}
if(success && success !=undefined){
    $.magnificPopup.open({
        items: {
            src: '#test-modal' 
        },
        type: 'inline',preloader: false,
        showCloseBtn: false, closeOnBgClick: false
          
    });
}
function listvideo(){
    $.ajax({
        url: '/get-videos',
        // headers: {'X-CSRF-Token': $('meta[name="_csrf"]').attr('content')},
        type: 'post',
        dataType: 'json',
        success: function(json) {
            var source = [];
            for(var i=0;i<json.length;i++){
                source.push({
                    src: json[i],
                    type: 'iframe'
                })
            }
            $('#list_video').magnificPopup({
                items: source,
                closeBtnInside: true,preloader: false,
                gallery:
                {
                    enabled:true
                }
            });
        }
    })
}

function resend_email(e){
    $("#loading_resend").css('display','block');
    $("#resend_verify").css('display','none');
    var strVar = "";
    var data ={
        'email' : $(e).data('email')
    }
    console.log(data);
    $.ajax({
        url: '/re_confirmaccount',
        type: 'post',
        data : data,
        dataType: 'json',
        success: function(json) {
            $("#loading_resend").css('display','none');
            $("#resend_verify").css('display','block');
            switch(json.success){
                case -1:
                    $("#resend_verify > .login-html-size > .form-message > .button").remove();
                    strVar += "<div class=\"input-field animated fadeInUp button\" data-animate=\"fadeInUp\" data-delay=\".5\" style=\"visibility: visible; animation-delay: 0.5s;\"><button class=\"btn\"  onclick='$.magnificPopup.instance.close();' >Okie     <\/button><\/div>";
                    $("#resend_verify > .login-html-size > .form-message").append(strVar);
    
                    $('#noti_signup_resend').html('Account register with email dont existed. Please sign up again!');
                    break;
                case 0:
                    $("#resend_verify > .login-html-size > .form-message > .button").remove();
                    strVar += "<div class=\"input-field animated fadeInUp button\" data-animate=\"fadeInUp\" data-delay=\".5\" style=\"visibility: visible; animation-delay: 0.5s;\"><button class=\"btn\"  type=\"submit\" data-email="+email+" onclick=\"resend_email(this);\">Resend Verify   <\/button><\/div>";
                    $("#resend_verify > .login-html-size > .form-message").append(strVar);
                    
                    $('#noti_signup_resend').html('Time for verify account expried! Please click resend to receive email verify account! ');
                    
                case 1:
                    $("#resend_verify > .login-html-size > .form-message > .button").remove();
                    strVar += "<div class=\"input-field animated fadeInUp button\" data-animate=\"fadeInUp\" data-delay=\".5\" style=\"visibility: visible; animation-delay: 0.5s;\"><button class=\"btn\"  onclick='$.magnificPopup.instance.close();' >Okie     <\/button><\/div>";
                    $("#resend_verify > .login-html-size > .form-message").append(strVar);

                    $("#noti_signup_resend").css('color','forestgreen');
                    $('#noti_signup_resend').html('Resend email verify account success. Please check '+ email+' to verify account');
                    
                    break;
            }
                
        }
    })
}
function formatDate(date_nofomat){
    var date = new Date(date_nofomat);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "," + strTime;
}
function compare_date(date1, date2){
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    if(d1 >d2) return true;
    return false;
}
$.ajax({
    url: '/token-sale',
    // headers: {'X-CSRF-Token': $('meta[name="_csrf"]').attr('content')},
    type: 'post',
    dataType: 'json',
    success: function(json) {
        console.log(json)
        if(json.status > 0){
            if(compare_date(Date.now(), json.start_date)) {
                $("#tokenSale").css("display","none");
            }else{
                var tokenSale="";
                
                tokenSale += "<div class=\"row text-center\">";
                tokenSale += "   <div class=\"col-md-8 offset-md-2 col-lg-6 offset-lg-3\">";
                tokenSale += "      <div class=\"section-head\">";
                tokenSale += "         <h2 class=\"section-title animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\"0\" style=\"visibility: visible;\">TOKEN SALE<span>TOKEN<\/span><\/h2>";
                tokenSale += "         <p class=\"animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\".1\" style=\"visibility: visible; animation-delay: 0.1s;\">ICO Crypto token will be released on the basis of Ethereum. To buy token by deposit your ETH with KYC.<\/p>";
                tokenSale += "      <\/div>";
                tokenSale += "   <\/div>";
                tokenSale += "<\/div>";

                tokenSale += "<div class=\"row align-items-center\">";
                tokenSale += "   <div class=\"col-lg-6\">";
                tokenSale += "      <div class=\"row event-info\">";
                tokenSale += "         <div class=\"col-sm-6\">";
                tokenSale += "            <div class=\"event-single-info animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\"0\" style=\"visibility: visible;\">";
                tokenSale += "               <h6>Start<\/h6>";
                tokenSale += "               <p>"+formatDate(json.start_date)+"<\/p>";
                tokenSale += "            <\/div>";
                tokenSale += "         <\/div>";
                tokenSale += "         <!-- .col-->";
                tokenSale += "         <div class=\"col-sm-6\">";
                tokenSale += "            <div class=\"event-single-info animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\".1\" style=\"visibility: visible; animation-delay: 0.1s;\">";
                tokenSale += "               <h6>Number of tokens for sale<\/h6>";
                tokenSale += "               <p>2,800,000,000 UNI (35%)<\/p>";
                tokenSale += "            <\/div>";
                tokenSale += "         <\/div>";
                tokenSale += "         <!-- .col-->";
                tokenSale += "         <div class=\"col-sm-6\">";
                tokenSale += "            <div class=\"event-single-info animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\".2\" style=\"visibility: visible; animation-delay: 0.2s;\">";
                tokenSale += "               <h6>End<\/h6>";
                tokenSale += "               <p>"+formatDate(json.end_date)+"<\/p>";
                tokenSale += "            <\/div>";
                tokenSale += "         <\/div>";
                tokenSale += "         <!-- .col-->";
                tokenSale += "         <div class=\"col-sm-6\">";
                tokenSale += "            <div class=\"event-single-info animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\".3\" style=\"visibility: visible; animation-delay: 0.3s;\">";
                tokenSale += "               <h6>Tokens exchange rate<\/h6>";
                tokenSale += "               <p style='margin-bottom:0'>1 ETH = "+json.rate_unlock+" UNI Unlock </p><p> 1 ETH = "+json.rate_lock+" UNI Lock<\/p>";
                tokenSale += "            <\/div>";
                tokenSale += "         <\/div>";
                tokenSale += "         <!-- .col-->";
                tokenSale += "         <div class=\"col-sm-6\">";
                tokenSale += "            <div class=\"event-single-info animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\".4\" style=\"visibility: visible; animation-delay: 0.4s;\">";
                tokenSale += "               <h6>Acceptable currencies<\/h6>";
                tokenSale += "               <p>ETH<\/p>";
                tokenSale += "            <\/div>";
                tokenSale += "         <\/div>";
                tokenSale += "         <!-- .col-->";
                tokenSale += "         <div class=\"col-sm-6\">";
                tokenSale += "            <div class=\"event-single-info animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\".5\" style=\"visibility: visible; animation-delay: 0.5s;\">";
                tokenSale += "               <h6>Minimal transaction amount<\/h6>";
                tokenSale += "               <p>0.1 ETH<\/p>";
                tokenSale += "            <\/div>";
                tokenSale += "         <\/div>";
                tokenSale += "         <!-- .col-->";
                tokenSale += "      <\/div>";
                tokenSale += "      <!-- .row-->";
                tokenSale += "   <\/div>";
                tokenSale += "   <!-- .col-->";
                tokenSale += "   <div class=\"col-lg-5 offset-lg-1\">";
                tokenSale += "      <div class=\"countdown-box text-center animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\".3\" style=\"visibility: visible; animation-delay: 0.3s;\">";
                tokenSale += "         <div class=\"token-countdown d-flex align-content-stretch\" data-date="+formatDate(json.start_date)+">";
                tokenSale += "            <div class=\"col\"><span class=\"countdown-time countdown-time-first\">08<\/span><span class=\"countdown-text\">Days<\/span><\/div>";
                tokenSale += "            <div class=\"col\"><span class=\"countdown-time\">13<\/span><span class=\"countdown-text\">Hours<\/span><\/div>";
                tokenSale += "            <div class=\"col\"><span class=\"countdown-time\">23<\/span><span class=\"countdown-text\">Minutes<\/span><\/div>";
                tokenSale += "            <div class=\"col\"><span class=\"countdown-time countdown-time-last\">53<\/span><span class=\"countdown-text\">Seconds<\/span><\/div>";
                tokenSale += "         <\/div>";
                tokenSale += "         <a class=\"btn btn-alt btn-sm\" href=\"#\">Join &amp;  BUY TOKEN NOW<\/a>";
                tokenSale += "         <ul class=\"icon-list\">";
                tokenSale += "            <li><em class=\"fa fa-bitcoin\"><\/em><\/li>";
                tokenSale += "            <li><em class=\"fa fa-won\"><\/em><\/li>";
                tokenSale += "            <li><em class=\"fa fa-cc-visa\"><\/em><\/li>";
                tokenSale += "            <li><em class=\"fa fa-cc-mastercard\"><\/em><\/li>";
                tokenSale += "         <\/ul>";
                tokenSale += "      <\/div>";
                tokenSale += "   <\/div>";
                tokenSale += "   <!-- .col-->";
                tokenSale += "<\/div>";
                $("#tokenSale > .container > .align-items-center").remove();
                $("#tokenSale > .container > .text-center").remove();
                $("#tokenSale > .container").prepend(tokenSale);
                var $count_token = $('.token-countdown');
                if ($count_token.length > 0 ) {
                    $count_token.each(function() {
                        var $self = $(this), datetime = $self.attr("data-date");
                        $self.countdown(datetime).on('update.countdown', function(event) {
                            $(this).html(event.strftime('' + 
                                '<div class="col"><span class="countdown-time countdown-time-first">%D</span><span class="countdown-text">Days</span></div>'
                                + '<div class="col"><span class="countdown-time">%H</span><span class="countdown-text">Hours</span></div>' 
                                + '<div class="col"><span class="countdown-time">%M</span><span class="countdown-text">Minutes</span></div>'
                                + '<div class="col"><span class="countdown-time countdown-time-last">%S</span><span class="countdown-text">Seconds</span></div>'));
                        });
                    });
                    
                }
            }
            
            
        }else{
            $("#tokenSale").css("display","none");
        }


        

    }
})
$.ajax({
    url: '/list-advisor',
    // headers: {'X-CSRF-Token': $('meta[name="_csrf"]').attr('content')},
    type: 'post',
    dataType: 'json',
    success: function(json) {
        console.log(json)
        if(json.status > 0){
            var var_adv="";
            json = json.list;
            for(var i  = 0;i < json.length; i++){
                var_adv += "<div class=\"col-lg-3 col-md-4\">";
                var_adv += "   <div class=\"team-circle animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\".1\" style=\"visibility: visible; animation-delay: 0.1s;\">";
                var_adv += "      <div class=\"team-photo\"><img src=\"/image_advisor\/"+json[i].url_img+"\" alt=\"team\"><a class=\"expand-trigger content-popup\" href=\"#team-profile-"+i+"\"><\/a><\/div>";
                var_adv += "      <div class=\"team-info\">";
                var_adv += "         <h5 class=\"team-name\">"+json[i].name+"<\/h5>";
                var_adv += "         <span class=\"team-title\">Board Advisor<\/span>";
                var_adv += "      <\/div>";
                var_adv += "      <!-- Start .team-profile-->";
                var_adv += "      <div class=\"team-profile mfp-hide\" id=\"team-profile-"+i+"\">";
                var_adv += "         <button class=\"mfp-close\" title=\"Close\" type=\"button\">×<\/button>";
                var_adv += "         <div class=\"container-fluid\">";
                var_adv += "            <div class=\"row no-mg\">";
                var_adv += "               <div class=\"col-md-6\">";
                var_adv += "                  <div class=\"team-profile-photo\"><img src=\"/image_advisor\/"+json[i].url_img+"\" alt=\"team\"><\/div>";
                var_adv += "               <\/div>";
                var_adv += "               <!-- .col-->";
                var_adv += "               <div class=\"col-md-6\">";
                var_adv += "                  <div class=\"team-profile-info\">";
                var_adv += "                     <h3 class=\"name\">"+json[i].name+"<\/h3>";
                var_adv += "                     <p class=\"sub-title\">Board Advisor<\/p>";
                var_adv += "                     <ul class=\"tpi-social\">";
                var_adv += "                        <li><a href=\""+json[i].facebook+"\"><em class=\"fa fa-facebook\"><\/em><\/a><\/li>";
                var_adv += "                        <li><a href=\""+json[i].twitter+"\"><em class=\"fa fa-twitter\"><\/em><\/a><\/li>";
                
                var_adv += "                     <\/ul>";
                var_adv += "                     <p>"+json[i].description+"<\/p>";
                var_adv += "                     <p>"+json[i].information+"<\/p>";
                
                var_adv += "                  <\/div>";
                var_adv += "               <\/div>";
                var_adv += "               <!-- .col-->";
                var_adv += "            <\/div>";
                var_adv += "            <!-- .row-->";
                var_adv += "         <\/div>";
                var_adv += "         <!-- .container-->";
                var_adv += "      <\/div>";
                var_adv += "      <!-- .team-profile-->";
                var_adv += "   <\/div>";
                var_adv += "<\/div>";
            }

            $("#advisor_team > div").remove();
            $("#advisor_team").prepend(var_adv);

            var $content_popup = $('.content-popup');
            if ($content_popup.length > 0 ) {
                $content_popup.magnificPopup({
                    type: 'inline',
                    preloader: true,
                    removalDelay: 400,
                    mainClass: 'mfp-fade bg-team-exp'
                });
            }
            
        }else{
            $("#advisor_team").css("display","none");
            $("#advisor_team").prev().css("display","none");
        }


        

    }
})