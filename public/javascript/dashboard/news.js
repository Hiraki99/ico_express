function getURLVar(key) {
	var value = [];

	var query = String(document.location).split('?');

	if (query[1]) {
		var part = query[1].split('&');

		for (i = 0; i < part.length; i++) {
			var data = part[i].split('=');

			if (data[0] && data[1]) {
				value[data[0]] = data[1];
			}
		}

		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	}
}
function convertDateToString(date){
    var date_change = new Date(date);
    var day = date_change.getDay() < 10 ? "0"+date_change.getDay() : date_change.getDay()
    var month = date_change.getMonth() < 10 ? "0"+date_change.getMonth() : date_change.getMonth()
    var hour = date_change.getHours() < 10 ? "0"+date_change.getHours() : date_change.getHours()
    var minutes = date_change.getMinutes() < 10 ? "0"+date_change.getMinutes() : date_change.getMinutes()
    return day+"-"+month + "-" +  date_change.getFullYear()+ " "+ hour+ ":"+ minutes;
}
function errorImage(e){
    $(e).attr('src','/image_news/blog-thumb-b.jpg');
}
$(document).ready(function(e){
    console.log(getURLVar('id'));
    data ={
        "id": getURLVar('id')
    }
    $.ajax({
        url: '/getContentNews',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(json) {
            console.log(json);
            var strVar="";
            strVar += "   <div class=\"blog-photo\"><img src='/image_news/"+json.url_image+"' onerror=\"errorImage(this)\" alt=\"blog-large\"><\/div>";
            strVar += "   <ul class=\"blog-meta\">";
            strVar += "      <li><span>Posted<\/span><a href=\"#\">"+convertDateToString(json.createdate)+"<\/a><\/li>";
            strVar += "      <li><span>By<\/span><a href=\"#\">"+json.creator+"<\/a><\/li>";
            
            strVar += "   <\/ul>";
            strVar += "   <h3 class=\"blog-title\"><a href='#' style='word-wrap: break-word;'>"+json.title+"<\/a><\/h3><div style='word-wrap: break-word;'>";
            strVar += json.content;
            strVar += "</div>   <ul class=\"blog-tags\">";
            var keyword = json.keyword.split(',');
            for(var i= 0 ;i<keyword.length;i++){
                strVar += "<li><a href=\"#\">"+keyword[i]+"<\/a><\/li>";
            }
            strVar += "   <\/ul>";
            $("#content_news").html(strVar);

            var tag="";
            for(var i= 0 ;i<keyword.length;i++){
                tag += "<li><a href=\"#\">"+keyword[i]+"<\/a><\/li>";
            }
            $("#tag_key").html(tag);

            var d = new Date(json.createdate);
            month = d.getMonth();
            $('#post_archive option[value='+month+']').css('selected','selected');

        },
        error: function(xhr, ajaxOptions, thrownError) {
    
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);

        }
    });
})