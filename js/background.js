let clota = {};

function getControl() {
	return new Promise((reject, resolve) => {
		fetch('https://gitee.com/jokerbot/coolshow/raw/master/control.json', {
			method: 'GET',
			mode: 'no-cors'
		}).then(res => {
			return res.json();
		}).then(control => {
			fetch('../manifest.json', {
				method: 'GET',
				mode: 'no-cors'
			}).then(res => {
				return res.json();
			}).then(manifest => {
				console.log('version: ' + (manifest.version == control.version), 'available: ' + control.available, 'all: ' + !((manifest.version == control.version) && control.available));
				if(!((manifest.version == control.version) && control.available)) {
					reject(false);
				} else {
					reject(true);
				}
			}).catch(err => {
				resolve(err)
			});
		}).catch(err => {
			resolve(err)
		});
	});
}
getControl();
setInterval(() => {
	getControl();
}, 2 * 60 * 60 * 1000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	switch (sender.origin) {
		case "http://parkmanage.sunacctg.com":
			console.log('clota 来消息了！');
			clota.trs = request;
			sendResponse({
				code: 200,
				data: ''
			});
			break;
		case "http://crm-mp-tenant.sunacctg.com":
			console.log('sunaccrm 来消息了！');
			clota.trs = request;
			sendResponse({
				code: 200,
				data: ''
			});
			break;
		case "https://snow.sunacctg.com":
			console.log('snow 来消息了！');
			clota.trs = request;
			sendResponse({
				code: 200,
				data: ''
			});
			break;
		case "https://1349541.s2.udesk.cn":
			console.log('udesk 来消息了！');
			if(request == 'getClotaTrs') {
				sendResponse({
					code: 200,
					data: clota.trs
				});
			} 
			if(request == 'initClotaTrs') {
				clota = {};
				sendResponse({
					code: 200,
					data: ''
				});
			} 
			if(request == 'checkPermission') {
				getControl().then(res => {
					console.log('getControl()', res);
					sendResponse({
						code: 200,
						data: {
							permission: res
						}
					});
				}).catch(err => {
					sendResponse({
						code: 200,
						data: {
							permission: false
						}
					});
				});
			}
			break;
		default:
			break;
	}
	return true;
});
