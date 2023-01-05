{
    setInterval(() => {
        if(!document.querySelector('div.common_page_table button.el-button.el-button--primary.el-button--medium').onclick) {
            document.querySelector('div.common_page_table button.el-button.el-button--primary.el-button--medium').onclick = () => {
                document.querySelectorAll('.coolshoworderradio').forEach(ele => {
                    ele.remove();
                });
            }
        }
        if(document.querySelector('div.el-table__body-wrapper.is-scrolling-left').querySelector('tr td:first-child') && !document.querySelector('.coolshoworderradio')) {
            let thNum = {};
            let thEles = document.querySelectorAll('.el-table__header-wrapper th');
            for (let i = 0; i < thEles.length; i++) {
                switch (thEles[i].innerText) {
                    case '产品订单编号':
                        thNum.id = i + 1;
                        break;
                    case 'SPU名称':
                        thNum.product = i + 1;
                        break;
                    case '渠道名称':
                        thNum.origin = i + 1;
                        break;
                    case '下单时间':
                        thNum.time = i + 1;
                        break;
                    case '出行人信息':
                        thNum.info = i + 1;
                        break;
                    default:
                        break;
                }
            }

            let parentEles = document.querySelector('div.el-table__body-wrapper.is-scrolling-left').querySelectorAll('tr td:first-child');
            parentEles.forEach(e => {
                let radio_order = document.createElement('INPUT');
                radio_order.setAttribute('type', 'checkbox');
                radio_order.style.marginLeft = '10px';
                radio_order.className = "coolshoworderradio";
                radio_order.onclick = () => {
                    let trs = [];
                    let radios = document.querySelectorAll('.coolshoworderradio');
                    radios.forEach(e => {
                        if(e.checked) {
                            trs.push({
                                id: e.parentElement.parentElement.querySelector(`td:nth-child(${thNum.id})`).innerText + '(crm)',  //订单号
                                product: e.parentElement.parentElement.querySelector(`td:nth-child(${thNum.product})`).innerText,    //产品名
                                origin: '融创文旅俱乐部小程序', //下单渠道
                                time: e.parentElement.parentElement.querySelector(`td:nth-child(${thNum.time})`).innerText,  //下单时间
                                info: e.parentElement.parentElement.querySelector(`td:nth-child(${thNum.info})`).innerText,   //客户信息
                            });
                        }
                    });
                    console.log(trs);
                    chrome.runtime.sendMessage(trs, function(res) {
                        if(res.code != 200) {
                            alert('error:' + res.data);
                        }
                    });
                };
                e.appendChild(radio_order);
            });
        }
    }, 2000);
}
