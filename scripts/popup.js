$(function(){
    var BG = chrome.extension.getBackgroundPage();
    
    window.addEventListener('unload', function(ev){
        BG.saveSetting();
    }, false);

    var setting = BG.loadSetting();
    
    if(setting){
        BG.setUseLineStyle(setting["use_line_style"]);
        BG.setStampSize(setting["stamp_size"]);
    }
    
    if(BG.getUseLineStyle()){
      $('.chatwork_stamp_setting .use_line_style').prop('checked', true);
    } else {
      $('.chatwork_stamp_setting .use_line_style').prop('checked', false);
    }
    $('.chatwork_stamp_setting .stamp_size').val(BG.getStampSize());
    
    $('.chatwork_stamp_setting .use_line_style').on('change', function(){
        BG.setUseLineStyle($(this).prop('checked'));
        BG.applyLineStyle();
    });
    $('.chatwork_stamp_setting .stamp_size').on('change', function(){
        BG.setStampSize($(this).val());
    });
});