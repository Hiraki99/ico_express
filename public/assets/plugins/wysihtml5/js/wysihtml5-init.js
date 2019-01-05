$(document).ready(function() {

    $('#content_news').wysihtml5();
    var editorObj = $("#content_news").data('wysihtml5');
    var editor = editorObj.editor;
    editor.setValue($("#content_news").data('content'));

    $("#post_news").on('submit', function (e){
        // e.preventDefault();
        if($("#article_title").val()==''){
            alert("Error article Title empty");
            return false;
        }
        if($("#short_title").val()==''){
            alert("Short Title Empty");
            return false;
        }
        if($("#content_news").val()==''){
            alert("Error Content News empty");
            return false;
        }
        if($("#meta_description").val()==''){
            alert("Error Meta Description empty");
            return false;
        }
        if($("#meta_keyword").val()==''){
            alert("Error Meta Keyword empty");
            return false;
        }
    });
});

