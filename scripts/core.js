var settingKey = "chatworkstamp_setting"; 
var stampSize = 100;

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
 *     "iconClass": [アイコンのクラス] (array)
 * }
 */
function createButtonElement(args){
    var elem = $("<li>");
    
    elem.attr("role", "button");
    elem.addClass("_showDescription");
    if(args.buttonClass){
      for(var i = 0; i < args.buttonClass.length; i++){
        elem.addClass(args.buttonClass[i]);
      }
    }
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

// stampがクリックされたときの処理
function insertStampFunction(previewId) {
  var tag = "[preview id=" + previewId + " ht=" + stampSize + "]";

  insertTag(tag);
  
  // shiftキーが押されていたら、閉じない
  if(!event.shiftKey){
    closeTooltip("_stampList");
  }
  
  // ctrlキーが押されていたら、そのまま送信
  if(event.ctrlKey){
    $("#_sendButton").click();
  }
  
  var rid = location.hash.replace("#!", "");
  // ローカルストレージに保存
  chrome.runtime.sendMessage({method: "addRecentStamp", value: previewId, roomid: rid }, function(response) {});
}

function loadGallery(gallery) {
  $("#_chatFileListTip ul._cwLTList").children("li").each(function(i, elem) {
    var fileNameElem = $(elem).find("p._fileName");
    if(!fileNameElem) return true; // continue
    
    var fileNameSplit = fileNameElem.text().split('.');
    var type = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
    if(type !== "jpg" && type !== "jpeg" && type !== "png" && type !== "gif" && type !== "bmp") return true;
    
    var fileId = $(elem).attr("data-cwui-lt-value");
    
    var stampLi = $("<li>");
    stampLi.css("display", "inline-block");
    
    var stampImg = $("<img>");
    stampImg
      .attr("src", "https://www.chatwork.com/gateway.php?cmd=preview_file&bin=1&file_id=" + fileId)
      .attr("title", fileNameElem.text());
    
    var stampDiv = $("<div>")
      .addClass("stamp")
      .attr("stamp_id", fileId)
      .append(stampImg);
      
    stampDiv.click(function(){
      var fid = $(this).attr("stamp_id");
      insertStampFunction(fid);
    });
    
    stampLi.append(stampDiv);
    
    gallery.append(stampLi);
  });
}

function loadRecentUseGallery(gallery) {
  chrome.runtime.sendMessage({method: "getLocalStorage"}, function(response) {
    if(response.data) {
      var setting = JSON.parse(response.data);
      var rid = location.hash.replace("#!", "");
      
      if (setting.recent_use && setting.recent_use[rid]) {
        for (var i = 0; i < setting.recent_use[rid].length; i++) {
          var fileId = setting.recent_use[rid][setting.recent_use[rid].length - 1 - i];
          
          var stampLi = $("<li>");
          stampLi.css("display", "inline-block");
          
          var stampImg = $("<img>");
          stampImg
            .attr("src", "https://www.chatwork.com/gateway.php?cmd=preview_file&bin=1&file_id=" + fileId);
          
          var stampDiv = $("<div>")
            .addClass("stamp")
            .attr("stamp_id", fileId)
            .append(stampImg);
            
          stampDiv.click(function(){
            var fid = $(this).attr("stamp_id");
            insertStampFunction(fid);
          });
          
          stampLi.append(stampDiv);
          
          gallery.append(stampLi);
        }
      }
      
    }
  });
}

// LINEスタイルの適用
function applyLineStyle(isApply) {
  if(isApply){
    var styleTag = $('<style class="css_line_style">' 
    + '.chatTimeLineBorder,.dateHead{border-top:0}#_chatContent,#_messageSearchResultBox{background-image:url(http://allstar002.up.seesaa.net/image/image-74d21.jpg);background-size:cover}.dateContent{color:#fff;border-radius:15px;background:rgba(100,100,100,.3);padding:0 8px}.chatName,.timeStamp{color:#fff}.chatTimeLineMessageMine .avatarSpeaker .avatarMedium{transform:scale(-1,1)}.searchResultListBox .chatTimeLineMessageArea{padding:0 30px 0 68px}.chatInfo{border-radius:10px}.chatInfo>.title{border-radius:10px 10px 0 0}.chatInfoTaskArea,.chatInfoTaskMetaArea{border-radius:0 0 10px 10px}.chatTimeLineMessage .chatTimeLineMessageInner{border-top:1px solid rgba(255,255,255,0)!important;border-bottom:1px solid rgba(255,255,255,0)!important}.chatTimeLineMessage .actionNav,.chatTimeLineMessage .chatTimeLineMessageHover{background:rgba(248,251,255,.5)!important}.chatTimeLineMessageMine{text-align:right;background:rgba(255,255,255,0)!important}.chatTimeLineMessageMine .chatTimeLineMessageHover{background:rgba(248,251,255,.5)!important}.chatTimeLineMessageMine .actionNav{background:rgba(255,239,239,.5)!important;border-right:1px solid pink!important;border-bottom:1px solid pink!important;border-left:1px solid pink!important}.chatTimeLineMessageMine .chatCode,.chatTimeLineMessageMine .chatInfo,.chatTimeLineMessageMine .chatQuote{text-align:left}.chatTimeLineMessageMine .avatarSpeaker{float:right;margin-top:15px}.chatTimeLineMessageMention{background:rgba(255,255,255,0)!important}.chatTimeLineMessageMention .actionNav,.chatTimeLineMessageMention .chatTimeLineMessageHover{background:rgba(231,239,228,.5)!important}.chatTimeLineMessage pre{background:#fff;display:inline-block;position:relative;border:1px solid #fff;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:15px;margin-left:10px;padding:3px 10px;max-width:90%}.chatTimeLineMessage pre:after,.chatTimeLineMessage pre:before{content:"";border-style:solid;border-color:#fff transparent transparent;position:absolute;top:13px;display:inline-block}.chatTimeLineMessage pre:before{border-width:9px 9px 0;left:-10px;margin-top:-9px;z-index:-1}.chatTimeLineMessage pre:after{border-width:12px 12px 0;left:-13px;margin-top:-10px}.chatTimeLineMessageMention pre{background:#bfff7f;display:inline-block;position:relative;border:1px solid #bfff7f;margin-left:10px}.chatTimeLineMessageMention pre:after,.chatTimeLineMessageMention pre:before{content:"";border-color:#bfff7f transparent transparent;position:absolute;display:inline-block}.chatTimeLineMessageMention pre:before{border-width:9px 9px 0;left:-10px;margin-top:-9px}.chatTimeLineMessageMention pre:after{border-width:12px 12px 0;left:-13px;margin-top:-10px}.chatTimeLineMessageMine pre{background:#bfff7f;display:inline-block;position:relative;border:1px solid #bfff7f;text-align:left;right:10px}.chatTimeLineMessageMine pre:after,.chatTimeLineMessageMine pre:before{content:"";display:inline-block;border-color:#bfff7f transparent transparent;position:absolute;left:auto}.chatTimeLineMessageMine pre:before{border-width:9px 9px 0;right:-9px;margin-top:-9px}.chatTimeLineMessageMine pre:after{border-width:12px 12px 0;right:-12px;margin-top:-10px}.chatTimeLineMessage pre.hasImagePreview{background:rgba(255,255,255,0);border:1px solid rgba(255,255,255,0)}.chatTimeLineMessage pre.hasImagePreview:after,.chatTimeLineMessage pre.hasImagePreview:before{border-color:rgba(255,255,255,0)}@-webkit-keyframes elementInserted{0%{opacity:0}100%{opacity:1}}div._chatTimeLineMessageBox.chatTimeLineMessageInner>div.chatTimeLineMessageArea.clearfix>pre>div>img.imagePreview{-webkit-animation:elementInserted 1ms 1}'
    + '</style>');
    
    $("html").append(styleTag);
  } else {
    $("style.css_line_style").remove();
  }
}

// background.jsからの呼び出し
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.method == "applyLineStyle") {
      applyLineStyle(request.value);
    }
    if (request.method == "applyStampSize") {
      stampSize = request.value;
    }
    sendResponse({});
  }
);

(function() {
  if (!isChatPage()) return;
  
  var wrapperDiv = $("#_wrapper");
  
  // stamp一覧ツールチップ用div生成
  var stampListDiv = createTooltipDivElement("_stampList");

  // 最近追加したスタンプ
  var stampGalleryRecentAdd = $("<ul>");
  stampGalleryRecentAdd.attr("id", "_stampGalleryRecentAdd")
    .addClass("_stampGallery")
    .addClass("recentAdd")
    .css("display", "block");
    
  var stampGalleryRecentUse = $("<ul>");
  stampGalleryRecentUse.attr("id", "_stampGalleryRecentUse")
    .addClass("_stampGallery")
    .addClass("recentUse")
    .css("display", "none");
    
  stampListDiv.append(stampGalleryRecentAdd);
  stampListDiv.append(stampGalleryRecentUse);
  
  var tooltipFooter = $("<div>");
  tooltipFooter.addClass("tooltipFooter")
    .append($('<div class="tooltipFooterMessage">"Shift" to multi-select, "Ctrl" to send</div>'))
    .append($('<div class="galleryType"><a class="typeRecentAdd selected">recent add</a> | <a class="typeRecentUse">recent use</a></div>'));
  
  $(document).on("click", "#_stampList .galleryType .typeRecentAdd", function() {
    stampGalleryRecentAdd.show();
    stampGalleryRecentUse.hide();
    $("#_stampList .galleryType .typeRecentAdd").addClass("selected");
    $("#_stampList .galleryType .typeRecentUse").removeClass("selected");
  });
  
  $(document).on("click", "#_stampList .galleryType .typeRecentUse", function() {
    stampGalleryRecentAdd.hide();
    stampGalleryRecentUse.show();
    $("#_stampList .galleryType .typeRecentAdd").removeClass("selected");
    $("#_stampList .galleryType .typeRecentUse").addClass("selected");
  });
  
  stampListDiv.append(tooltipFooter);
  
  wrapperDiv.append(stampListDiv);
  
  // タグ一覧ツールチップ用div生成
  var tagListDiv = createTooltipDivElement("_tagList");
  
  var tagList = $("<ul>");
  
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
    iconClass: ["icoFontEmoticon", "icoSizeLarge"],
    buttonClass: ["chatInput__stamp"]
  });
  
  stampBtn.click(function() {
    var list = $("#_stampList");
    
    if(closeTooltip("_stampList")) return;
    
    $("#_chatFileAll").click(); // ファイル一覧をロードさせる
    $("#_chatFileAll").click(); // ポップアップが開いてしまうので、もう一回クリックで閉じる
    
    var galleryRecentAdd = $("#_stampGalleryRecentAdd");
    galleryRecentAdd.empty();
    
    var galleryRecentUse = $("#_stampGalleryRecentUse");
    galleryRecentUse.empty();
    
    if(!$("#_chatFileAll").hasClass("btnDisable")) {
      loadGallery(galleryRecentAdd);
      loadRecentUseGallery(galleryRecentUse);
    }
    
    var tooltipHeight = 300;
    var tooltipWidth = $("#_chatContent").width() - 12;
    var tooltipPosX = $(this).offset().left - 150;
    var tooltipPosY = $(this).offset().top - tooltipHeight - 14;
    
    list.css("left", tooltipPosX)
      .css("top", tooltipPosY)
      .css("z-index", "1001")
      .width(tooltipWidth)
      .height(tooltipHeight);
    
    var listTriangle = $("#_stampListTriangle");
    listTriangle.css("left", $(this).offset().left - tooltipPosX + 4);
    
    list.show();
  });
  
  chatToolbarEl.append(stampBtn);
  
  // タグ一覧ボタン
  var tagBtn = createButtonElement({
    id: "_showTagSelect",
    label: "Tags",
    iconClass: ["icoFontActionEdit", "icoSizeLarge"],
    buttonClass: ["chatInput__tag"]
  });
  
  tagBtn.click(function() {
    var list = $("#_tagList");
    
    if(closeTooltip("_tagList")) return;
    
    var tooltipHeight = 95;
    var tooltipWidth = 70;
    var tooltipPosX = $(this).offset().left - 25;
    var tooltipPosY = $(this).offset().top - tooltipHeight - 14;
    
    list.css("left", tooltipPosX)
      .css("top", tooltipPosY)
      .css("z-index", "1001")
      .width(tooltipWidth)
      .height(tooltipHeight);
    
    var listTriangle = $("#_tagListTriangle");
    listTriangle.css("left", $(this).offset().left - tooltipPosX + 4);
    
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
  
  document.addEventListener('webkitAnimationStart', function(event){
    if (event.animationName == 'elementInserted') {
      var evTarget = $(event.target);
      evTarget.parent().parent().addClass("hasImagePreview");
    }
  }, true);
  
  // 設定ロード

  chrome.runtime.sendMessage({method: "getLocalStorage"}, function(response) {
    if(response.data) {
      var setting = JSON.parse(response.data);
      if (setting["use_line_style"]) {
        applyLineStyle(true);
      }
      if (setting["stamp_size"]) {
        stampSize = setting["stamp_size"];
      }
    }
  });
  
  chrome.runtime.sendMessage({method: "pageActionShow"}, function(response) {});
})();
