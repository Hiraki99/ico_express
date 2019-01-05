function changeDateIco(preico_start_date,preico_end_date,ico_start_date,ico_start_date,ico_end_round1,ico_end_round2,ico_end_round3, password,private) {

    console.log(data);
    if (preico_start_date < preico_end_date && preico_end_date <= ico_start_date && ico_start_date < ico_end_round1 && ico_end_round1 < ico_end_round2 && ico_end_round2 < ico_end_round3) {
        $.ajax({
            url: '/admin/change-date-time-ico',
            type: 'post',
            data: date,
            dataType: 'json',
            success: function (result) {
                $.magnificPopup.instance.close();
                notification(result.title, result.log);
            }
        });
    } else {
        $.magnificPopup.instance.close();
        notification("Error", "Input incorrect!");
    }

}

function confirmChangeDateIco() {
    var preico_start_date = new Date($('#val-preico-start-date').val()).getTime() / 1000;
    var preico_end_date = new Date($('#val-preico-end-date').val()).getTime() / 1000;
    var ico_start_date = new Date($('#ico-start-date').val()).getTime() / 1000;
    var ico_end_round1 = new Date($('#ico-end-round1').val()).getTime() / 1000;
    var ico_end_round2 = new Date($('#ico-end-round2').val()).getTime() / 1000;
    var ico_end_round3 = new Date($('#ico-end-round3').val()).getTime() / 1000;
    var password = md5($('#val-confirm-password').val());
    var private = $('#val-confirm-private').val();
    if (preico_start_date < preico_end_date && preico_end_date <= ico_start_date && ico_start_date < ico_end_round1 && ico_end_round1 < ico_end_round2 && ico_end_round2 < ico_end_round3 && password!=null && private !=null) {
        var strVar = "";
        strVar += "<div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12   form-pad divcenter\">";
        strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"
        strVar += "<div class=\"alert address-form mfp-newspaper\">";
        strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
        strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
        strVar += "   <center><h4 class=\"alert-heading\"> Confirm change date ICO<\/h4>";
        strVar += "   <p>Note*: Very importance<\/p></center>";
        strVar += '<\/div>'
        strVar += "        <div class=\"address-form\">";
        strVar += "          <div class=\"form-valide\">";
        strVar += "            <div class=\"form-group\">";
        strVar += "            <div class=\"form-group \"><center>";
        strVar += "              <p class=\"\" for=\"val-number-kyc\">Do you really want to change date ICO?<\/p>";
        strVar += "            <\/center><\/div>";
        strVar += "            <div class=\"form-group\">";
        strVar += "              <div class=\"col-xs-12 col-lg-8 divcenter\"><center>";
        strVar += "                <button class=\"btn btn-default\" onclick='changeDateIco("+preico_start_date+','+preico_end_date+','+ico_start_date+','+ico_end_round1+','+ico_end_round2+','+ico_end_round3+','+password+','+private+")'>YES<\/button>";
        strVar += "                <button class=\"btn btn-primary\" onclick='$.magnificPopup.instance.close()'>NO<\/button>";
        strVar += "              <\/center><\/div>";
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
            }, showCloseBtn: false, closeOnBgClick: true
        });
    } else {
        $.magnificPopup.instance.close();
        notification("Error", "Input incorrect!");
    }
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