$.ajax({
    url: '/admin/get-list-kyc-verified',
    type: 'post',
    dataType: 'json',
    success: function (json) {
        console.log(json);
        if (!json.error) {
            $('#loading-list-kyc').hide();
            $('.table-list-kyc').show();
            var strVar = "";
            var id = '';
            for (var i = 0; i < json.list.length; i++) {
                data = json.list[i];
                strVar += "<tr role=\"row\" class=\"odd\">";
                strVar += "<td class=\"sorting_1\">" + (i + 1) + "<\/td>";
                strVar += "<td>" + data.name + "<\/td><td>" + data.phone + "<\/td><td>" + data.status + "<\/td>";
                strVar += "<td>" + data.national + "<\/td>";
                strVar += "<td>" + data.createdate + "<\/td>";
                strVar += "<td>";
                strVar += "<button class='btn btn-flat btn-primary' onclick='detail_kyc("+data.id+")'>Check again<\/button>";
                strVar += "<button class='btn btn-flat btn-success' onclick='sendConfirmKyc(" + data.id + ")'>Confirm<\/button>";
                strVar += "<button class='btn btn-flat btn-warning' onclick='cancelKycVerified(" + data.id + ")'>Cancel<\/button>";
                strVar += "<\/td>";
                id += data.id + ',';
            }
            if (id != '')
                id = id.substring(0, id.length - 1);
            $('#list_confirm').val(id);
            $('#length_list_confirm').val(json.list.length);
            

        }
        $("#example23 > tbody").append(strVar);
        $('#example23').DataTable({
            dom: 'Bfrtip',
            buttons: []
        });

    },
    error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    }
});

function updatekyctoSC() {
    $('#loading-list-kyc').show();
    $('.table-list-kyc').hide();
    var number = $("#val-number-kyc").val();
    var tmp_list = $('#list_confirm').val().split(',');
    var list_id = new Array();
    var max = $('#val-max-kyc-confirm').val();
    number = max > number ? number : max;
    var gasPrice = $('val-gasPrice').val();
    gasPrice = gasPrice>50 ||gasPrice<=0?10:gasPrice;
    for (var i = 0; i < number; i++) {
        list_id.push(tmp_list[i]);
    }
    console.log("list_id = " + list_id);
    var data_sc = {
        private: $("#val-add-privatekey").val(),
        list_id: list_id,
        gasPrice:gasPrice
    }
    console.log(data_sc);
    $.ajax({
        url: '/admin/update-list-kyc-verified',
        type: 'post',
        data: data_sc,
        dataType: 'json',
        success: function (data) {
            $('#loading-list-kyc').hide();
            $('.table-list-kyc').show();
            console.log(data);
            $.magnificPopup.instance.close();
            alert(JSON.stringify(data));
            location.reload();
        }
    });
}
function beginsubmit() {
    var length_confirm = $("#length_list_confirm").val();
    length_confirm = length_confirm < 10 ? length_confirm : 10;
    console.log("length_confirm = " + length_confirm);
    var strVar = "";

    strVar += "<div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12   form-pad divcenter\">";

    strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"

    strVar += "<div class=\"alert address-form mfp-newspaper\">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
    strVar += "   <center><h4 class=\"alert-heading\"> Add Private Key!<\/h4>";
    strVar += "   <p>Note*:Please add private key to accept kyc of user.<\/p></center>";
    strVar += '<\/div>'
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";
    strVar += "            <div class=\"form-group\">";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for=\"val-number-kyc\">Amount address KYC<\/label>";
    strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
    strVar += "                <input class=\"form-control\"  id=\"val-number-kyc\" type=\"number\" name=\"number_kyc\" value=\"" + length_confirm + "\" min='0' max=\"" + length_confirm + "\" placeholder=\"Number request Kyc..\"\/>";
    strVar += "                <input  id=\"val-max-kyc-confirm\" type=\"hidden\" value=\"" + length_confirm + "\" \/>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-xs-12 col-lg-3 col-form-label\" for=\"val-number-kyc\">gasPrice<\/label>";
    strVar += "              <div class=\"col-xs-12 col-lg-9 col-pad\">";
    strVar += "                <input class=\"form-control\"  id=\"val-gasPrice\" type=\"number\" name=\"val-gasPrice\" value=\"10\" min='1' max='50' placeholder=\"gasPrice to Kyc..\"\/>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group row\">";
    strVar += "              <label class=\"col-xs-12 col-sm-12 col-lg-3 col-form-label\" for=\"val-add-address\">Private Key<\/label>";
    strVar += "              <div class=\"col-xs-12 col-sm-12 col-lg-9 col-pad\">";
    strVar += "                <input class=\"form-control\"  id=\"val-add-privatekey\" type=\"password\" name=\"privatekey\" placeholder=\"Please enter private key of address wallet..\"\/>";
    strVar += "              <\/div>";
    strVar += "            <\/div>";
    strVar += "            <div class=\"form-group\">";
    strVar += "              <div class=\"col-xs-12 col-lg-8 divcenter\">";
    strVar += "                <button class=\"btn btn-primary\" onclick='updatekyctoSC();$.magnificPopup.instance.close();'>Submit<\/button>";
    strVar += "                <button class=\"btn btn-primary\" onclick='$.magnificPopup.instance.close()'>Close<\/button>";
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

        }, showCloseBtn: false, closeOnBgClick: false
    });
}

function cancelKycVerified(id) {
    console.log("id = " + id)
    var strVar = "";

    strVar += "<div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12   form-pad divcenter\">";

    strVar += "<center><img class='loading' src='/images/loading.gif' style='display:none'></center>"

    strVar += "<div class=\"alert address-form mfp-newspaper\">";
    strVar += "<div style= 'border-bottom: 1px solid #e9ecef;'>"
    strVar += " <button type=\"button\" class=\"close\" onclick='$.magnificPopup.instance.close()'>&times;<\/button>";
    strVar += "   <center><h4 class=\"alert-heading\"> Cancel Request KYC<\/h4>";
    strVar += "   <p>Note*: KYC statu will change to \'Waiting\'.<\/p></center>";
    strVar += '<\/div>'
    strVar += "        <div class=\"address-form\">";
    strVar += "          <div class=\"form-valide\">";
    strVar += "            <div class=\"form-group\">";
    strVar += "            <div class=\"form-group \"><center>";
    strVar += "              <p class=\"\" for=\"val-number-kyc\">Do you really want to cancel this request confirm KYC?<\/p>";
    strVar += "            <\/center><\/div>";
    strVar += "            <div class=\"form-group\">";
    strVar += "              <div class=\"col-xs-12 col-lg-8 divcenter\"><center>";
    strVar += "                <button class=\"btn btn-primary\" onclick='sendCancelKYC(" + id + ");$.magnificPopup.instance.close();'>YES<\/button>";
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
}

function sendCancelKYC(id) {
    console.log("id2 = " + id)
    $.ajax({
        url: '/admin/cancel-request-kyc',
        type: 'post',
        data: {
            kyc_id: id
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $.magnificPopup.instance.close();
            alert(JSON.stringify(data.log));
            location.reload();
        }
    });
}
function sendConfirmKyc(id) {

}


$.ajax({
    url: '/admin/get-list-kyc-trans',
    type: 'get',
    dataType: 'json',
    success: function (json) {
        console.log(json);
        if (!json.error) {
            $('#loading-list-kyc-trans').hide();
            $('#table-list-kyc-trans').show();
            var strVar = "";
            for (var i = 0; i < json.list.length; i++) {
                data = json.list[i];
                strVar += "<tr role=\"row\" class=\"odd\">";
                strVar += "<td class=\"sorting_1\">" + (i + 1) + "<\/td>";
                strVar += "<td>";
                strVar += "<a href='https://etherscan.io/tx/"+data.hash+"'>" + data.hash + "<\/a>";
                strVar += "<\/td>";
                strVar += "<td>" + data.fee + "<\/td>";
                strVar += "<td>" + data.number + "<\/td>";
                strVar += "<td>" + data.status + "<\/td>";
                strVar += "<td>" + data.input + "<\/td>";
                strVar += "<td>" + data.nickname + "<\/td>";
            }
        }
        $("#table-list-kyc-trans > tbody").append(strVar);
        $('#table-list-kyc-trans').DataTable({
            dom: 'Bfrtip',
            buttons: []
        });

    },
    error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    }
});

function detail_kyc(e){
    window.location.href = '/admin/detailkyc?id='+e;
}