

$(document).ready(function () {
    $.ajax({
        url: '/admin/allaccount',
        type: 'post',

        dataType: 'json',
        success: function (json) {

            var strVar = "";
            if (json.error) {
                $('#form').css('display', 'block');
                $("#error-signin-admin").css('display', 'block');
                $("#error-signin-admin").html(json.error_warning);
            } else {
                console.log(json);
                var type = json.type;
                json = json.listAccount;
                var strVar = "";
                for (var i = 0; i < json.length; i++) {
                    var data = json[i];
                    console.log(type == "Root" || (type == 'Manager' && (data.type == "Supporter" || data.type == "Normal")));
                    strVar += "<tr role=\"row\" class=\"odd\">";
                    strVar += "   <td class=\"sorting_1\">" + (i + 1) + "<\/td>";
                    strVar += "   <td>" + data.username + "<\/td>";
                    strVar += "   <td>" + data.type + "<\/td>";
                    strVar += "   <td>" + data.kyc + "<\/td>";
                    strVar += "   <td>" + data.created_date + "<\/td>";
                    strVar += "   <td><button class=\"btn btn-flat btn-success\" type=\"button\" onclick='viewinfo(" + data.account_id + ",\"" + data.type + "\")'>View Infor<\/button>";
                    if (type == "Root" || (type == 'Manager' && (data.type == "Supporter" || data.type == "Normal"))) {
                        strVar += "<button class=\"btn btn-flat btn-secondary\" type=\"button\" id='button_reset_" + data.account_id + "' onclick='myfunction(" + data.account_id + ",0,\"" + data.type + "\")'>Reset Password<\/button>";
                        if (data.kyc == "Success" || data.kyc == "OK") {
                            strVar += "<button class=\"btn btn-flat btn-warning\" type=\"button\" id='button_lock_" + data.account_id + "' onclick='myfunction(" + data.account_id + ",1,\"" + data.type + "\")'>" + data.is_locked + "<\/button>";
                            if (data.type == "Normal") {
                                strVar += "<button class=\"btn btn-flat btn-danger\"  onclick='myfunction(" + data.account_id + ",2,\"" + data.type + "\")' type=\"button\" >Cancel KYC<\/button>";
                                if (type == "Root") {
                                    strVar += "<button class=\"btn btn-flat btn-primary\"  onclick='myfunction(" + data.account_id + ",3,\"" + data.type + "\")' type=\"button\" >Send Referal + Bonus<\/button>";
                                    strVar += "<button class=\"btn btn-flat btn-info\"  onclick='myfunction(" + data.account_id + ",4,\"" + data.type + "\")' type=\"button\" >Send Airdrop<\/button>";
                                }
                            }
                        } else {
                            strVar += "<button class=\"btn btn-flat btn-normal\" type=\"button\" >Locked<\/button>";
                        }
                    }
                    strVar += "<\/td>";
                    strVar += "<\/tr>";
                }
                $("#example23 > tbody").append(strVar);
                $('#example23').DataTable({
                    dom: 'Bfrtip',
                    buttons: []
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });


});
function viewinfo(id, type) {
    var source = "";
    data = {
        "id": id,
        "type": type
    };
    $.ajax({
        url: '/admin/view-info-account',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (!data.error) {
                var strVar = "";

                strVar += "<div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12   form-pad divcenter\">";

                strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"

                strVar += "<div class=\"alert address-form mfp-newspaper\">";
                strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
                strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
                strVar += "   <center><h4 class=\"alert-heading\"> Infor account<\/h4>";
                strVar += '<\/div>'
                strVar += "        <div class=\"address-form\">";
                strVar += "          <div class=\"form-valide\">";
                strVar += "            <div class=\"form-group\">";
                strVar += "            <div class=\"form-group \"><center>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Username: " + data.username + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Address: " + data.address + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Name: " + data.name + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Phone: " + data.phone + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> National: " + data.national + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Passport/ID: " + data.passport_number_id + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Token Lock: " + data.token_lock + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Token UnLock: " + data.token_unlock + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Total Token: " + data.total_token + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Total Eth: " + data.total_eth + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Bonus VIP preIco: " + data.bonus_vip_preIco + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Bonus VIP Ico: " + data.bonus_vip_ico + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Total Bonus Referal: " + data.total_bonus_referal + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> Amount member referal: " + data.amount_member_referal + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> total_bonus_airdrop: " + data.total_bonus_airdrop + "<\/p>";
                strVar += "              <p class=\"\" for=\"val-number-kyc\"> parent: " + data.parent + "<\/p>";
                strVar += "            <\/center><\/div>";
                strVar += "          <\/div>";
                strVar += "        <\/div>";
                strVar += "      <\/div>";
                strVar += "    <\/div>";
                strVar += "  <\/div>";

                $.magnificPopup.open({
                    items: {
                        src: strVar,
                        type: 'inline',
                        removalDelay: 500,

                    }, showCloseBtn: false, closeOnBgClick: true
                });
            }
        }
    });
}
function myfunction(id, cmd, type) {
    var source = "";
    switch (cmd) {
        case 0:
            var strVar = "";
            strVar += "<div class=\"col-lg-4 col-md-8 col-sm-12 col-xs-12   form-pad divcenter\">";
            strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"
            strVar += "<div class=\"alert address-form mfp-newspaper\">";
            strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
            strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
            strVar += "   <center><h4 class=\"alert-heading\"> Reset Password<\/h4>";
            strVar += '     <p>New password will be sent to account\'s email. Please checked account\'s email<\/p>';
            strVar += '<\/center><\/div>'
            strVar += "        <div class=\"address-form\">";
            strVar += "          <div class=\"form-valide\">";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='input_password_reset_" + id + "'>Password<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='password' class='form-control' id='input_password_reset_" + id + "' placeholder=\"Enter your password to confirm\"></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"form-group\">";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad divcenter\">";
            strVar += "                 <center><button type='button' class='btn btn-primary' onclick='reset_account(" + id + ",\"" + type + "\")'>Yes</button><button type='button' class='btn btn-default' data-dismiss='modal' onclick='$.magnificPopup.instance.close()'>Cancel</button>";
            strVar += "              <\/center><\/div>";
            strVar += "            <\/div>";
            strVar += "          <\/div>";
            strVar += "        <\/div>";
            strVar += "      <\/div>";
            strVar += "    <\/div>";
            strVar += "  <\/div>";
            break;
        case 1:
            var strVar = "";
            strVar += "<div class=\"col-lg-4 col-md-8 col-sm-12 col-xs-12   form-pad divcenter\">";
            strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"
            strVar += "<div class=\"alert address-form mfp-newspaper\">";
            strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
            strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
            strVar += "   <center><h4 class=\"alert-heading\"> Change status Lock/Unlock <\/h4>";
            strVar += '     <p>Node: Lock/Unlock for account. If account is locked that will not be logIn<\/p>';
            strVar += '<\/div>'
            strVar += "        <div class=\"address-form\">";
            strVar += "          <div class=\"form-valide\">";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='input_password_lock_" + id + "'>Password<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='password' placeholder='password to confirm!' class='form-control' id='input_password_lock_" + id + "'></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            if (type != "Normal") {
                strVar += "            <div class=\"form-group row\">";
                strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='input_privateKey_lock_" + id + "'>Private Key<\/label>";
                strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
                strVar += "                 <input type='password' placeholder='private key to confirm!' class='form-control' id='input_privateKey_lock_" + id + "'></input>";
                strVar += "              <\/div>";
                strVar += "            <\/div>";
            }
            strVar += "            <div class=\"form-group\">";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad divcenter\">";
            strVar += "                 <center><button type='button' class='btn btn-primary' onclick='lock_account(" + id + ",\"" + type + "\")'>Yes</button>";
            strVar += "                 <button type='button' class='btn btn-default' data-dismiss='modal' onclick='$.magnificPopup.instance.close()'>Cancel</button>";
            strVar += "              <\/center><\/div>";
            strVar += "            <\/div>";
            strVar += "          <\/div>";
            strVar += "        <\/div>";
            strVar += "      <\/div>";
            strVar += "    <\/div>";
            strVar += "  <\/div>";

            break;
        case 2:
            var strVar = "";
            strVar += "<div class=\"col-lg-4 col-md-8 col-sm-12 col-xs-12   form-pad divcenter\">";
            strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"
            strVar += "<div class=\"alert address-form mfp-newspaper\">";
            strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
            strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
            strVar += "   <center><h4 class=\"alert-heading\"> Cancel KYC<\/h4>";
            strVar += '     <p>Node: Cancel KYC of account and this account can\'t not buy token in ICO<\/p>';
            strVar += '<\/div>'
            strVar += "        <div class=\"address-form\">";
            strVar += "          <div class=\"form-valide\">";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='input_password_cancel_kyc_" + id + "'>Password<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='password' placeholder='password to confirm!' class='form-control' id='input_password_cancel_kyc_" + id + "'></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='input_privateKey_cancel_kyc_" + id + "'>Private Key<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='password' placeholder='private key to confirm!' class='form-control' id='input_privateKey_cancel_kyc_" + id + "'></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"form-group\">";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad divcenter\">";
            strVar += "                 <center><button type='button' class='btn btn-primary' onclick='cancelKYC(" + id + ",\"" + type + "\")'>Yes</button>";
            strVar += "                 <button type='button' class='btn btn-default' data-dismiss='modal' onclick='$.magnificPopup.instance.close()'>Cancel</button>";
            strVar += "              <\/center><\/div>";
            strVar += "            <\/div>";
            strVar += "          <\/div>";
            strVar += "        <\/div>";
            strVar += "      <\/div>";
            strVar += "    <\/div>";
            strVar += "  <\/div>";
            break;
        case 3:
            var strVar = "";
            strVar += "<div class=\"col-lg-4 col-md-8 col-sm-12 col-xs-12   form-pad divcenter\">";
            strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"
            strVar += "<div class=\"alert address-form mfp-newspaper\">";
            strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
            strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
            strVar += "   <center><h4 class=\"alert-heading\"> Send Bonus Referal<\/h4>";
            strVar += '     <p>Node: Send bonus to this account<\/p>';
            strVar += '<\/div>'
            strVar += "        <div class=\"address-form\">";
            strVar += "          <div class=\"form-valide\">";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='val_gasPrice_" + id + "'>GasPrice<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='number' placeholder='Enter a gasPrice!' class='form-control' id='val_gasPrice_" + id + "' min='1' max='50' value='10'></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='input_password_send_bonus_" + id + "'>Password<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='password' placeholder='password to confirm!' class='form-control' id='input_password_send_bonus_" + id + "'></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='input_privateKey_send_bonus_" + id + "'>Private Key<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='password' placeholder='private key to confirm!' class='form-control' id='input_privateKey_send_bonus_" + id + "'></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"form-group\">";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad divcenter\">";
            strVar += "                 <center><button type='button' class='btn btn-primary' onclick='sendBonusReferal(" + id + ",\"" + type + "\")'>Yes</button>";
            strVar += "                 <button type='button' class='btn btn-default' data-dismiss='modal' onclick='$.magnificPopup.instance.close()'>Cancel</button>";
            strVar += "              <\/center><\/div>";
            strVar += "            <\/div>";
            strVar += "          <\/div>";
            strVar += "        <\/div>";
            strVar += "      <\/div>";
            strVar += "    <\/div>";
            strVar += "  <\/div>";
            break;
        case 4:
            var strVar = "";
            strVar += "<div class=\"col-lg-4 col-md-8 col-sm-12 col-xs-12   form-pad divcenter\">";
            strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"
            strVar += "<div class=\"alert address-form mfp-newspaper\">";
            strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
            strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
            strVar += "   <center><h4 class=\"alert-heading\"> Send Airdrop<\/h4>";
            strVar += '     <p>Node: Send bonus to this account<\/p>';
            strVar += '<\/div>'
            strVar += "        <div class=\"address-form\">";
            strVar += "          <div class=\"form-valide\">";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='val_gasPrice_" + id + "'>GasPrice<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='number' placeholder='Enter a gasPrice!' class='form-control' id='val_gasPrice_" + id + "' min='1' max='50' value='10'></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='input_password_send_airdrop_" + id + "'>Password<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='password' placeholder='password to confirm!' class='form-control' id='input_password_send_airdrop_" + id + "'></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"form-group row\">";
            strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for='input_privateKey_send_airdrop_" + id + "'>Private Key<\/label>";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
            strVar += "                 <input type='password' placeholder='private key to confirm!' class='form-control' id='input_privateKey_send_airdrop_" + id + "'></input>";
            strVar += "              <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"form-group\">";
            strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad divcenter\">";
            strVar += "                 <center><button type='button' class='btn btn-primary' onclick='SendAirdrop(" + id + ",\"" + type + "\")'>Yes</button>";
            strVar += "                 <button type='button' class='btn btn-default' data-dismiss='modal' onclick='$.magnificPopup.instance.close()'>Cancel</button>";
            strVar += "              <\/center><\/div>";
            strVar += "            <\/div>";
            strVar += "          <\/div>";
            strVar += "        <\/div>";
            strVar += "      <\/div>";
            strVar += "    <\/div>";
            strVar += "  <\/div>";
            break;

    }
    $.magnificPopup.open({
        items: {
            src: strVar,
            type: 'inline',
            removalDelay: 500,

        }, showCloseBtn: false, closeOnBgClick: true
    });
}
function lock_account(id, type) {
    console.log('afd');
    if ($('#input_password_lock_' + id).val().length <= 0) {
        return false;
    }
    if (type != "Normal" && $('#input_privateKey_lock_' + id).val().length <= 20) {
        return false;
    }
    var data;
    if (type == "Normal") {
        data = {
            "id": id,
            "type": type,
            "password": md5($('#input_password_lock_' + id).val())
        }
    } else {
        data = {
            "id": id,
            "type": type,
            "password": md5($('#input_password_lock_' + id).val()),
            "key": $('#input_privateKey_lock_' + id).val()
        };
    }

    console.log(data);
    $.ajax({
        url: '/admin/lockaccount',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            $.magnificPopup.instance.close();
            notification(json.title, json.log);
            location.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function reset_account(id, type) {
    if ($('#input_password_reset_' + id).val().length <= 0) {
        return false;
    }

    data = {
        "id": id,
        "type": type,
        "password": md5($('#input_password_reset_' + id).val())
    };
    $.ajax({
        url: '/admin/resetpassword',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            $.magnificPopup.instance.close();
            notification(json.title, json.log);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function cancelKYC(id, type) {
    if ($('#input_password_cancel_kyc_' + id).val().length <= 0) {
        return false;
    }

    data = {
        "user_id": id,
        "type": type,
        "password": md5($('#input_password_cancel_kyc_' + id).val()),
        'private': $('#input_privateKey_cancel_kyc_' + id).val()
    };
    $.ajax({
        url: '/admin/cancel-kyc',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            $.magnificPopup.instance.close();
            notification(json.title, json.log);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function sendBonusReferal(id,type){
    data = {
        "user_id": id,
        "type": type,
        "password": md5($('#input_password_send_bonus_' + id).val()),
        'private': $('#input_privateKey_send_bonus_' + id).val(),
        'gasPrice': $('#val_gasPrice_'+id).val()
    };
    $.ajax({
        url: '/admin/send-bonus-one-user',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            $.magnificPopup.instance.close();
            if(!result.error){
                notification(json.title,json.log);
                location.reload();
            }else{
                notification(json.title,json.log);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function sendAirdrop(id,type){
    data = {
        "user_id": id,
        "type": type,
        "password": md5($('#input_password_send_airdrop_' + id).val()),
        'private': $('#input_privateKey_send_airdrop_' + id).val(),
        'gasPrice': $('#val_gasPrice_'+id).val()
    };
    $.ajax({
        url: '/admin/send-airdrop-one-user',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            $.magnificPopup.instance.close();
            if(!result.error){
                notification(json.title,json.log);
                location.reload();
            }else{
                notification(json.title,json.log);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function notification(title, content) {
    var strVar = "";
    strVar += "<div class=\"col-lg-4 col-md-8 col-sm-12 col-xs-12   form-pad divcenter\">";
    strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"
    strVar += "<div class=\"alert address-form mfp-newspaper\">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
    strVar += "   <center><h4 class=\"alert-heading\">" + title + "<\/h4>";
    strVar += '     <\/div>'
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";
    strVar += "            <div class=\"form-group\">";
    strVar += "              <center><p>" + content + "<\/p><\/center>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group\">";
    strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad divcenter\">";
    strVar += "                 <center><button type='button' class='btn btn-success' data-dismiss='modal' onclick='$.magnificPopup.instance.close()'>OK</button><\/center>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "          <\/div>";
    strVar += "        <\/div>";
    strVar += "      <\/div>";
    strVar += "    <\/div>";
    strVar += "  <\/div>";
    $.magnificPopup.open({
        items: {
            src: strVar,
            type: 'inline',
            removalDelay: 500,
            showCloseBtn: false
        }
    });
}

