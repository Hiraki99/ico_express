$(document).ready(function(){
    
    $.ajax({
        url: '/admin/getallevent',
        type: 'post',
        dataType: 'json',
        success: function(json) {
            console.log(json);
            if (!json.error) {
                var strVar="";
                for (var i=0 ; i< json.length;i++){
                    data = json[i];

                    strVar += "<tr role=\"row\" class=\"odd\"><td class=\"sorting_1\">"+(i+1)+"<\/td>";
                    strVar += "<td>"+data.title+"<\/td> <td>"+data.date_start+"<\/td>";
                    strVar += "<td>"+data.date_end+"<\/td>";
                    strVar += "<td>"+data.status+"<\/td>";
                    strVar += "<td>"+data.date_create+"<\/td>";
                    strVar += "<td> <button class=\"btn btn-success sweet-success btn_article\" onclick ='window.location.href=\"/admin/updatevideo?id="+data.id+" \"'>Update<\/button>";
                    strVar += "<button id='button_"+data.id+"' class=\"btn btn-danger\" type=\"button\" onclick='myfunction("+data.id+")'>Delete<\/button><\/td>";
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
function deleteevent(e){
    data = {
        "id": e
    };
    $.ajax({
        url: '/admin/deleteevent',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(json) {
            if (!json.error) {
                $('#button_'+e).parent().parent().remove();
                
            }      
            $.magnificPopup.instance.close();
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function myfunction(e){
    var source;
    source = '<div class="modal-dialog"><div class="modal-content" ><div class="modal-header"><h4 class="modal-title">Warning</div><div class="modal-body"><p>Do you want to delete?</p></div><div class="modal-footer"><button type="button" class="btn btn-primary" onclick="deleteevent('+e+')">Yes</button><button type="button" class="btn btn-default" data-dismiss="modal" onclick="$.magnificPopup.instance.close()">Cancel</button></div></div></div>'
    
    $.magnificPopup.open({
        items: {
            src: source,
            type: 'inline',
            removalDelay: 500,
            showCloseBtn: false
        }
    });
}