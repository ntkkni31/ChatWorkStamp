/*
 * チャット画面かチェック
 */
function isChatPage() {
    var ret = false,
    statusBtn = document.getElementById("_myStatusButton");
    if (!!statusBtn) {
        ret = true;
    }
    return ret;
}

/*
 * ツールバーのボタン生成
 * {
 *     "id": [id],
 *     "label": [マウスオーバー時のコメント],
 *     "iconClass": [アイコンのクラス]
 * }
 */
function createButtonElement(args){
    var elem = $("<li>");
    
    elem.attr("role", "button");
    elem.addClass("_showDescription");

    elem.css("display", "inline-block");

    elem.attr("id", args.id);
    elem.attr("aria-label", args.label);

    var innerElem = $("<span>");
    if(args.iconClass){
      for(var i = 0; i < args.iconClass.length; i++){
        innerElem.addClass(args.iconClass[i]);
      }
    }
    if(args.color){
      innerElem.css("color", args.color);
    }
    
    elem.append(innerElem);
    return elem;
}

function closeStampListTooltip(){
  var list = $("#_stampList");
  if(list.is(":visible")){
    list.css("z-index", "1");
    list.fadeOut(200);
    
    return true;
  }
  return false;
}

function insertStampFunction(previewId) {
  var chatTextArea = document.getElementById('_chatText');
  var tag = "[preview id=" + previewId + " ht=100]";

  var p = chatTextArea.selectionStart;
  chatTextArea.value = chatTextArea.value.substr(0, p) + tag + chatTextArea.value.substr(p);

  chatTextArea.focus();
  var caretPos = p + tag.length;
  chatTextArea.setSelectionRange(caretPos, caretPos);
  
  closeStampListTooltip();
};
    
(function() {
  if (!isChatPage()) return;

    var wrapperDiv = $("#_wrapper");
    
    var stampListDiv = $("<div>");
    stampListDiv.attr("id", "_stampList")
      .attr("role", "tooltip")
      .addClass("toolTip toolTipWhite mainContetTooltip")
      .css("opacity", "1")
      .css("z-index", "1")
      .css("display", "none");
      
    var triangle = $("<div>");
    triangle.attr("id", "_stampListTriangle")
      .addClass("_cwTTTriangle toolTipTriangle toolTipTriangleWhiteBottom");
    
    stampListDiv.append(triangle);

    var stampGallery = $("<ul>");
    stampGallery.attr("id", "_stampGallery")
      .css("overflow", "auto")
      .height("99%");
    
    stampListDiv.append(stampGallery);
    
    wrapperDiv.append(stampListDiv);
    
    //////
    
    var chatToolbarEl = $("#_chatSendTool");

    // stampボタン
    stampBtn = createButtonElement({
      id: "_showStampSelect",
      label: "Stamps: express yourself!",
      iconClass: ["icoFontFile"]
    });
    
    stampBtn.click(function() {
      var list = $("#_stampList");
      
      if(!closeStampListTooltip()){
        
        $("#_chatFileAll").click(); // ファイル一覧をロードさせる
        $("#_chatFileAll").click(); // ポップアップが開いてしまうので、もう一回クリックで閉じる
      
        var gallery = $("#_stampGallery");
        gallery.empty();
        
        $("#_chatFileListTip ul._cwLTList").children("li").each(function(i, elem) {
          var fileNameElem = $(elem).find("p._fileName");
          if(!fileNameElem) return true; // continue
          
          var fileNameSplit = fileNameElem.text().split('.');
          var type = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
          if(type !== "jpg" && type !== "jpeg" && type !== "png" && type !== "gif" && type !== "bmp") return true;
          
          var fileId = $(elem).attr("data-cwui-lt-value");
          
          var stampLi = $("<li>");
          stampLi.css("display", "inline-block");
          
          var stampImg = $("<input>");
          stampImg.attr("type", "image")
            .attr("src", "https://www.chatwork.com/gateway.php?cmd=preview_file&bin=1&file_id=" + fileId)
            .width(100)
            .height(100)
            .addClass("stamp")
            .attr("title", fileNameElem.text());
          stampImg.click(function(){
            insertStampFunction(fileId);
          });
          
          stampLi.append(stampImg);
          
          gallery.append(stampLi);
        });
        
        var tooltipHeight = 300;
        var tooltipWidth = $("#_chatContent").width() - 12;
        var tooltipPosX = $(this).offset().left - 150;
        var tooltipPosY = $(this).offset().top - tooltipHeight - 13;
        
        list.css("left", tooltipPosX)
          .css("top", tooltipPosY)
          .css("z-index", "1001")
          .width(tooltipWidth)
          .height(tooltipHeight);
        
        var listTriangle = $("#_stampListTriangle");
        listTriangle.css("left", $(this).offset().left - tooltipPosX + 3);
        
        list.show();
      }
    });
    
    chatToolbarEl.append(stampBtn);
    
    // 別のところをクリックしたら自動的にポップアップを消す
    $(document).on('click', function(evt){
      if( !$(evt.target).closest('#_stampList').length && 
        !$(evt.target).closest('#_showStampSelect').length){
        closeStampListTooltip();
      }
    });
})();
