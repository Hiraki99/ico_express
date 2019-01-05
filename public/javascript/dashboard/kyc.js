function setIndentify() {
    switch ($('#val_identification').val()) {
        case "passport":
            $("#name_type_indentification").html("Passport ID");
            $("#front_size").html("Passport Personal Page");
            $("#back_side").html("Passport Cover");
            $("#selfie_image").html("Selfie With Passport And Note")

            $("#front_image").attr("src","/images/pp_frist_page.png")
            $("#back_image").attr("src","/images/pp_cover.png")
            
            break;
        case "driving":
            $("#name_type_indentification").html("Driving License Number");
            $("#front_size").html("Driving License Front Side ");
            $("#back_side").html("Driving License Back Sider");
            $("#selfie_image").html("Selfie With Driving ID And Note")
            
            $("#front_image").attr("src","/images/driver1.png")
            $("#back_image").attr("src","/images/driver2.png")
           
            break;
        default:
            $("#name_type_indentification").html("Identification ID");
            $("#front_size").html("Identity Card Front Sider ");
            $("#back_side").html("Identity Card Back Sider");
            $("#selfie_image").html("Selfie With Photo ID And Note")
            
            $("#front_image").attr("src","/images/id_front.png")
            $("#back_image").attr("src","/images/id_back.png")
    }

}
$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop:  $(this).offset().top - $('#submit_form').offset().top+ 'px'
        }, 1500);
    });
}
$(document).ready(function (e) {
    $('input').focus(function () {
        $(this).css("border", "none");
    })
    $('select').focus(function () {
        $(this).css("border", "none");
    })


    $('#submit_form').on('submit', function (e) {
        // e.preventDefault();
        if ($("#val_firstname").val().length <= 0) {
            $("#val_firstname").css("border", "1px solid red");
            $("#val_firstname").scrollView();
            return false;
        }
        if ($("#val-lastname").val().length <= 0) {
            $("#val-lastname").css("border", "1px solid red");
            $('html, body').animate({
                scrollTop: $("#val-lastname").offset().top + 'px'
            }, 2000);
            return false;
        }
        if ($("#val-phoneus").val().length <= 8) {
            $("#val-phoneus").css("border", "1px solid red");
            $("#val-phoneus").scrollView();
            return false;
        }
        if ($('#val-nationality :selected').val() == "None") {
            $("#val-nationality").css("border", "1px solid red");
            $("#val-nationality").scrollView();
            return false;
        }
        if ($("#val-identyfi_id").val().length <= 4) {
            $("#val-identyfi_id").css("border", "1px solid red");
            $("#val-identyfi_id").scrollView();
            return false;
        }
        $("#val_firstname").css('disabled',"disabled");
        $("#val-lastname").css('disabled','disabled');
        $("#val-phoneus").css('disabled','disabled');
        $('#val-nationality').css('disabled','disabled');
        $('#val_identification').css('disabled','disabled');
        $('#val-identyfi_id').css('disabled','disabled');
        $('#file_front').css('disabled','disabled');
        $('#file_back').css('disabled','disabled');
        $('#file_selfie').css('disabled','disabled');
        return true;
    });
    if (document.getElementById("file_front"))
        document.getElementById("file_front").onchange = function () {
            var reader = new FileReader();

            reader.onload = function (e) {
                // get loaded data and render thumbnail.
                document.getElementById("image_front").src = e.target.result;
                $("#image_front").parent().parent().css('border', 'none')
            };
            reader.readAsDataURL(this.files[0]);
        };
    if (document.getElementById("file_back"))
        document.getElementById("file_back").onchange = function () {
            var reader = new FileReader();

            reader.onload = function (e) {
                // get loaded data and render thumbnail.
                document.getElementById("image_back").src = e.target.result;
                $("#image_back").parent().parent().css('border', 'none')
            };
            reader.readAsDataURL(this.files[0]);
        };
    if (document.getElementById("file_selfie"))
        document.getElementById("file_selfie").onchange = function () {
            var reader = new FileReader();

            reader.onload = function (e) {
                // get loaded data and render thumbnail.
                document.getElementById("image_selfie").src = e.target.result;
                $("#image_selfie").parent().parent().css('border', 'none')
            };
            reader.readAsDataURL(this.files[0]);
        };
})

var success = getURLVar('success');
if (success !='' && success !=undefined){
    if(success =='true') noti(1);
    else noti(0);
}
function noti(e){
    var strVar="";
    var content="";
    var header = "";
    strVar += "  <div class=\"col-lg-4 divcenter\">";
    strVar += "<div class=\"alert address-form\">";
    strVar +="<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
    if(e == 0){
        strVar   += "   <center><h2 class=\"alert-heading\">Error!<\/h2>";
        header   += '<center><h3>Error occur!</h3></center>'
        content  += '<center><p style="font-size:17px">The form kyc was submiited successfully </p></center>';
    }  
    else{
        strVar   += "   <center><h2 class=\"alert-heading\">Success!<\/h2>";
        header   += '<center><h2>Thank you!</h2></center>';
        content  += '<center><p style="font-size:17px">The form kyc was submiited successfully </p></center>';
    } 
    strVar += "   </center>";
    strVar +="</div>"
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";

    strVar += "            <div class=\"form-group \">";
    strVar += header;
    strVar += "            <\/div>";
    
    strVar += "            <div class=\"form-group \">";
    strVar += content;
    strVar += "            <\/div>";

    strVar += "            <div class=\"form-group\">";
    strVar += "              <div class=\"col-lg-8 divcenter\">";
    strVar += "           <center><button class=\"btn btn-primary\" onclick='$.magnificPopup.instance.close()'>Okie<\/button></center>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";

    strVar += "          <\/div>";
    strVar += "        <\/div>";
    strVar += "      <\/div>";
    strVar += "    <\/div>";
    strVar += "  <\/div>";
    

    $.magnificPopup.open({
        delegate:'button',
        items: {
            src: strVar,
            type: 'inline',
        }, showCloseBtn: false,
        
    });
}