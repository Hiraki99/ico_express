$.ajax({
    url: '/admin/listKyc',
    type: 'post',
    dataType: 'json',
    success: function(json) {
        console.log(json);
        if (!json.error){
            var strVar="";
            for(var i=0;i< json.length;i++){
                data = json[i];
                strVar += "<tr role=\"row\" class=\"odd\">";
                strVar += "<td class=\"sorting_1\">"+(i+1)+"<\/td>";
                strVar += "<td>"+data.name+"<\/td><td>"+data.phone+"<\/td><td>"+data.status+"<\/td>";
                strVar += "<td>"+data.national+"<\/td>";
                strVar += "<td>"+data.createdate+"<\/td><td>";
                strVar += "<button class=\"btn btn-success sweet-success btn_article\" onclick='detail_kyc("+data.id+")'>Approval<\/button>";
            }

        }
        $("#example23 > tbody").append(strVar);
        $('#example23').DataTable({
            dom: 'Bfrtip',
            buttons: []
        });
    
    },
    error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
    }
});

function detail_kyc(e){
    console.log("e = "+e);
    window.location.href = '/admin/detailkyc?id='+e;
}

function checkrandom(){
    $.ajax({
        url: '/admin/get-random',
        type: 'post',
        dataType: 'json',
        success: function(result){
            // result = JSON.parse(result);
            if(result.success)
                window.location.href = '/admin/detailkyc?id='+result.id;
            else
                alert("Empty list kyc verified");
        }
    });
}