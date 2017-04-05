var settingKey = "chatworkstamp_setting"; 
var useLineStyle = false;
var stampSize = 100;

var getUseLineStyle = function() {
    return useLineStyle;
};

var getStampSize = function() {
    return stampSize;
};

var setUseLineStyle = function(v) {
    if(v){
        useLineStyle = true;
    } else {
        useLineStyle = false;
    }
};

var setStampSize = function(v) {
    if(isNaN(v)) return false;
    if(v <= 0) return false;
    if(v >= 1000) return false;
    
    stampSize = Math.round(v);
    applyStampSize();
    return true;
};

var saveSetting = function() {
    var setting = new Object();
    setting["use_line_style"] = useLineStyle;
    setting["stamp_size"] = stampSize;
    
    var str = JSON.stringify(setting);
    localStorage.setItem(settingKey, str);
};

var loadSetting = function() {
    var setting = localStorage.getItem(settingKey);
    if(setting){
        return JSON.parse(setting);
    } else {
        return null;
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage") {
        sendResponse({data: localStorage[settingKey]});
    } else if (request.method == "pageActionShow") {
        chrome.pageAction.show(sender.tab.id);
        sendResponse({});
    } else {
        sendResponse({});
    }
});

var applyLineStyle = function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {method: "applyLineStyle", value:useLineStyle}, function(response) {});
  });
};

var applyStampSize = function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {method: "applyStampSize", value:stampSize}, function(response) {});
  });
}