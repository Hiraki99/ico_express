$(document).ready(function(){
    $.ajax({
        url: '/dashboard/list-notify',
        type: 'POST',
        data: {
    
        },
        success: function (result) {
            console.log(result);
            if(!result.error){
                var strVarAll="";
                for(var i=0;i<result.length;i++)
                {
                    var data = result[i];
                    strVarAll += "<div class=\"row\">";
                    strVarAll += "   <div class=\"col-2\">";
                    strVarAll += "      <img src=\"\/assets\/images\/avatar\/1.jpg\" style=\"width: inherit;height: 200px; padding: 10px;\">";
                    strVarAll += "      <p style=\"margin: 10px;\">"+data.date_finished+"<\/p>";
                    strVarAll += "      <p style=\"margin: 10px;\">by <span style=\"font-weight: bold;\">Mr.Killer<\/span><\/p>";
                    strVarAll += "   <\/div>";
                    strVarAll += "   <div class=\"col-10\" style=\"padding: 10px; padding-right: 30px;\">";
                    strVarAll += "      <p style=\"font-size: 25px; font-weight: bold;\">"+data.title+" <img src=\"/image_notify/"+data.url_img+"\" style=\"width: 65px;height: 40px;\"><\/p>";
                    strVarAll += "      <p style=\"font-size: 16px;\">"+data.description+"<\/p>";
                    strVarAll += "      <p style=\"font-size: 16px; font-style: italic;\">Detail Notification: <a href=\""+data.link+"\" style=\"text-decoration: underline;\">"+data.link+"<\/a><\/p>";
                    strVarAll += "   <\/div>";
                    strVarAll += "<\/div>";
                }
                $("#notify").append(strVarAll);
            }
            $('.loading').remove();
        }
    }).fail(function (xhr, status, errorThrown) {
        // alert( "Sorry, there was a problem!" );
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
        $('.loading').remove();
    });
})