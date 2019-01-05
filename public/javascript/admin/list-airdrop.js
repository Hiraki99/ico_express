$(document).ready(function(){
    
    $.ajax({
        url: '/admin/allairdrop',
        type: 'post',
        dataType: 'json',
        success: function(json) {
            console.log(json);
            if (!json.error) {
                var strVar="";
                for (var i=0 ; i< json.length;i++){
                    var data = json[i];

                    strVar += "<tr role=\"row\" class=\"odd\"><td class=\"sorting_1\">"+(i+1)+"<\/td>";
                    strVar += "<td>"+data.title+"<\/td>";
                    if(data.level == 1)
                         strVar += "<td>Important<\/td>";
                    else strVar += "<td>Waiting<\/td>";
                    if(data.is_locked ==0)
                        strVar += "<td>Unlocked<\/td>";
                    else
                        strVar += "<td>Locked<\/td>";
                    strVar += "<td>"+data.bonus+"<\/td>";
                    strVar += "<td>"+data.createdAt+"<\/td>";
                    strVar += "<td> <button class=\"btn btn-success sweet-success btn_article\" onclick ='window.location.href=\"/admin/modifyairdrop?id="+data.id+" \"'>Modify<\/button>";
                    strVar += "<button class=\"btn btn-danger\" type=\"button\" onclick='enterPassword("+i+","+data.id+")'>Delete<\/button><\/td>";
                    strVar += "    ";
                    strVar += "<\/tr>";
                }
                $("#example23 > tbody").append(strVar);
                $('#example23').DataTable({
                    dom: 'Bfrtip',
                    buttons: []
                });
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

});
function deleteAirdrop(n){
    data = {
        id: $("#airdrop-id").val(),
        password   : md5($("#val-confirm-password").val())
    }
    console.log("data = "+JSON.stringify(data));
    $.ajax({
        url: '/admin/deleteairdrop',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(json) {
            console.log(json);
            if (!json.error) {
                $.magnificPopup.instance.close();
                $(n).parent().parent().remove();
                alert("Successfully!");
            }else{
                $.magnificPopup.instance.close();
                alert(json.noti);
            }
            
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function enterPassword(n,id){
    var strVar="";

    strVar += " <div class=\"col-lg-4 divcenter\">";
    strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"
        
    strVar += "<div class=\"alert address-form \">";
    strVar +="<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
    strVar += "   <center><h4 class=\"alert-heading\"> Enter password to confirm!<\/h4></center>";
    strVar += "</div>"
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-3 col-form-label\" for=\"val-confirm-password\">Password <\/label>";
    strVar += "              <div class=\"col-9\">";
    strVar += "                <input class=\"form-control\" id=\"val-confirm-password\" type=\"password\" name=\"password\" placeholder=\"Please enter your address wallet..\"\/>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "                <input class=\"form-control\" id=\"airdrop-id\" type=\"hidden\" value=\""+id+"\" name=\"airdrop_id\" placeholder=\"Please enter password to confirm it!\"\/>";
    strVar += "            <div class=\"form-group\">";
    strVar += "              <div class=\"col-8 divcenter\">";
    strVar += "                <button class=\"btn btn-primary button-res\" type=\"submit\" onclick='deleteAirdrop("+n+")'>Submit<\/button>";
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