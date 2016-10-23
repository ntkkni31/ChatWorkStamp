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

function createTooltipDivElement(id) {
    var listDiv = $("<div>");
    listDiv.attr("id", id)
      .attr("role", "tooltip")
      .addClass("toolTip toolTipWhite mainContetTooltip")
      .css("opacity", "1")
      .css("z-index", "1")
      .css("display", "none");
      
    var triangle = $("<div>");
    triangle.attr("id", id + "Triangle")
      .addClass("_cwTTTriangle toolTipTriangle toolTipTriangleWhiteBottom");
    
    listDiv.append(triangle);
    
    return listDiv;
}

function closeTooltip(id){
  var list = $("#" + id);
  if(list.is(":visible")){
    list.css("z-index", "1");
    list.fadeOut(200);
    
    return true;
  }
  return false;
}

function insertTag(tag) {
  var chatTextArea = document.getElementById('_chatText');
  var p = chatTextArea.selectionStart;
  chatTextArea.value = chatTextArea.value.substr(0, p) + tag + chatTextArea.value.substr(p);

  chatTextArea.focus();
  var caretPos = p + tag.indexOf("]") + 1; // 最初の閉じカッコの次にキャレットを移動
  chatTextArea.setSelectionRange(caretPos, caretPos);
}

function insertStampFunction(previewId) {
  var tag = "[preview id=" + previewId + " ht=100]";

  insertTag(tag);
  
  closeTooltip("_stampList");
}
    
(function() {
  if (!isChatPage()) return;

    var wrapperDiv = $("#_wrapper");
    
    // stamp一覧ツールチップ用div生成
    var stampListDiv = createTooltipDivElement("_stampList");

    var stampGallery = $("<ul>");
    stampGallery.attr("id", "_stampGallery")
      .css("overflow", "auto")
      .height("99%");
    
    stampListDiv.append(stampGallery);
    
    wrapperDiv.append(stampListDiv);
    
    // タグ一覧ツールチップ用div生成
    var tagListDiv = createTooltipDivElement("_tagList");
    
    var tagList = $("<ul>");
    tagList.css("overflow", "auto")
      .height("99%");
    
    var tagNames = ["info", "title", "code"];
    for(var i = 0; i < tagNames.length; i++) {
      var tagElem = $("<li>");
      tagElem.html(tagNames[i]);
      
      tagElem.click(function() {
        var tag = "[" + $(this).html() + "][/" + $(this).html() + "]";
        insertTag(tag);
        closeTooltip("_tagList");
      });
      
      tagList.append(tagElem);
    }
    
    tagListDiv.append(tagList);
    
    wrapperDiv.append(tagListDiv);
    
    //////
    
    var chatToolbarEl = $("#_chatSendTool");

    // stampボタン
    var stampBtn = createButtonElement({
      id: "_showStampSelect",
      label: "Stamps: express yourself!",
      iconClass: ["icoFontFile", "icoSizeLarge"]
    });
    
    stampBtn.click(function() {
      var list = $("#_stampList");
      
      if(closeTooltip("_stampList")) return;
        
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
    });
    
    chatToolbarEl.append(stampBtn);
    
    var tagBtn = createButtonElement({
      id: "_showTagSelect",
      label: "Tags",
      iconClass: ["icoFontActionEdit", "icoSizeLarge"]
    });
    
    tagBtn.click(function() {
      var list = $("#_tagList");
      
      if(closeTooltip("_tagList")) return;
      
      var tooltipHeight = 100;
      var tooltipWidth = 70;
      var tooltipPosX = $(this).offset().left - 25;
      var tooltipPosY = $(this).offset().top - tooltipHeight - 13;
      
      list.css("left", tooltipPosX)
        .css("top", tooltipPosY)
        .css("z-index", "1001")
        .width(tooltipWidth)
        .height(tooltipHeight);
      
      var listTriangle = $("#_tagListTriangle");
      listTriangle.css("left", $(this).offset().left - tooltipPosX + 3);
      
      list.show();
    });
    
    chatToolbarEl.append(tagBtn);
    
    // 別のところをクリックしたら自動的にポップアップを消す
    $(document).on('click', function(evt){
      if( !$(evt.target).closest('#_stampList').length && 
        !$(evt.target).closest('#_showStampSelect').length){
        closeTooltip("_stampList");
      }
      if( !$(evt.target).closest('#_tagList').length && 
        !$(evt.target).closest('#_showTagSelect').length){
        closeTooltip("_tagList");
      }
    });
})();
