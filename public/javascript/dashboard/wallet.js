//format string tx_hash
function formatTxHash2(str) {
    console.log("str= " + str);
    if (str != null && str.length > 50) {
        var str1 = str.substring(0, 35);
        var str2 = str.substring(str.length - 8, str.length - 1);
        str = str1.concat("...", str2);
    }
    return str;
}

console.log("asfdasf")

$.ajax({
    url: '/dashboard/dashboard-check',
    type: 'POST',
    success: function (result) {
        if (result.wallet) {
            console.log(result);
            $('#interface-wallet-1').css("display", "none");
            $('#interface-wallet-2').css("display", "block");
            $.ajax({
                url: "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + result.address_contract + "&address=" + result.address + "&tag=latest&apikey=YourApiKeyToken",
                type: 'GET',
                success: function (balance) {
                    console.log("balance = " + balance.result);
                    if (balance.message == "OK") {
                        loadWalletData(parseFloat(balance.result) / Math.pow(10, 18));
                    } else {
                        loadWalletDataDefault();
                    }
                }
            }).fail(function (xhr, status, errorThrown) {
                // alert( "Sorry, there was a problem!" );
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            });
        } else {
            $('#interface-wallet-1').css("display", "block");
            $('#interface-wallet-2').css("display", "none");
        }
    }
}).fail(function (xhr, status, errorThrown) {
    // alert( "Sorry, there was a problem!" );
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
});

function loadWalletDataDefault() {
    //show address wallet
    $('.address-wallet').html("Address: " + result.wallet.address);

    //show balance
    //uni
    var strBalanceUni = "";
    strBalanceUni += "<div class=\"col-lg-6\"><span style=\"font-size: 40px\"> " + 0 + "<\/span><span style=\"font-size: 16px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;\"> (Available) <\/span><\/div>";
    strBalanceUni += "<div class=\"col-lg-6 text-right button-responsive\"><span style=\"font-size: 40px\">" + 0 + "<\/span><span style=\"font-size: 16px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;\"> (Locked)<\/span><\/div>";
    $('#balance-uni').html(strBalanceUni);
    //eth
    var strBalanceEth = "";
    strBalanceEth += "<div class=\"col-lg-6\"><\/div>";
    $('#balance-eth').html(strBalanceEth);

    var strListTranUni = "";
    strListTranUni += "<tr>";
    strListTranUni += "  <td colspan=\"6\"><center>" + "<span class=\"text-muted\">No Transaction<\/span>" + "<\/center><\/td>";
    strListTranUni += "<\/tr>";
    $("#list-tran-uni").html(strListTranUni);
}

function loadWalletData(balance) {
    $.ajax({
        url: '/dashboard/wallet',
        type: 'POST',
        data: {
            balance: balance
        },
        success: function (result) {
            if (!result.error && result.wallet != null) {
                //show address wallet
                $('.address-wallet').html("Address: " + result.wallet.address);

                //show balance
                //uni
                var strBalanceUni = "";
                strBalanceUni += "<div class=\"col-lg-6\"><span style=\"font-size: 40px\"> " + convertNumberToString(Math.round(result.amount_token_unlock * 10) / 10) + " UNI<\/span><span style=\"font-size: 16px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;\"> (Available)<\/span><\/div>";
                strBalanceUni += "<div class=\"col-lg-6 text-right button-responsive\"><span style=\"font-size: 40px\">" + convertNumberToString(result.amount_token_lock) + " UNI<\/span><span style=\"font-size: 16px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;\"> (Locked)<\/span><\/div>";
                $('#balance-uni').html(strBalanceUni);
                //eth
                var strBalanceEth = "";
                strBalanceEth += "<div class=\"col-lg-6\"><span style=\"font-size: 40px\">" + convertNumberToString(result.amount_eth) + "<\/span><span style=\"font-size: 16px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;\"> <\/div>";
                $('#balance-eth').html(strBalanceEth);

                //qr code
                var src_qrcode = "<center><img src=\"https://chart.googleapis.com/chart?chs=300x300&chf=bg,s,FFFFFF00&cht=qr&choe=UTF-8&&chl=bitcoin:" + result.wallet.address + "\" alt=\"" + result.wallet.address + "\"><\/img><\/center>";
                src_qrcode += "<p><center>" + result.wallet.address + "<\/center><\/p>";
                $("#qr_code").val(result.wallet.address);
                // $('#src_qrcode').html(src_qrcode);

                $.ajax({
                    url: "https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x531de803d68f3ead1d2a035d5afd1ba8f1c1615d&address=" + result.wallet.address + "&page=1&offset=10&sort=desc&apikey=YourApiKeyToken",
                    type: 'GET',
                    data: {

                    },
                    success: function (result2) {
                        console.log(result2);
                        if (result2.message != "OK") {
                            console.log(result2);
                            strListTranUni += "<tr>";
                            strListTranUni += "  <td colspan=\"6\"><center>" + "<span class=\"text-muted\">No Transaction<\/span>" + "<\/center><\/td>";
                            strListTranUni += "<\/tr>";
                            $("#list-tran-uni").html(strListTranUni);

                        } else {
                            var strListTranUni = "";
                            var strListTranEth = "";
                            var moment = new Date();
                            var i = 0;
                            console.log(result2.result);

                            //list transaction uni
                            if (result2.result.length > 0) {
                                $("#list-tran-uni").html(strListTranUni);
                                result2.result.forEach(element => {
                                    strListTranUni += "<tr>";
                                    strListTranUni += "  <td>" + (++i) + " <\/td>";
                                    strListTranUni += "  <td><a href='https://etherscan.io/tx/" + element.hash + "' target='_blank'>" + formatTxHash2(element.hash) + "<\/a><\/td>";
                                    strListTranUni += "  <td>" + new Date(element.timeStamp * 1000).toUTCString() + "<\/td>";
                                    console.log("element.from = "+element.from);
                                    console.log("result.ac_token_unibot_holder = "+result.ac_token_unibot_holder);

                                    var type = ((element.from == result.ac_token_unibot_holder) ? "ICO" : (element.from == result.wallet.address ? "Withdraw" : "Deposit"));
                                    strListTranUni += "  <td>" + type + "<\/td>";
                                    strListTranUni += "  <td>" + "Completed" + "<\/td>";
                                    strListTranUni += "  <td>" + (type=="ICO" || type == "Deposit" ? "+ " : "- ") + Math.round(parseFloat(element.value) / Math.pow(10, 18) * 1000) / 1000 + " UNI<\/td>";
                                    strListTranUni += "<\/tr>";

                                    $("#list-tran-uni").append(strListTranUni);
                                    strListTranUni = "";
                                });
                            } else {
                                strListTranUni += "<tr>";
                                strListTranUni += "  <td colspan=\"6\"><center>" + "<span class=\"text-muted\">No Transaction<\/span>" + "<\/center><\/td>";
                                strListTranUni += "<\/tr>";
                                $("#list-tran-uni").html(strListTranUni);
                            }
                        }
                        $('.loading').remove();
                    }
                }).fail(function (xhr, status, errorThrown) {
                    // alert( "Sorry, there was a problem!" );
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                });
                $.ajax({
                    url: "https://api.etherscan.io/api?module=account&action=txlist&address="+ result.wallet.address +"&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=YourApiKeyToken",
                    type: 'GET',
                    data: {

                    },
                    success: function (listTransEth) {
                        if (listTransEth.message != "OK") {
                            console.log(listTransEth);
                            strListTranUni += "<tr>";
                            strListTranUni += "  <td colspan=\"6\"><center>" + "<span class=\"text-muted\">No Transaction<\/span>" + "<\/center><\/td>";
                            strListTranUni += "<\/tr>";
                            $("#list-tran-eth").html(strListTranUni);

                        } else {
                            var strListTranUni = "";
                            var strListTranEth = "";
                            var moment = new Date();
                            var i = 0;
                            console.log(listTransEth.result);

                            //list transaction uni
                            if (listTransEth.result.length > 0) {
                                $("#list-tran-eth").html(strListTranUni);
                                listTransEth.result.forEach(element => {
                                    strListTranUni += "<tr>";
                                    strListTranUni += "  <td>" + (++i) + " <\/td>";
                                    strListTranUni += "  <td><a href='https://etherscan.io/tx/" + element.hash + "' target='_blank'>" + formatTxHash2(element.hash) + "<\/a><\/td>";
                                    strListTranUni += "  <td>" + new Date(element.timeStamp * 1000).toUTCString() + "<\/td>";
                                    var type = (element.to == result.ac_token_lock || element.to == result.ac_token_unlock) ? "ICO" : (element.from == result.wallet.address ? "Withdraw" : "Deposit");
                                    strListTranUni += "  <td>" + type + "<\/td>";
                                    strListTranUni += "  <td>" + "Completed" + "<\/td>";
                                    strListTranUni += "  <td>" + (type == "ICO" || type == "Deposit" ? "+ " : "- ") + Math.round(parseFloat(element.value) / Math.pow(10, 18) * 1000) / 1000 + " ETH<\/td>";
                                    strListTranUni += "<\/tr>";

                                    $("#list-tran-eth").append(strListTranUni);
                                    strListTranUni = "";
                                });
                            } else {
                                strListTranUni += "<tr>";
                                strListTranUni += "  <td colspan=\"6\"><center>" + "<span class=\"text-muted\">No Transaction<\/span>" + "<\/center><\/td>";
                                strListTranUni += "<\/tr>";
                                $("#list-tran-eth").html(strListTranUni);
                            }
                        }
                        $('#loading-list-tran-eth').remove();
                    }
                }).fail(function (xhr, status, errorThrown) {
                    // alert( "Sorry, there was a problem!" );
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                });
            } else {
                loadWalletDataDefault();
            }
        }
    }).fail(function (xhr, status, errorThrown) {
        // alert( "Sorry, there was a problem!" );
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    });
}




$("#add_address").click(function () {
    nowallet();
});
function nowallet() {
    var strVar = "";

    strVar += " <div class=\"col-lg-4 divcenter\">";
    strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"

    strVar += "<div class=\"alert address-form \">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
    strVar += "   <center><h4 class=\"alert-heading\"> Wallet Address!<\/h4></center>";
    strVar += "   <p>Note*: Please add address wallet to views transaction of your address.<\/p>";
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

function response(res) {
    $.magnificPopup.instance.close();
    if (res == 1)
        location.reload();
}


function updateAddress() {
    $('.loading').css('display', 'block');
    var data = {
        new_address: $("#val-update-address").val(),
        password: md5($("#val-confirm-password-update-address").val())
    }
    console.log(data);
    $.ajax({
        url: '/dashboard/wallet-change-address',
        type: 'POST',
        data: data,
        success: function (result) {
            $.magnificPopup.instance.close()
            $('.loading').css('display', 'none');
            result = JSON.parse(result);
            if (result.error) {
                $.magnificPopup.open({
                    items: {
                        src: notify(2, 0),
                        type: 'inline',
                        removalDelay: 500,

                    }, showCloseBtn: false, closeOnBgClick: false,
                    callbacks: {
                        beforeOpen: function () {
                            $(this).mainClass = $(this).data('effect')
                        }
                    }
                });

            } else $.magnificPopup.open({
                items: {
                    src: notify(2, 1),
                    type: 'inline',
                    removalDelay: 500,

                }, showCloseBtn: false, closeOnBgClick: false,
                callbacks: {
                    beforeOpen: function () {
                        $(this).mainClass = $(this).data('effect')
                    }
                }
            });
        }
    });
}
function deposit() {
    var strVar = "";

    strVar += "  <div class=\"col-lg-4 divcenter\">";
    strVar += "<div class=\"alert address-form\">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
    strVar += "   <center><h4 class=\"alert-heading\">Wallet Deposit Address!<\/h4>";
    strVar += "   <p>Address: " + $("#qr_code").val() + "<\/p></center>";
    strVar += "</div>"
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";
    strVar += "            <div class=\"form-group row \">";
    strVar += "                 <img class='divcenter qr-phone' src=\"https://chart.googleapis.com/chart?chs=300x300&chf=bg,s,FFFFFF00&cht=qr&choe=UTF-8&&chl=bitcoin:" + $("#qr_code").val() + "\" alt=\"" + $("#qr_code").val() + "\"><\/img>";
    strVar += "            <\/div>";
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


