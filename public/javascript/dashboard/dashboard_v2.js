$.ajax({
    url: '/dashboard_v2/dashboard-check',
    type: 'POST',
    async: false,
    success: function (result) {
        //check wallet 
        console.log(result.hasWallet)
        if (result.hasWallet) {


            //check need to update data infor
            $.ajax({
                url: "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + result.address_contract + "&address=" + result.address + "&tag=latest&apikey=YourApiKeyToken",
                type: 'GET',
                success: function (balance) {
                    console.log("balance = " + balance.result);
                    if (balance.message == "OK") {
                        loadDashboardData_v2(parseFloat(balance.result) / Math.pow(10, 18));
                    } else {
                        loadDashboardDataDefault_v2();
                    }
                }
            }).fail(function (xhr, status, errorThrown) {
                // alert( "Sorry, there was a problem!" );
                loadDashboardDataDefault();
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            });
        } else {
            //notify add wallet
            $('#loading-body').remove();
            $('#dashboard-body').hide();
            nowallet();
        }
    }
}).fail(function (xhr, status, errorThrown) {
    // alert( "Sorry, there was a problem!" );
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
});


//get inforwallet
function loadDashboardData_v2(balance) {
    console.log("loadDashboardData_v2 1")
    $.ajax({
        url: '/dashboard',
        type: 'POST',
        data: {
            balance: balance
        },
        async: false,
        success: function (result_v2) {

            console.log("loadDashboardData_v2 result_v2 = " + result_v2.isKYCed + "," + result_v2.address_token_lock + "," + result_v2.price_token_lock + "," + result_v2.bonus_lock);
            if (!result_v2.isError) {
                //wallet-address
                var strWalletAddress = "";
                strWalletAddress += "    <input id=\"wallet-address\" readonly=\"readonly\" value=\"" + result_v2.address + "\" data-clipboard-target=\"#link\" alt=\"Copy to clipboard\" style=\"padding-right:5px;padding-left:5px;margin:5px;margin-left:10px; width:auto\" onclick=\"copyClipboard(0)\" class=\"btn form-control border-input text-muted\"\/>";
                strWalletAddress += "    <img src=\"\/assets\/icon\/qr.png\" style=\"margin-top:10px\" height=\"30\" width=\"30\" type=\"button\" data-toggle=\"modal\"  onclick=\"myfunction(this);\"\/>";
                $('#wallet-address-2').html(strWalletAddress);

                //load title ico
                var strTitleIco = "";
                strTitleIco += "h1(style='margin:30px;font-family:')" + result_v2.title;

                //load funds raised ico
                loadFundsRaisedIco(result_v2.address_contract, result_v2.address_holder_eth, result_v2.total_eth_sold, result_v2.title);
                //processing ico
                loadProcessIco(result_v2.address_contract, result_v2.address_holder_eth);
                //button buy token
                console.log("result_v2.address_token_lock.tostring() = " + result_v2.address_token_lock)
                var strBuyToken = "";
                strBuyToken += "<div class=\"col-lg-3 offset-lg-3 col-md-4 offset-md-2 col-sm-12 col-xs-12\">";
                strBuyToken += "  <button style=\"width:100%;height:70px;margin:5px\" style='font-size:16px' class=\"btn btn-flat btn-dark\" onclick='showFormBuyToken(1," + result_v2.isKYCed + ",\"" + result_v2.address_token_lock + "\"," + result_v2.price_token_lock + "," + result_v2.bonus_lock + ")'>Buy Token Lock <\/br>(~" + convertNumberToString(Math.round(1 / result_v2.price_token_lock * 10) / 10) + " UNI\/ETH)<\/button>";
                strBuyToken += "<\/div>";
                strBuyToken += "<div class=\"col-lg-3 col-md-4 col-sm-12 col-xs-12\">";
                strBuyToken += "  <button style=\"width:100%;height:70px;margin:5px\" style='font-size:16px' class=\"btn btn-flat btn-dark\" onclick='showFormBuyToken(0," + result_v2.isKYCed + ",\"" + result_v2.address_token_unlock + "\"," + result_v2.price_token_unlock + "," + result_v2.bonus_unlock + ")'>Buy Token Unlock <\/br>(~" + convertNumberToString(Math.round(1 / result_v2.price_token_unlock * 10) / 10) + " UNI\/ETH)<\/button>";
                strBuyToken += "<\/div>";
                $('#buy-token').html(strBuyToken);
                //load infor tokens of account 
                var strInforToken = "";
                strInforToken += "<div class=\"col-lg-6 col-md-6 col-sm-12 col-xs-12\">";
                strInforToken += "  <div class=\"form-group\">";
                strInforToken += "    <label>Token lock<\/label>";
                strInforToken += "    <input type=\"text\" value=\"" + convertNumberToString(result_v2.token_lock) + " UNI\" readonly=\"readonly\" class=\"form-control\"\/>";
                strInforToken += "  <\/div>";
                strInforToken += "  <div class=\"form-group\">";
                strInforToken += "    <label>Token unlock<\/label>";
                strInforToken += "    <input type=\"text\" value=\"" + convertNumberToString(result_v2.token_unlock) + " UNI\" readonly=\"readonly\" class=\"form-control\"\/>";
                strInforToken += "  <\/div>";
                strInforToken += "  <div class=\"form-group\">";
                strInforToken += "    <label>Tatal token<\/label>";
                strInforToken += "    <input type=\"text\" value=\"" + convertNumberToString(result_v2.total_token) + " UNI\" readonly=\"readonly\" class=\"form-control\"\/>";
                strInforToken += "  <\/div>";
                strInforToken += "<\/div>";
                strInforToken += "<div class=\"col-lg-6 col-md-6 col-sm-12 col-xs-12\">";
                strInforToken += "  <div class=\"form-group\">";
                strInforToken += "    <label>Bonus Token<\/label>";
                strInforToken += "    <input type=\"text\" value=\"" + convertNumberToString(result_v2.bonus_token) + " UNI\" readonly=\"readonly\" class=\"form-control\"\/>";
                strInforToken += "  <\/div>";
                strInforToken += "  <div class=\"form-group\">";
                strInforToken += "    <label>Airdrop<\/label>";
                strInforToken += "    <input type=\"text\" value=\"" + convertNumberToString(result_v2.airdrop) + " UNI\" readonly=\"readonly\" class=\"form-control\"\/>";
                strInforToken += "  <\/div>";
                strInforToken += "  <div class=\"form-group\">";
                strInforToken += "    <label>Referal<\/label>";
                strInforToken += "    <input type=\"text\" value=\"" + convertNumberToString(result_v2.referal) + " UNI\" readonly=\"readonly\" class=\"form-control\"\/>";
                strInforToken += "  <\/div>";
                strInforToken += "<\/div>";
                $('#infor-user-token').html(strInforToken);
                $('#dashboard-body').show();
                $('#loading-body').remove();

            } else {
                console.log(result_v2.log);
                loadDashboardDataDefault_v2();
            }
        }
    }).fail(function (xhr, status, errorThrown) {
        // alert( "Sorry, there was a problem!" );
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    });
}

function loadDashboardDataDefault_v2() {
    console.log("loadDashboardDataDefault_v2");
    $('#dashboard-body').show();
    $('#loading-body').remove();
}

function nowallet() {
    var strVar = "";

    strVar += " <div class=\"col-lg-4 divcenter\">";
    strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"

    strVar += "<div class=\"alert address-form \">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close();window.location.href=\"/dashboard/wallet\"'>&times;<\/button>";
    strVar += "   <center><h4 class=\"alert-heading\"> Wallet Address!<\/h4></center>";
    strVar += "   <p>Note*: Please add wallet address to buy UNI token<\/p>";
    strVar += "</div>"
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-3 col-form-label\" for=\"val-add-address\">Address <\/label>";
    strVar += "              <div class=\"col-9\">";
    strVar += "                <input class=\"form-control\" id=\"val-add-address\" type=\"text\" name=\"new_address\" placeholder=\"Please enter your address wallet..\"\/>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-3 col-form-label\" for=\"val-confirm-password-add-address\">Password <\/label>";
    strVar += "              <div class=\"col-9\">";
    strVar += "                <input class=\"form-control\" id=\"val-confirm-password-add-address\" type=\"password\" name=\"password\" placeholder=\"Please enter password to confirm it!\"\/>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group\">";
    strVar += "              <div class=\"col-8 divcenter\">";
    strVar += "                <button class=\"btn btn-primary button-res\" type=\"submit\" onclick='addAddress()'>Submit<\/button>";
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
function addAddress() {
    $('.loading').css('display', 'block');
    var data = {
        new_address: $("#val-add-address").val(),
        password: md5($("#val-confirm-password-add-address").val())
    }
    $.ajax({
        url: '/dashboard/wallet-add-address',
        type: 'POST',
        data: data,
        success: function (res) {
            $.magnificPopup.instance.close();
            console.log(res.error);
            res = JSON.parse(res);
            $('.loading').css('display', 'none');
            if (res.error) {
                $.magnificPopup.open({
                    items: {
                        src: notify(0, res.log),
                        type: 'inline',
                        removalDelay: 500,

                    }, showCloseBtn: false
                });
            } else $.magnificPopup.open({
                items: {
                    src: notify(1, res.log),
                    type: 'inline',
                    removalDelay: 500,
                }, showCloseBtn: false, closeOnBgClick: false
            });
        }
    });
}

function notify(cmd, res) {
    var strVar_header = "";
    var strVar_Content = res
    if (cmd == 1) {
        strVar_header = "<center><h4 class=\"alert-heading\">Successful!<\/h4>";
    } else {
        strVar_header = "<center><h4 class=\"alert-heading\">Warning!<\/h4>";
    }

    var strVar = "";

    strVar += "  <div class=\"col-lg-4 divcenter\">";
    strVar += "<div class=\"alert address-form\">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"

    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close();window.location.href=\"/dashboard\"' >&times;<\/button>";
    strVar += strVar_header;

    strVar += "</center></div>"
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";
    strVar += "            <div class=\"form-group \"><center style='margin-top:20px'>";
    strVar += strVar_Content;
    strVar += "            <\/center><\/div>";
    strVar += "          <\/div>";
    strVar += "        <\/div>";
    strVar += "      <\/div>";
    strVar += "    <\/div>";
    strVar += "  <\/div>";

    return strVar;
}


function loadProcessIco(address_contract, address) {
    console.log("loadProcessIco 1 address = " + address);
    $.ajax({
        url: "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + address_contract + "&address=" + address + "&tag=latest&apikey=YourApiKeyToken",
        type: 'GET',

        success: function (procesICO) {
            console.log("loadProcessIco 2 = " + procesICO.result);
            if (procesICO.message == "OK") {
                procesICO.result = parseFloat(procesICO.result / Math.pow(10, 18) * 10) / 10;
                var value_time_cycle = Math.round(parseFloat((2450000000 - procesICO.result) / 24500000) * 100) / 100;
                console.log("value_time_cycle = " + value_time_cycle);
                var strProcess = "";
                strProcess += "<span id=\"cur2\" style=\"width: " + value_time_cycle + "%;position: relative\" class=\"cur\">";
                strProcess += "<\/span>";
                strProcess += "  <span id=\"cur3\" style=\"position: absolute;margin-top:-25px;font-size:15px;color:white;white-space: nowrap;\">" + value_time_cycle + "%<\/span>";

                $("#processing-buy-token").html(strProcess);
                var cur2 = $('#cur2');
                var cur3 = $('#cur3');
                cur2.data("origWidth", cur2.width()).width(0).animate({
                    width: cur2.data("origWidth"),
                }, 3000);
                console.log(cur2.data("origWidth"));
                cur3.data(cur2.data("origWidth"), 20).width(0).animate({
                    marginLeft: '+=' + cur2.data("origWidth") / 2,
                }, 3000);
            }
        }
    }).fail(function (xhr, status, errorThrown) {
        // alert( "Sorry, there was a problem!" );
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    });
}

async function loadFundsRaisedIco(address_contract, address_holder, total_eth_sold, title) {
    console.log("loadFundsRaisedIco 1")
    $.ajax({
        url: "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + address_contract + "&address=" + address_holder + "&tag=latest&apikey=YourApiKeyToken",
        type: 'GET',

        success: function (result) {
            console.log("loadFundsRaisedIco 2")
            if (result.message == "OK") {
                var strTitle = "";
                strTitle += "  <h1 style=\"margin:30px;\">" + title + "<\/h1>";
                var strInforIco = "";
                strInforIco += "<h3 style=\"margin:20px\">FUNDS RAISED: $160,700,000.890<\/h3><span style=\" display: table; margin-left: auto;margin-right: auto;\" class=\"input-group input-group-center\">";
                strInforIco += "  <h3>ETH: " + convertNumberToString(total_eth_sold);
                strInforIco += "<a href='https://etherscan.io/token/" + address_contract + "'><button style=\"font-size:10px;padding:0;padding-right:5px;padding-left:5px;height:22px;margin:10px\" class=\"btn btn-primary\">etherscan<\/button><\/a>";
                strInforIco += "  <\/h3><\/span><span style=\" display: table; margin-left: auto;margin-right: auto;\" class=\"input-group input-group-center\">";
                strInforIco += "  <h3>~ UNI: " + convertNumberToString(Math.round((2450000000 - parseFloat(result.result) / Math.pow(10, 18)) * 10) / 10);
                strInforIco += "  <a href='https://etherscan.io/address/" + address_holder + "#internaltx'><button style=\"font-size:10px;padding:0;padding-right:5px;padding-left:5px;height:22px;margin:10px\" class=\"btn btn-primary\">etherscan<\/button><\/a>";
                strInforIco += "  <\/h3><\/span>";

                $('#title').html(strTitle);
                $('#infor-ico').html(strInforIco);
                $('#loading-infor-ico').remove();
                loadingTotalTokenSales(address_contract, address_holder);

            }
        }
    }).fail(function (xhr, status, errorThrown) {
        // alert( "Sorry, there was a problem!" );
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    });
}
function convertNumberToString(str) {
    str = str + "";
    var str_tmp = "";
    var strList = str.split(".", 2);
    var str_head = "";
    if (strList.length == 2) {
        str_head = strList[0];
        str_tmp = '.' + strList[1];
        //add to footer
    } else if (strList.length == 1) {
        str_head = strList[0];
    }
    var j = 0;
    for (var i = str_head.length - 1; i >= 0; i--) {
        j++;
        str_tmp = str_head.charAt(i).toString() + str_tmp;
        if (j % 3 == 0 && i > 0) {
            j = 0;
            str_tmp = ' ' + str_tmp;
        }
    }
    return str_tmp;
}

async function loadingTotalTokenSales(address_contract, address_holder) {
    $.ajax({
        url: "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + address_contract + "&address=" + address_holder + "&tag=latest&apikey=YourApiKeyToken",
        type: 'GET',
        success: function (result) {
            if (result.message == "OK") {
                var strTotalUNI = "  <h3 id='total-uni-sold'>UNI: " + convertNumberToString(Math.round(parseFloat(result.result) / Math.pow(10, 18) * 10) / 10) + "<\/h3>";
                $('#total-uni-sold').html(strTotalUNI);
            }
        }
    }).fail(function (xhr, status, errorThrown) {
        // alert( "Sorry, there was a problem!" );
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    });
}

function showFormBuyToken(type, isKYCed, address, price_token, bonus) {
    //check KYC
    if (isKYCed) {
        //show form buy token
        var strFormBuyToken = "";
        strFormBuyToken += "<center><div class=\"col-lg-6 col-md-10  col-sm-12 alert address-form divcenter\">";
        strFormBuyToken += "            <div style='border-bottom: 1px solid #e9ecef'>";
        strFormBuyToken += "                <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times<\/button>";
        strFormBuyToken += "                <center>";
        strFormBuyToken += "                    <h4 class=\"alert-heading\">" + (type == 1 ? "BUY TOKEN LOCK" : "BUY TOKEN UNLOCK") + "<\/h4>";
        strFormBuyToken += "                <\/center>";
        strFormBuyToken += "                <span>*Please send eth to the address below that to buy Uni " + (type == 1 ? 'locked' : 'unlocked') + " of tokens<\/span><\/br>";
        strFormBuyToken += "                <span style=>*Please click";
        strFormBuyToken += "                    <a href='/dashboard/' style=\"color:rgba(78, 236, 30, 0.842); font-style: italic;font-weight:bold\">Information and bonus<\/a> to understand about UNI " + (type == 1 ? 'locked' : 'unlocked') + " <\/span>";
        strFormBuyToken += "            <\/div>";
        strFormBuyToken += "            <div class=\"address-form\">";
        strFormBuyToken += "                <div class=\"form-valide\" style='margin-bottom:10px;'>";
        strFormBuyToken += "                        <center>";
        strFormBuyToken += "                    <div class=\"form-group \" style='margin-top:10px'>";
        strFormBuyToken += "                            <p>";
        strFormBuyToken += "                            <img class='divcenter qr-phone' src='https:\/\/chart.googleapis.com\/chart?chs=166x166&chld=L|0&cht=qr&chl=" + address + "'";
        strFormBuyToken += "                                alt=\"\">";
        strFormBuyToken += "                            <\/img>";
        strFormBuyToken += "                            <\/p>";
        strFormBuyToken += "                            <p>" + (address) + "<\/p>";
        strFormBuyToken += "                    <\/div>";
        strFormBuyToken += "                        <\/center>";

        strFormBuyToken += "                <\/div>";
        strFormBuyToken += "            <\/div>";
        strFormBuyToken += "            <div>";
        strFormBuyToken += "                <ul>";
        strFormBuyToken += "                    <li>";
        strFormBuyToken += "                        1 ETH = " + convertNumberToString(Math.round(1 / price_token * 10) / 10) + " UNI";
        strFormBuyToken += "                    <\/li>";
        if (bonus > 0) {
            strFormBuyToken += "                    <li>";
            strFormBuyToken += "                        Bonus " + bonus + "% immedially!";
            strFormBuyToken += "                    <\/li>";
        }
        strFormBuyToken += "                    <li>";
        strFormBuyToken += "                    <\/li>";
        strFormBuyToken += "                <\/ul>";
        strFormBuyToken += "            <\/div>";
        strFormBuyToken += "        <\/div><\/center>";

        $.magnificPopup.open({
            delegate: 'button',
            items: {
                src: strFormBuyToken,
                type: 'inline',
            }, showCloseBtn: false,

        });
    } else {
        //show notify
        var strVar_header = "<center><h4 class=\"alert-heading\">IMPORTANCE!<\/h4>";
        var strVar_Content = '<center><h5 class=\"alert-heading\">You need kyc to buy token</h5></center>';
        var strVar = "";

        strVar += "  <div class=\"col-lg-4 divcenter\">";
        strVar += "<div class=\"alert address-form\">";
        strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"

        strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close();' >&times;<\/button>";
        strVar += strVar_header;

        strVar += "</center></div>"
        strVar += "        <div class=\"address-form\">";
        strVar += "          <div class=\"form-valide\">";
        strVar += "            <div class=\"form-group \">";

        strVar += strVar_Content;
        strVar += "            <\/div>";
        strVar += "            <div class=\" \">";
        strVar += "              <center>";
        strVar += "                <button class=\"btn btn-primary\" onclick='$.magnificPopup.instance.close();window.location.href=\"/dashboard/kyc\"'>Redirect<\/button>";
        strVar += "            <\/center><\/div>";

        strVar += "          <\/div>";
        strVar += "        <\/div>";
        strVar += "      <\/div>";
        strVar += "    <\/div>";
        strVar += "  <\/div>";
        $.magnificPopup.open({
            delegate: 'button',
            items: {
                src: strVar,
                type: 'inline',
            }, showCloseBtn: false,

        });
    }


}


