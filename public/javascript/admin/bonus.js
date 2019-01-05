$(document).ready(function () {

    $.ajax({
        url: '/admin/bonus-ico',
        type: 'post',
        dataType: 'json',
        success: function (json) {
            console.log(json);
            var strListTransaction;
            if (!json.error) {
                var strVar = "";
                strVar += "<h2>Send bonus + referal in preICO and ICO<\/h2>";
                strVar += "  <p>Amount of account: " + json.amount_user + "<\/p>";
                strVar += "  <p>Amount of UNI for bonus: " + json.total_bonus_referal_ico + "<\/p>";
                strVar += "  <button type=\"button\" id=\"send-bonus-referal\" onclick='formPasswordAndPrivateKey(1)' class=\"btn btn-flat btn-success\">Send bonus in preICO and ICO<\/button>";
                console.log("asfdasdf");
                $('#referal_ico').html(strVar);
                for (var i = 0; i < json.listTrans.length; i++) {
                    strListTransaction += "<td>";
                    strListTransaction += i + 1;
                    strListTransaction += "<\/td>";
                    strListTransaction += "<td>";
                    strListTransaction += json.listTrans[i].hash;
                    strListTransaction += "<\/td>";
                    strListTransaction += "<td>";
                    strListTransaction += json.listTrans[i].status;
                    strListTransaction += "<\/td>";
                    strListTransaction += "<td>";
                    strListTransaction += json.listTrans[i].fee;
                    strListTransaction += "<\/td>";
                }
            } else {
                //show err
                console.log(json.error);
                strListTransaction = "<center>No Transaction<\/center>";

            }
            $("#list-trans-referal > tbody").append(strListTransaction);
            $('#list-trans-referal').DataTable({
                dom: 'Bfrtip',
                buttons: []
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

});
$(document).ready(function () {

    $.ajax({
        url: '/admin/bonus-airdrop',
        type: 'post',
        dataType: 'json',
        success: function (json) {
            console.log(json);
            if (!json.error) {
                var strAirdrop = "";
                strAirdrop += "<h2>Send bonus for Airdrop<\/h2>";
                strAirdrop += "  <p>Amount of account: " + json.amount_user + "<\/p>";
                strAirdrop += "  <p>Amount of UNI for bonus: " + json.total_bonus_airdrop + "<\/p>";
                strAirdrop += "  <button type=\"button\" id='send-bonus-airdrop' onclick='formPasswordAndPrivateKey(2)' class=\"btn btn-flat btn-success\">Send bonus for Airdrop<\/button>";
                $('#bonus_airdrop').html(strAirdrop);
                for (var i = 0; i < json.listTrans.length; i++) {
                    strListTransaction += "<td>";
                    strListTransaction += i + 1;
                    strListTransaction += "<\/td>";
                    strListTransaction += "<td>";
                    strListTransaction += json.listTrans[i].hash;
                    strListTransaction += "<\/td>";
                    strListTransaction += "<td>";
                    strListTransaction += json.listTrans[i].status;
                    strListTransaction += "<\/td>";
                    strListTransaction += "<td>";
                    strListTransaction += json.listTrans[i].fee;
                    strListTransaction += "<\/td>";
                }
            } else {
                //show err
                console.log(json.error);
                strListTransaction = "<center>No Transaction<\/center>";
            }
            $("#list-trans-airdrop > tbody").append(strListTransaction);
            $('#list-trans-airdrop').DataTable({
                dom: 'Bfrtip',
                buttons: []
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

});



function formPasswordAndPrivateKey(type) {
    var strVar = "";

    strVar += " <div class=\"col-lg-4 divcenter\">";
    strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"

    strVar += "<div class=\"alert address-form \">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
    strVar += "   <center><h4 class=\"alert-heading\"> Confirm Send Bonus!<\/h4></center>";
    strVar += "   <p>Note*: Please add number of address wallet to create transaction.<\/p>";
    strVar += "</div>"
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-3 col-form-label\" for=\"val-max\">Number max/time <\/label>";
    strVar += "              <div class=\"col-9\">";
    strVar += "                <input class=\"form-control\" id=\"val-max\" type=\"number\" name=\"val-max\" min=\"1\" value=\"10\" max=\"50\" required />";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-3 col-form-label\" for=\"val-gasPrice\">GasPrice <\/label>";
    strVar += "              <div class=\"col-9\">";
    strVar += "                <input class=\"form-control\" id=\"val-gasPrice\" type=\"number\" name=\"password\" min=\"1\" value=\"10\" max=\"50\" required />";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-3 col-form-label\" for=\"val-password\">Password <\/label>";
    strVar += "              <div class=\"col-9\">";
    strVar += "                <input class=\"form-control\" id=\"val-password\" type=\"password\" name=\"password\" required placeholder=\"Please enter your password..\"\/>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-3 col-form-label\" for=\"val-confirm-key-send-bonus\">Private Key <\/label>";
    strVar += "              <div class=\"col-9\">";
    strVar += "                <input class=\"form-control\" id=\"val-confirm-key-send-bonus\" type=\"password\" name=\"password\" required placeholder=\"Please enter private key!\"\/>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group\">";
    strVar += "              <div class=\"col-8 divcenter\">";
    if (type == 1) {
        strVar += "                <button class=\"btn btn-primary button-res\" type=\"submit\" onclick='sendBonus()'>Submit<\/button>";
    } else {
        if (type == 2) {
            strVar += "                <button class=\"btn btn-primary button-res\" type=\"submit\" onclick='sendAirdrop()'>Submit<\/button>";
        }
    }
    strVar += "                <button class=\"btn btn-primary\" onclick='$.magnificPopup.instance.close()'>Close<\/button>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "          <\/div>";
    strVar += "        <\/div>";
    strVar += "      <\/div>";
    strVar += "    <\/div>";
    strVar += "  <\/div>";
    strVar += "<\/div></center>";

    $.magnificPopup.open({
        items: {
            src: strVar,
            type: 'inline',

        }, showCloseBtn: false, closeOnBgClick: false
    });
}

function sendBonus() {
    // $('.loading').css('display','block');
    var data = {
        key: $("#val-confirm-key-send-bonus").val(),
        password: md5($("#val-password").val()),
        max: $("#val-max").val(),
        gasPrice: $("#val-gasPrice").val()
    }
    $.ajax({
        url: '/admin/send-bonus',
        type: 'POST',
        data: data,
        success: function (result) {
            $.magnificPopup.instance.close();
            if(!result.error){
                notification(json.title,json.log);
                location.reload();
            }else{
                notification(json.title,json.log);
            }
        }
    });
}

function sendAirdrop() {
    // $('.loading').css('display','block');
    var data = {
        key: $("#val-confirm-key-send-bonus").val(),
        password: md5($("#val-password").val()),
        max: $("#val-max").val(),
        gasPrice: $("#val-gasPrice").val()
        
    }
    $.ajax({
        url: '/admin/send-airdrop',
        type: 'POST',
        data: data,
        success: function (result) {
            $.magnificPopup.instance.close();
            if(!result.error){
                notification(json.title,json.log);
                location.reload();
            }else{
                notification(json.title,json.log);
            }
        }
    });
}


$("#send-bonus-referal").click(function () {
    console.log("asfsad");
    formPasswordAndPrivateKey(1);
});

$("#send-bonus-airdrop").click(function () {
    formPasswordAndPrivateKey(2);
});



function notification(title, content) {
    var strVar = "";
    strVar += "<div class=\"col-lg-4 col-md-8 col-sm-12 col-xs-12   form-pad divcenter\">";
    strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"
    strVar += "<div class=\"alert address-form mfp-newspaper\">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
    strVar += "   <center><h4 class=\"alert-heading\">"+title+"<\/h4>";
    strVar += '     <\/div>'
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";
    strVar += "            <div class=\"form-group\">";
    strVar += "              <center><p>"+content+"<\/p><\/center>";
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