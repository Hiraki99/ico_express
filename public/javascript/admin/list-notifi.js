$(document).ready(function(){
    
    $.ajax({
        url: '/admin/allnotify',
        type: 'post',
        dataType: 'json',
        success: function(json) {
            console.log(json);
            if (!json.error) {
                var strVar="";
                for (var i=0 ; i< json.length;i++){
                    data = json[i];

                    strVar += "<tr role=\"row\" class=\"odd\"><td class=\"sorting_1\">"+(i+1)+"<\/td>";
                    strVar += "<td>"+data.title+"<\/td>";
                    strVar += "<td>"+data.description+"<\/td>";
                    strVar += "<td>"+data.link+"<\/td>";
                    
                    strVar += "<td>"+data.date+"<\/td>";
                    strVar += "<td> <button class=\"btn btn-success sweet-success btn_article\" onclick ='window.location.href=\"/admin/updatenotify?id="+data.id+" \"'>Modify<\/button>";
                    strVar += "<button class=\"btn btn-danger\" type=\"button\" onclick='delete_notifi(this,"+data.id+")'>Delete<\/button><\/td>";
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
function delete_notifi(n,e){
    data = {
        "id": e
    }
    console.log(data);
    $.ajax({
        url: '/admin/deletenotify',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(json) {
            console.log(json);
            if (!json.error) {
                $(n).parent().parent().remove();
            }
            
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}