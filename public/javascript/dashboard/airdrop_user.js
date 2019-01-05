$(document).ready(function () {

    $.ajax({
        url: '/dashboard/airdrop',
        type: 'post',
        dataType: 'json',
        success: function (json) {
            console.log(json);
            if (!json.error) {
                var strAirdrop = "";
                json = json.listAirdrop;
                for (var i = 0; i < json.length; i++) {
                    var data = json[i];

                    strAirdrop += "<div class=\"row\">";
                    strAirdrop += "  <div class=\"col-lg-10 offset-lg-1\">";
                    strAirdrop += "    <div class=\"card\">";
                    strAirdrop += "      <div class=\"card-body\">";
                    strAirdrop += "        <div class=\"row\">";
                    strAirdrop += "          <div class=\"col-lg-2\" style='white-space: nowrap;font-size: 20px;color:green;display: flex;align-items: center;text-align: center;'>";
                    strAirdrop += "            <center>";
                    strAirdrop += "              <span style=\"font-size: 20px;align:center\">" + data.bonus + " UNI<\/span>";
                    strAirdrop += "            <\/center>";
                    strAirdrop += "          <\/div>";
                    strAirdrop += "          <div class=\"col-lg-8\">";
                    if (data.status != "Completed") {
                        strAirdrop += "            <h4 class=\"card-title\"><a href='" + data.link + "'>" + data.title + "<\/a><\/h4>";
                    } else {
                        strAirdrop += "            <h4 class=\"card-title\">" + data.title + "<\/h4>";
                    }
                    strAirdrop += "            <div class=\"card-content\">";
                    strAirdrop += "              <p>" + data.content + "<\/p>";
                    strAirdrop += "            <\/div>";
                    strAirdrop += "          <\/div>";
                    strAirdrop += "          <div class=\"col-lg-2\" style='white-space: nowrap;font-size: 20px;display: flex;align-items: center; '>";
                    strAirdrop += "            <center>";
                    if (data.status == "Completed") {
                        strAirdrop += "<span style='color:green;'>"+data.status+"<\/span>";
                    } else if (data.status == "Important") {
                        strAirdrop += "<span style='color:red;'>"+data.status+"<\/span>";
                    } else {
                        strAirdrop += "<span style='color:orange;'>"+data.status+"<\/span>";
                    }
                    strAirdrop += "            <\/center>";
                    strAirdrop += "          <\/div>";
                    strAirdrop += "        <\/div>";
                    strAirdrop += "      <\/div>";
                    strAirdrop += "    <\/div>";
                    strAirdrop += "  <\/div>";
                    strAirdrop += "<\/div>";

                }
                $('#list-airdrop').html(strAirdrop);
            }
        }
    });

});
function deleteAirdrop(n) {
    data = {
        id: $("#airdrop-id").val(),
        password: md5($("#val-confirm-password").val())
    }
    console.log("data = " + JSON.stringify(data));
    $.ajax({
        url: '/admin/deleteairdrop',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            console.log(json);
            if (!json.error) {
                $.magnificPopup.instance.close();
                $(n).parent().parent().remove();
                alert("Successfully!");
            } else {
                $.magnificPopup.instance.close();
                alert(json.noti);
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function enterPassword(n, id) {
    var strVar = "";

    strVar += " <div class=\"col-lg-4 divcenter\">";
    strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"

    strVar += "<div class=\"alert address-form \">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
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
    strVar += "                <input class=\"form-control\" id=\"airdrop-id\" type=\"hidden\" value=\"" + id + "\" name=\"airdrop_id\" placeholder=\"Please enter password to confirm it!\"\/>";
    strVar += "            <div class=\"form-group\">";
    strVar += "              <div class=\"col-8 divcenter\">";
    strVar += "                <button class=\"btn btn-primary button-res\" type=\"submit\" onclick='deleteAirdrop(" + n + ")'>Submit<\/button>";
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