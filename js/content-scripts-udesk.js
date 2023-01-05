{
    window.addEventListener("message", function(e){
        switch (e.origin) {
            case "https://1349541.s2.udesk.cn":
                if(e.data.name == 'getClotaTrs'){
                    chrome.runtime.sendMessage('getClotaTrs', function(res) {
                        if(res.code != 200) {
                            alert('getClotaTrs Error!');
                        } else {
                            window.postMessage({
                                data: res.data,
                                name: 'clotaTrs'
                            }, '*');
                        }
                    });
                } else if(e.data.name == 'initClotaTrs'){
                    chrome.runtime.sendMessage('initClotaTrs', function(res) {
                        if(res.code != 200) {
                            alert('initClotaTrs Error!');
                        }
                    });
                } else if(e.data.name == 'checkPermission'){
                    chrome.runtime.sendMessage('checkPermission', function(res) {
                        console.log('checkPermission:', res);
                        if(res.code != 200) {
                            alert('checkPermission Error!');
                        } else {
                            window.postMessage({
                                data: res.data,
                                name: 'permission'
                            }, '*');
                        }
                    });
                }
                break;
        
            default:
                break;
        }
    }, false);

    console.log('CoolShow is running.');
    setTimeout(() => {
        chrome.runtime.sendMessage('checkPermission', function(res) {
            var s = document.createElement('script');
            s.src = chrome.runtime.getURL('js/workAssist.js');
            s.onload = function() {
                this.parentNode.removeChild(this);
            };
            (document.head || document.documentElement).appendChild(s);
        });
    }, 2000);  
}