{
    setInterval(() => {
        if(!document.querySelector('div > div.filter-head > form button.ivu-btn.ivu-btn-primary').onclick) {
            document.querySelector('div > div.filter-head > form button.ivu-btn.ivu-btn-primary').onclick = () => {
                document.querySelectorAll('.coolshoworderradio').forEach(ele => {
                    ele.remove();
                });
            }
        }
        if(document.querySelectorAll('div.el-table__body-wrapper.is-scrolling-left .el-table__body')[0].querySelector('tr > td:first-child > div') && !document.querySelector('.coolshoworderradio')) {
            let thNum = {};
            let thEles = document.querySelector('.el-table__header-wrapper').querySelectorAll('th');
            for (let i = 0; i < thEles.length; i++) {
                switch (thEles[i].innerText) {
                    case '订单号':
                        thNum.id = i + 1;
                        break;
                    case '产品与数量':
                        thNum.product = i + 1;
                        break;
                    case '下单企业':
                        thNum.origin = i + 1;
                        break;
                    case '下单时间':
                        thNum.time = i + 1;
                        break;
                    case '游客/手机号':
                        thNum.info = i + 1;
                        break;
                    default:
                        break;
                }
            }

            let parentEles = document.querySelectorAll('div.el-table__body-wrapper.is-scrolling-left .el-table__body')[0].querySelectorAll('tr > td:first-child > div');
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
                                id: e.parentElement.parentElement.parentElement.querySelector(`td:nth-child(${thNum.id})`).innerText + '(clota)',  //订单号
                                product: e.parentElement.parentElement.parentElement.querySelector(`td:nth-child(${thNum.product})`).innerText,    //产品名
                                origin: e.parentElement.parentElement.parentElement.querySelector(`td:nth-child(${thNum.origin})`).innerText, //下单渠道
                                time: e.parentElement.parentElement.parentElement.querySelector(`td:nth-child(${thNum.time})`).innerText,  //下单时间
                                info: e.parentElement.parentElement.parentElement.querySelector(`td:nth-child(${thNum.info})`).innerText,   //客户信息
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