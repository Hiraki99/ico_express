function convertDateToString(date){
    var date_change = new Date(date);
    var day = date_change.getDay() < 10 ? "0"+date_change.getDay() : date_change.getDay()
    var month = date_change.getMonth() < 10 ? "0"+date_change.getMonth() : date_change.getMonth()
    var hour = date_change.getHours() < 10 ? "0"+date_change.getHours() : date_change.getHours()
    var minutes = date_change.getMinutes() < 10 ? "0"+date_change.getMinutes() : date_change.getMinutes()
    return day+"-"+month + "-" +  date_change.getFullYear()+ " "+ hour+ ":"+ minutes;
}
var source= []

function pagging(){
    
}
function errorImage(e){
    $(e).attr('src','/image_news/blog-thumb-b.jpg');
}
var list_data = [];

console.log(parseInt($("#all_page_news").val()));

for(var i =0; i< parseInt($("#all_page_news").val());i++){
    list_data.push(i+1);
}
console.log(list_data);

$('#news').pagination({
    dataSource: list_data,
    pageSize: 10,
    showNavigator: false,
    position: 'top',
    callback: function(data, pagination) {
        $.ajax({
            url: '/news-pagging',
            type: 'post',
            data : {
                "page": data,
                "limit": 10
            },
            dataType: 'json',
            success: function(json) {
                console.log(json);
                var strVar="";
                for(var i =0 ; i< json.length;i++){
                    var data = json[i];
                    strVar += "   <div class=\"blog-item animated fadeInUp\" data-animate=\"fadeInUp\" data-delay=\"0\" style=\"visibility: visible;\">";
                    // strVar += "      <div class=\"blog-photo\"><a href=\"/news?id="+data.id+"\"><img src=\""+data.url_image+"\" alt=\"blog-photo\" onerror=\"errorImage(this)\"><\/a><\/div>";
                    strVar += "      <div class=\"blog-texts\">";
                    strVar += "         <ul class=\"blog-meta\">";
                    strVar += "            <li><a href=\"javascript:void(0)\">"+convertDateToString(data.createdAt)+"<\/a><\/li>";
                    strVar += "            <li><a href=\"#\">"+data.category+"<\/a><\/li>";
                    strVar += "         <\/ul>";
                    strVar += "         <h5 class=\"blog-title\"><a href=\"/news?id="+data.id+"\">"+data.title+"<\/a><\/h5>";
                    strVar += "         <p>"+data.description+"<\/p>";
                    strVar += "      <\/div>";
                    strVar += "   <\/div>";
                    
                    source.push(strVar);
                }
                $("#news > .news-item").remove();
                $("#news").prepend(strVar);
            }
        });
        

    }
})