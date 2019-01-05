
$.ajax({
    url: '/dashboard/getprice',
    type: 'POST',
    data: {
        'name_currency': 'ETH'
    },
    async: false,
    success: function (result) {
        $("#loadingeth").remove();
        $('#eth').css('display', 'block');
        result = $.parseJSON(result);
        var data = '0,';
        // result.forEach(element => {
        //     data += element['high'] + ',' ;
        // });
        for (var i = 1; i < result.length; i++) {
            var range = result[i]['high'] - result[0]['high'];
            data += range + ',';
        }
        var change_price_day = result[result.length - 1].high - result[0].high;

        var strVar = "";

        if (change_price_day < 0) {
            strVar += "<h6 class=\"text-danger\">" + Math.round(Math.abs(change_price_day) / result[0].high * 100).toFixed(2) + "%<i class=\"ti-arrow-down f-s-16 text-danger m-l-5\"><\/i><\/h6>";

        } else {
            strVar += "<h6 class=\"text-success\">" + Math.round(Math.abs(change_price_day) / result[0].high * 100).toFixed(2) + "%<i class=\"ti-arrow-up f-s-16 text-success m-l-5\"><\/i><\/h6>";
        }
        $('#price_eth').next().remove();
        $('#price_eth').parent().append(strVar)
        data = data.substring(0, data.length - 1);

        $("#chart_eth").html(data);
        $("#price_eth").html("$" + result[result.length - 1].high);
        $(".peity-eth").peity("line", {
            width: '100%',
            height: '100'
        });
    }
}).fail(function (xhr, status, errorThrown) {
    // alert( "Sorry, there was a problem!" );
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
});

$.ajax({
    url: '/dashboard/getprice',
    type: 'POST',
    data: {
        'name_currency': 'BTC'
    },
    async: false,
    success: function (result) {
        $("#loadingbtc").remove();
        $('#btc').css('display', 'block');
        result = $.parseJSON(result);
        var data = '0,';
        // result.forEach(element => {
        //     data += element['high'] + ',' ;
        // });

        for (var i = 1; i < result.length; i++) {
            var range = result[i]['high'] - result[0]['high'];
            data += range + ',';
        }

        data = data.substring(0, data.length - 1);
        var change_price_day = result[result.length - 1].high - result[0].high;


        var strVar = "";
        if (change_price_day < 0) {
            strVar += "<h6 class=\"text-danger\">" + Math.round(Math.abs(change_price_day) / result[0].high * 100).toFixed(2) + "%<i class=\"ti-arrow-down f-s-16 text-danger m-l-5\"><\/i><\/h6>";

        } else {
            strVar += "<h6 class=\"text-success\">" + Math.round(Math.abs(change_price_day) / result[0].high * 100).toFixed(2) + "%<i class=\"ti-arrow-up f-s-16 text-success m-l-5\"><\/i><\/h6>";
        }
        $('#price_btc').next().remove();
        $('#price_btc').parent().append(strVar);

        $("#price_btc").html("$" + result[result.length - 1].high);

        $("#chart_btc").html(data);
        $(".peity-btc")
            .peity("line", {
                width: '100%',
                height: '100'
            });
    }
}).fail(function (xhr, status, errorThrown) {
    // alert( "Sorry, there was a problem!" );
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
});

//format string tx_hash
function formatTxHash(str) {
    if (str != null && str.length > 30) {
        var str1 = str.substring(0, 18);
        var str2 = str.substring(str.length - 8, str.length - 1);
        str = str1.concat("...", str2);
    }
    return str;
}
// search the CSSOM for a specific -webkit-keyframe rule
function findKeyframesRule(rule) {
    // gather all stylesheets into an array
    var ss = document.styleSheets;

    // loop through the stylesheets
    for (var i = 0; i < ss.length; ++i) {

        // loop through all the rules
        for (var j = 0; j < ss[i].cssRules.length; ++j) {

            // find the -webkit-keyframe rule whose name matches our passed over parameter and return that rule
            if ((ss[i].cssRules[j].type === window.CSSRule.KEYFRAMES_RULE || ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE) && ss[i].cssRules[j].name == rule)
                return ss[i].cssRules[j];
        }
    }

    // rule not found
    return null;
}

function change(anim, start, end) {
    // find our -webkit-keyframe rule
    var keyframes = findKeyframesRule(anim);

    // remove the existing 0% and 100% rules
    keyframes.deleteRule("0%");
    keyframes.deleteRule("100%");

    // create new 0% and 100% rules with random numbers
    keyframes.appendRule("0% { -webkit-transform: rotate(" + start + "deg);transform: rotate(" + start + "deg); }");
    keyframes.appendRule("100% { transform: rotate(" + end + "deg); }");

    // assign the animation to our element (which will cause the animation to run)
    document.getElementById('time-cycle').style.webkitAnimationName = anim;
}

// begin the new animation process
function startChange(anim, start, end) {
    // remove the old animation from our object
    document.getElementById('time-cycle').style.webkitAnimationName = "none";

    // call the change method, which will update the keyframe animation
    setTimeout(function () { change(anim, start, end); }, 0);
}


$.ajax({
    url: '/dashboard/dashboard-check',
    type: 'POST',
    success: function (data) {
        if (data.wallet) {
            $.ajax({
                url: "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + data.address_contract + "&address=" + data.address + "&tag=latest&apikey=YourApiKeyToken",
                type: 'GET',
                success: function (balance) {
                    console.log("balance = "+balance.result);
                    if (balance.message == "OK") {
                        loadDashboardData(parseFloat(balance.result) / Math.pow(10, 18));
                    } else {
                        loadDashboardDataDefault();
                    }
                }
            }).fail(function (xhr, status, errorThrown) {
                // alert( "Sorry, there was a problem!" );
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            });
        } else {
            loadDashboardDataDefault();
        }
    }
}).fail(function (xhr, status, errorThrown) {
    // alert( "Sorry, there was a problem!" );
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
});
function loadDashboardDataDefault() {
    console.log("loadDashboardDataDefault defaut");
    var strBonus = "";
    strBonus += "<h4 class=\"card-title\">Bonus<\/h4>";
    strBonus += "	<h6 class=\"text-muted text-right\"> Bonus VIP (PreICO)<\/h6>";
    strBonus += "	<h4 class=\"text-success\">+ " + 0 + "<\/h4>";
    strBonus += "	<h6 class=\"text-muted text-right\"> Bonus VIP (ICO)<\/h6>";
    strBonus += "	<h4 class=\"text-success\">+ " + 0 + "<\/h4>";
    strBonus += "	<h6 class=\"text-muted text-right\">PreICO & Ico <\/h6>";
    strBonus += "	<h4 class=\"text-success\">+ " + 0 + "<\/h4>";
    strBonus += "	<h6 class=\"text-muted text-right\">Airdrop<\/h6>";
    strBonus += "	<h4 class=\"text-success\">+ " + 0 + "<\/h4>";
    $('#bonus').html(strBonus);
    var strReferals1 = "";
    strReferals1 += "<h4 class=\"card-title\">Referal<\/h4>";
    strReferals1 += "	<h2>";
    strReferals1 += "		<span class=\"hidden-sm-up\"><i class=\"ti-user\"><\/i>" + 0 + "<\/span>";
    strReferals1 += "	<\/h2>";
    strReferals1 += "	<hr>";
    var strReferals2 = "";
    strReferals2 += "	<h6 class=\"text-muted text-right\">" + "Max: " + 0 + "<\/h3>";
    strReferals2 += " <h4 class=\"text-success text-right\">+ " + 0 + "<\/h4>";
    $('#referals1').html(strReferals1);
    $('#referals2').html(strReferals2);
    var strPortfolio = "";
    strPortfolio += "<tr>";
    strPortfolio += "		<td>";
    strPortfolio += "			<i class=\"cc BTC\"><\/i>  UNI Locked";
    strPortfolio += "		<\/td>";
    strPortfolio += "		<td>" + 0 + "<\/td>";
    strPortfolio += "		<td>" + 0 + "$<\/td>";
    strPortfolio += "	<\/tr>";
    strPortfolio += "	<tr>";
    strPortfolio += "		<td>";
    strPortfolio += "			<i class=\"cc BTC\"><\/i>  UNI Unlocked";
    strPortfolio += "		<\/td>";
    strPortfolio += "		<td>" + 0 + "<\/td>";
    strPortfolio += "		<td>" + 0 + "$<\/td>";
    strPortfolio += "	<\/tr>";
    strPortfolio += "	<tr>";
    strPortfolio += "		<td>";
    strPortfolio += "			<i class=\"cc ETH\"><\/i>  Ethereum";
    strPortfolio += "		<\/td>";
    strPortfolio += "		<td>" + 0 + "<\/td>";
    strPortfolio += "		<td>" + 0 + "$<\/td>";
    strPortfolio += "	<\/tr>";
    strPortfolio += "	<tr>";
    strPortfolio += "		<td>";
    strPortfolio += "			";
    strPortfolio += "		<\/td>";
    strPortfolio += "		<td><\/td>";
    strPortfolio += "		<td>" + 0 + "$<\/td>";
    strPortfolio += "	<\/tr>";
    $('#loading-portfolio').remove();
    $('#portfolio').html(strPortfolio);
    //tokens
    var strTokens = "";
    strTokens += "<h6 class=\"text-muted text-right\">UnLocked <\/h6>";
    strTokens += "	<h4 class=\"text-warning text-right\">" + 0 + "<\/h4>";
    strTokens += "	<h6 class=\"text-muted text-right\">Locked<\/h6>";
    strTokens += "	<h4 class=\"text-warning text-right\">" + 0 + "<\/h4>";
    strTokens += "	<hr>";
    strTokens += "	<h3 class=\"text-right\">" + 0 + "<\/h3>";
    $('#loading-tokens').remove();
    $('#tokens').html(strTokens);
}
function loadDashboardData(balance) {
    $.ajax({
        url: '/dashboard',
        type: 'POST',
        data: {
            balance: balance
        },
        success: function (result) {
            console.log(result);
            if (!result.error) {
                //bonus
                var strBonus = "";
                strBonus += "<h4 class=\"card-title\">Bonus<\/h4>";
                strBonus += "	<h6 class=\"text-muted text-right\"> Bonus VIP (PreICO)<\/h6>";
                strBonus += "	<h4 class=\"text-success\">+ " + result.wallet.bonus_vip_preIco + "<\/h4>";
                strBonus += "	<h6 class=\"text-muted text-right\"> Bonus VIP (ICO)<\/h6>";
                strBonus += "	<h4 class=\"text-success\">+ " + result.wallet.bonus_vip_ico + "<\/h4>";
                strBonus += "	<h6 class=\"text-muted text-right\">PreICO & Ico <\/h6>";
                strBonus += "	<h4 class=\"text-success\">+ " + "<\/h4>";
                strBonus += "	<h6 class=\"text-muted text-right\">Airdrop<\/h6>";
                strBonus += "	<h4 class=\"text-success\">+ " + result.user.bonus_airdrop + "<\/h4>";
                $('#bonus').html(strBonus);
                //referal
                var strReferals1 = "";
                strReferals1 += "<h4 class=\"card-title\">Referal<\/h4>";
                strReferals1 += "	<h2>";
                strReferals1 += "		<span class=\"hidden-sm-up\"><i class=\"ti-user\"><\/i>" + result.referal.member + "<\/span>";
                strReferals1 += "	<\/h2>";
                strReferals1 += "	<hr>";
                var strReferals2 = "";
                strReferals2 += "	<h6 class=\"text-muted text-right\">" + "Max: " + result.referal.max + "<\/h3>";
                strReferals2 += " <h4 class=\"text-success text-right\">+ " + result.referal.total_bonus_referal + "<\/h4>";
                $('#referals1').html(strReferals1);
                $('#referals2').html(strReferals2);

                //portfolio
                var strPortfolio = "";
                var total_token = balance;
                var value_eth_dola = result.value_eth;
                var value_locked = result.wallet.total_locked_token * (result.price_token_lock * value_eth_dola);
                var value_unlocked = result.wallet.total_unlocked_token * (result.price_token_unlock * value_eth_dola);
                var value_total_token = value_locked + value_unlocked;
                var total_eth = result.wallet.total_eth;
                var value_eth = total_eth * value_eth_dola;
                value_locked = Math.round(parseFloat(value_locked) * 10) / 10;
                value_unlocked = Math.round(parseFloat(value_unlocked) * 10) / 10;
                value_eth = Math.round(parseFloat(value_eth) * 10) / 10;
                var value_total = value_locked + value_unlocked + value_eth;
                strPortfolio += "<tr>";
                strPortfolio += "		<td>";
                strPortfolio += "			<i class=\"cc BTC\"><\/i>  UNI Locked";
                strPortfolio += "		<\/td>";
                strPortfolio += "		<td>" + Math.round(result.wallet.total_locked_token * 10) / 10 + "<\/td>";
                strPortfolio += "		<td>" + value_locked + "$<\/td>";
                strPortfolio += "	<\/tr>";
                strPortfolio += "	<tr>";
                strPortfolio += "		<td>";
                strPortfolio += "			<i class=\"cc BTC\"><\/i>  UNI Unlocked";
                strPortfolio += "		<\/td>";
                strPortfolio += "		<td>" + Math.round((total_token - result.wallet.total_locked_token) * 10) / 10 + "<\/td>";
                strPortfolio += "		<td>" + value_unlocked + "$<\/td>";
                strPortfolio += "	<\/tr>";
                strPortfolio += "	<tr>";
                strPortfolio += "		<td>";
                strPortfolio += "			<i class=\"cc ETH\"><\/i>  Ethereum";
                strPortfolio += "		<\/td>";
                strPortfolio += "		<td>" + Math.round(total_eth * 1000) / 1000 + "<\/td>";
                strPortfolio += "		<td>" + value_eth + "$<\/td>";
                strPortfolio += "	<\/tr>";
                strPortfolio += "	<tr>";
                strPortfolio += "		<td>";
                strPortfolio += "			";
                strPortfolio += "		<\/td>";
                strPortfolio += "		<td><\/td>";
                strPortfolio += "		<td>" + Math.round(parseFloat(value_total) * 10) / 10 + "$<\/td>";
                strPortfolio += "	<\/tr>";
                $('#loading-portfolio').remove();
                $('#portfolio').html(strPortfolio);

                //tokens
                var strTokens = "";
                strTokens += "<h6 class=\"text-muted text-right\">UnLocked <\/h6>";
                strTokens += "	<h4 class=\"text-warning text-right\">" + value_unlocked + "<\/h4>";
                strTokens += "	<h6 class=\"text-muted text-right\">Locked<\/h6>";
                strTokens += "	<h4 class=\"text-warning text-right\">" + value_locked + "<\/h4>";
                strTokens += "	<hr>";
                strTokens += "	<h3 class=\"text-right\">" + Math.round(total_token * 10) / 10 + "<\/h3>";
                $('#loading-tokens').remove();
                $('#tokens').html(strTokens);
            } else {
                loadDashboardDataDefault();
            }
        }
    }).fail(function (xhr, status, errorThrown) {
        // alert( "Sorry, there was a problem!" );
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    });
}
$.ajax({
    url: 'https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x531de803d68f3ead1d2a035d5afd1ba8f1c1615d&page=1&offset=4&sort=desc&apikey=YourApiKeyToken',
    type: 'GET',

    success: function (trans) {
        // console.log(JSON.stringify(trans.result));
        var strListTran = "";
        if (trans.message == "OK") {
            //list transactions
            for (var i = 0; i < (trans.result).length; i++) {
                strListTran += "<tr>";
                strListTran += "<td><a href='https://etherscan.io/tx/" + trans.result[i].hash + "' target='_blank'>" + formatTxHash(trans.result[i].hash) + "<\/a><\/td>";
                strListTran += "<td>" + Math.round(parseFloat(trans.result[i].value / Math.pow(10, 18) * 10)) / 10 + ' ' + "UNI<\/td>";
                strListTran += "<\/tr>";
            }
            if (trans.result.length == 0) strListTran = "<tr><td><p class='nodata'>No Data</p></td></tr>";
        } else {
            strListTran = "<tr><td><p class='nodata'>No Data</p></td></tr>";
        }
        $('#list-transaction').html(strListTran);
        $('#loading-transaction').remove();
    }
}).fail(function (xhr, status, errorThrown) {
    // alert( "Sorry, there was a problem!" );
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
});

$.ajax({
    url: '/dashboard/dashboard-selling',
    type: 'POST',

    success: function (result) {
        $.ajax({
            url: "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + result.address_contract + "&address=" + result.address + "&tag=latest&apikey=YourApiKeyToken",
            type: 'POST',

            success: function (result2) {
                //time cycle
                if (result2.message == "OK") {
                    result2.result = parseFloat(result2.result / Math.pow(10, 18) * 10) / 10;
                    // console.log(JSON.stringify(result2.result));
                    var value_time_cycle = Math.round(parseFloat((2450000000 - result2.result) / 24500000) * 100) / 100;
                    console.log("value_time_cycle = " + value_time_cycle);
                    var strTimeCycle = "";
                    strTimeCycle += "<span class=\"progress-left\">";
                    strTimeCycle += "			<span class=\"progress-bar\">";
                    strTimeCycle += "				";
                    strTimeCycle += "			<\/span>";
                    strTimeCycle += "		<\/span>";
                    strTimeCycle += "		<span class=\"progress-right\">";
                    strTimeCycle += "			<span class=\"progress-bar\">";
                    strTimeCycle += "				";
                    strTimeCycle += "			<\/span>";
                    strTimeCycle += "		<\/span>";
                    strTimeCycle += "		<div class=\"progress-value\">";
                    strTimeCycle += value_time_cycle + "%";
                    strTimeCycle += "		<\/div>";
                    $('#time-cycle').html(strTimeCycle);

                    //change animation time cycle
                    if (value_time_cycle <= 50) {
                        startChange("loading-1", 0, parseFloat(value_time_cycle * 18 / 5));
                    } else {
                        startChange("loading-1", 0, 180);
                        startChange("loading-2", 0, parseFloat((value_time_cycle - 50) * 18 / 5));
                    }
                }
            }
        }).fail(function (xhr, status, errorThrown) {
            // alert( "Sorry, there was a problem!" );
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        });

    }
}).fail(function (xhr, status, errorThrown) {
    // alert( "Sorry, there was a problem!" );
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
});

