function convertDateToString(date){
    var date_change = new Date(date);
    var day = date_change.getDay() < 10 ? "0"+date_change.getDay() : date_change.getDay()
    var month = date_change.getMonth() < 10 ? "0"+date_change.getMonth() : date_change.getMonth()
    var hour = date_change.getHours() < 10 ? "0"+date_change.getHours() : date_change.getHours()
    var minutes = date_change.getMinutes() < 10 ? "0"+date_change.getMinutes() : date_change.getMinutes()
    return day+"-"+month + "-" +  date_change.getFullYear()+ " "+ hour+ ":"+ minutes;
}
$(document).ready(function(){
    $.ajax({
        url: '/dashboard/list-notify',
        type: 'POST',
        data: {
    
        },
        success: function (result) {
            console.log(result);
            if(!result.error){
                var strVar="";
                var strVarAll="";
                var unseen = 0;
                var max = result.length > 10? 10: result.length;
                for(var i=0;i<max;i++)
                {
                    var data = result[i];
                    if(!data.isViewed ) 
                    {
                        unseen+=1;
                        if( i > 10)
                            strVar  += "<li class='unseen_hide' style='display:none'>";
                        else strVar += "<li class='unseen' style='background-color: #77779955;'>";
                    }    
                    else strVar += "<li class='seen' style='background-color:none;'>";
                    strVar += "   <a href=\"#\">";
                    strVar += "     <input class='listnotifi' style='display:none' value ="+data.id+"></input>";
                    strVar += "      <img class=\"pull-left m-r-10 avatar-img\" src=\"\/assets\/images\/avatar\/admin-icon.png\" alt=\"\">";
                    strVar += "      <div class=\"notification-content\">";
                    
                    strVar += "         <small class=\"notification-timestamp pull-right\">"+convertDateToString(data.date_finished)+"<\/small>";
                    strVar += "         <div class=\"notification-heading\">"+data.author+"<\/div>";
                    strVar += "         <div class=\"notification-text\">"+data.title+" <\/div>";
                    strVar += "      <\/div>";
                    strVar += "   <\/a>";
                    strVar += "<\/li>";

                    strVarAll += "<div class=\"item-notify\">";
                    strVarAll += "<div class=\"row\">";
                    strVarAll += "   <div class=\"col-2 author\">";
                    strVarAll += "      <img src=\"\/assets\/images\/avatar\/admin-icon.png\"class='img_notification'>";
                    strVarAll += "      <center>";
                    strVarAll += "      <span style=\"font-weight: bold;\">By: "+data.author+"<\/span></center>"
                    strVarAll += "   <\/div>";
                    strVarAll += "   <div class=\"col-10 content-detail\">";
                    strVarAll += "   <a href=\""+data.link+"\">";
                    strVarAll += "      <p class='title_notification' style='font-size:18px'>"+data.title+" <\/p>";
                    strVarAll += "   <\/a>";
                    
                    strVarAll += "  <span style=\"font-size: 14px;\" class='time_notifi'>Posted: "+convertDateToString(data.date_finished)+"<\/span><hr style='border-bottom: 1px dashed #e9ecef;'/>";
                    strVarAll += "      <p style=\"font-size: 13px;\">"+data.description+"<\/p>";
                    // strVarAll += "      <p style=\"font-size: 16px; font-style: italic;\">Detail Notification: <a href=\""+data.link+"\" style=\"text-decoration: underline;\">"+data.link+"<\/a><\/p>";
                    strVarAll += "   <\/div>";
                    strVarAll += "<\/div>";
                    strVarAll += "<\/div>";
                }
                $("#all_noti > ul").prepend(strVar);
                $('#count_newnotify').html(unseen);
                $('#notifiall').css('display','block');
                if(window.location.pathname == '/dashboard/notify')
                    $("#notify").append(strVarAll);
            }
            $('#loading-notification').remove();
        }
    }).fail(function (xhr, status, errorThrown) {
        // alert( "Sorry, there was a problem!" );
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
        $('#loading-notification').remove();
    });
    $.ajax({
        url: '/dashboard/getpriceMulti',
        type: 'POST',
        data: {
    
        },
        success: function (result) {
            console.log(result);
            result = JSON.parse(result);
            if(!result.error){
                $("#webticker-dark-icons").html("");
                var strVar="";
                strVar += "";
                strVar += "   <li data-update=\"item1\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc BTC\"><\/i> BTC <span class=\"coin-value\"> "+result.BTC.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item2\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc ETH\"><\/i> ETH <span class=\"coin-value\"> "+result.ETH.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item3\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc GAME\"><\/i> GAME <span class=\"coin-value\"> "+result.GAME.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item4\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc LBC\"><\/i> LBC <span class=\"coin-value\"> "+result.LBC.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item5\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc NEO\"><\/i> NEO <span class=\"coin-value\"> "+result.NEO.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item6\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc STEEM\"><\/i> STE <span class=\"coin-value\"> "+result.STEEM.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item7\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc LTC\"><\/i> LIT <span class=\"coin-value\"> "+result.LIT.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item8\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc NOTE\"><\/i> NOTE <span class=\"coin-value\"> "+result.NOTE.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item9\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc MINT\"><\/i> MINT <span class=\"coin-value\"> "+result.MINT.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item10\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc IOTA\"><\/i> IOT <span class=\"coin-value\"> "+result.IOT.USD+"<\/span><\/li>";
                strVar += "   <li data-update=\"item11\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\" class=\"last\"><i class=\"cc DASH\"><\/i> DAS <span class=\"coin-value\"> "+result.DASH.USD+"<\/span><\/li>";
                $("#webticker-dark-icons").html(strVar);
                $("#webticker-dark-icons").webTicker({
                    height: 'auto',
                    // duplicate: true,
                    startEmpty: false,
                    rssfrequency: 5
                });
            }
            
        }
        }).fail(function (xhr, status, errorThrown) {
            // alert( "Sorry, there was a problem!" );
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
            
        });
    
    setInterval(function(){ 
        $.ajax({
           url: '/dashboard/getpriceMulti',
           type: 'POST',
           data: {
       
           },
           success: function (result) {
               console.log(result);
               result = JSON.parse(result);
               if(!result.error){
                    $("#webticker-dark-icons").html("");
                    var strVar="";
                    strVar += "";
                    strVar += "   <li data-update=\"item1\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc BTC\"><\/i> BTC <span class=\"coin-value\"> "+result.BTC.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item2\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc ETH\"><\/i> ETH <span class=\"coin-value\"> "+result.ETH.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item3\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc GAME\"><\/i> GAME <span class=\"coin-value\"> "+result.GAME.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item4\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc LBC\"><\/i> LBC <span class=\"coin-value\"> "+result.LBC.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item5\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc NEO\"><\/i> NEO <span class=\"coin-value\"> "+result.NEO.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item6\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc STEEM\"><\/i> STE <span class=\"coin-value\"> "+result.STEEM.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item7\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc LTC\"><\/i> LIT <span class=\"coin-value\"> "+result.LIT.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item8\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc NOTE\"><\/i> NOTE <span class=\"coin-value\"> "+result.NOTE.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item9\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc MINT\"><\/i> MINT <span class=\"coin-value\"> "+result.MINT.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item10\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\"><i class=\"cc IOTA\"><\/i> IOT <span class=\"coin-value\"> "+result.IOT.USD+"<\/span><\/li>";
                    strVar += "   <li data-update=\"item11\" style=\"white-space: nowrap; float: left; padding: 0px 7px;\" class=\"last\"><i class=\"cc DASH\"><\/i> DAS <span class=\"coin-value\"> "+result.DASH.USD+"<\/span><\/li>";
                    $("#webticker-dark-icons").html(strVar);
                    $("#webticker-dark-icons").webTicker({
                            height: 'auto',
                            // duplicate: true,
                            startEmpty: false,
                            // rssfrequency: 0
                        });
               }
               
           }
       }).fail(function (xhr, status, errorThrown) {
           // alert( "Sorry, there was a problem!" );
           console.log("Error: " + errorThrown);
           console.log("Status: " + status);
           console.dir(xhr);
           
       });
   
    }, 360000);
})

function updatenotify(){
    var list=[];
    $(".unseen >a> .listnotifi").each(function() {
       list.push($(this).val());
       $(this).parent().removeClass("unseen" ).addClass( "seen" );
    });
    console.log(list);
    if(list.length > 0){
        $.ajax({
            url: '/dashboard/update-NewNotify',
            type: 'POST',
            data: {
                list_notifi: list
            },
            success: function (result) {
                console.log(result);
                result = JSON.parse(result);
                if(result.status == 1){
                    var count_newnotify = parseInt($('#count_newnotify').html());
                    rest = count_newnotify - list.length;

                    if(rest == 0){
                        $('#count_newnotify').html(0);
                    }else{
                        $('#count_newnotify').html(rest);
                    }
                    
                }
            }
        });
    }
   
}
function formatTxHash(str) {
    if (str != null && str.length > 30) {
        var str1 = str.substring(0, 21);
        var str2 = str.substring(str.length - 8, str.length - 1);
        str = str1.concat("...", str2);
    }
    return str;
}

try{
    var socket = io({path:'/test'});
    // var socket = new WebSocket('ws://localhost:8090');
    socket.on('message', function(data){
        console.log(data);
    });
    
    socket.on('newnotify', function (data) {
        if(data != ''){
            var strVar = "";
            console.log(data);
            strVar += "<li class='unseen'>";
            strVar += "   <a href=\"#\">";

            strVar += "      <img class=\"pull-left m-r-10 avatar-img\" src=\"\/assets\/images\/avatar\/3.jpg\" alt=\"\">";
            strVar += "      <div class=\"notification-content\">";
            strVar += "     <input class='listnotifi' style='display:none' value ="+data.id+"></input>";
            strVar += "         <small class=\"notification-timestamp pull-right\">"+data.date+"<\/small>";
            strVar += "         <div class=\"notification-heading\">Mr. Saifun<\/div>";
            strVar += "         <div class=\"notification-text\">"+data.title+" <\/div>";
            strVar += "      <\/div>";
            strVar += "   <\/a>";
            strVar += "<\/li>";

            $("#all_noti > ul").prepend(strVar);
            if($('#count_newnotify').html()== undefined){
                $('#count').append('<span id="count_newnotify" class= "icoAdmin-badge badge-success">1</span>')
            }else{
                var newmountnotify = parseInt($('#count_newnotify').html())+1;
                $('#count_newnotify').html(newmountnotify);
            }
        }
        return false;
    });
    socket.on('disconnect', function (msg) {
        console.log('disconnect');
    });
    socket.on('connection', function(something) {
        console.log('connected.');
    });
}catch(err){

}
