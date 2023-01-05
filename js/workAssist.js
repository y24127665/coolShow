let clotaTrs = [];
window.addEventListener("message", function(e){
    if(e.data.name == 'clotaTrs') {
        console.log('clotaTrs(beforeUpdate):', clotaTrs);
        clotaTrs = e.data.data;
        console.log('clotaTrs(afterUpdate):', clotaTrs);
    } else if(e.data.name == 'permission') {
        if(e.data.data.permission) {
            console.log('CoolShow has injected page.');
            main();
        }
    }
}, false);

function main() {
    //autoForm
    {
        let parentEle = document.querySelector("body > div.header-section");
        let btn_writeForm = document.createElement('button');
        parentEle.appendChild(btn_writeForm);
        btn_writeForm.innerText = 'writeForm';
        btn_writeForm.style.float = 'left';
        btn_writeForm.style.marginTop = '12px';
        btn_writeForm.style.marginLeft = '14px';
        btn_writeForm.className = "btn btn-sm btn-success";
        btn_writeForm.onclick = () => {
            if(!$('.tab-pane.active > .ember-view.large.ticket-form-modal.new-ticket-inside.in')[0]) {
                return;
            }
            let changeValue = function(inputDom,newText){
                let lastValue = inputDom.value;
                inputDom.value = newText;
                let event = new Event('input', { bubbles: true });
                event.simulated = true;
                let tracker = inputDom._valueTracker;
                if (tracker) {
                    tracker.setValue(lastValue);
                }
                inputDom.dispatchEvent(event);
            }
            // 状态->已解决
            {
                if($('label:contains("状态")').parent().find('div > a')[0].innerText == '开启') {
                    // 先触发a标签的touchstart事件
                    $('label:contains("状态")').parent().find('div > a').trigger('touchstart');
                    // 然后触发li或者li内部div的mouseup事件，通过冒泡触发上层事件
                    $('div:contains("已解决")').parent().trigger('mouseup');
                }
            }
            //工单流转方式->未流转
            $('label:contains("模板")').parent().find('label:contains("咨询")').parent().click();    //点击模板->咨询li
            setTimeout(() => {
                let tel = $('label:contains("电话")').parent('div.form-group').find('.flex-1 > input')[0];    //进电电话input
                let clientName = $('label:contains("客户姓名")').parent('div.form-group').find('div.ember-view.custom-field-hook > input')[0];    //客户姓名input
                let phone = $('label:contains("联系方式")').parent('div.form-group').find('div.ember-view.custom-field-hook > input')[0];    //联系方式input
                let channel = $('label:contains("天津客服中心400电话")').parent('div.ember-view.custom-field-hook ul.dropdown-menu-ul.scrollbar > li')[0];;    //咨询渠道->天津客服中心400电话li
                let park = $('label:contains("业态")').parent('div.form-group').find('label:contains("乐园")').parent('li')[0];    //业态->乐园li
                let product = $('label:contains("咨询工单类别")').parent('div.form-group').find('label:contains("产品咨询")').parent('li')[0];    //咨询工单类别->产品咨询li
                let unrelated = $('label:contains("工单流转方式")').parent('div.form-group').find('label:contains("未流转")').parent('li')[0];    //工单流转方式->未流转
                {
                    // 查询是否有今日工单及未解决工单
                    if(document.getElementById('coolshowticketstoday')) {
                        $('.screen-pop > div')[0].removeChild(document.getElementById('coolshowticketstoday'));
                    }
                    $.ajax({
                        url: "/spa1/tickets/list",
                        type: "POST",
                        dataType: "json",
                        data: `{"all_conditions":[],"any_conditions":[],"column":"","filter_id":"search","group_by":null,"group_name":"","order":"","page":1,"page_size":30,"query":"${tel.value}","sort_by":[]}`,
                        contentType: "application/json"
                    }).then(res => {
                        let ticketsToday = 0;
                        let ticketsStatus = 0;
                        res.tickets.forEach(element => {
                            if(new Date(element.ticket.created_at).toDateString() == new Date().toDateString()) {
                                ticketsToday++;
                            }
                            if(element.ticket.status != '已解决') {
                                ticketsStatus++;
                            }
                        });
                        let divString = '';
                        if(ticketsToday) {
                            divString += `该来电号码今日已生成${ticketsToday}次工单！`;
                        }
                        if(ticketsStatus) {
                            divString += `该来电号码历史工单有${ticketsStatus}个未解决工单！`;
                        }
                        let div_ticketsToday = document.createElement('DIV');
                        div_ticketsToday.id = 'coolshowticketstoday'
                        div_ticketsToday.innerText = divString;
                        div_ticketsToday.style.color = 'red';
                        div_ticketsToday.style.fontWeight = 'bolder';
                        div_ticketsToday.style.marginBottom = '10px';
                        $('div.ticket-form-modal-body.ember-view.modal-body div.form')[0].insertBefore(div_ticketsToday, $('.upload-btn.ember-view').parent('div.form-group')[0]);
                    });
                }
                //修改工单描述对象
                let orderDescription = {
                    change: function(id, val) {
                        $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.querySelectorAll(`p:nth-child(${id})`)[0].innerText = val;
                        this.save();
                    },
                    append: function(val) {
                        let p_content = document.createElement('P');
                        $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.appendChild(p_content);
                        p_content.innerText = val;
                        this.save();
                    },
                    remove: function(id) {
                        let e = $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.querySelectorAll(`p:nth-child(${id})`)[0];
                        $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.removeChild(e);
                        this.save();
                    },
                    getLength: function() {
                        return $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.querySelectorAll('p').length;
                    },
                    getInnerText: function(id) {
                        return $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.querySelectorAll(`p:nth-child(${id})`)[0].innerText;
                    },
                    getObject: function(id) {
                        return $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.querySelectorAll(`p:nth-child(${id})`)[0]
                    },
                    save: function() {
                        // 触发iframe中body的submit事件
                        let e = new Event('submit', { bubbles: true });
                        e.simulated = true;
                        $('label:contains("描述")').parent('div').find('iframe').contents().find('#tinymce')[0].dispatchEvent(e);
                    }
                }

                //快捷填充工单描述
                function quickContent(title, ques, answ, fn) {
                    let parentEle = $(`div.mce-container-body.mce-flow-layout > div.mce-path.mce-flow-layout-item.mce-first`)[0];
                    let a_quickContent = document.createElement('a');
                    parentEle.appendChild(a_quickContent);
                    a_quickContent.innerText = title;
                    a_quickContent.className = "pull-left text-success font-sm";
                    a_quickContent.style.color = '#00B38B';
                    a_quickContent.style.marginRight = '15px'
                    a_quickContent.onclick = () => {
                        $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.innerHTML = '';
                        orderDescription.save();
                        orderDescription.append(ques);
                        orderDescription.append(answ);
                        let e = $(`label:contains("业态")`).parent('div.form-group').find('div.ember-view.custom-field-hook > div.chained_droplist.custom-filed-chained-droplist.ember-view.cascade-field > div:nth-child(2) > div.form-control > div.select-value')[0] || {};
                        if(e.innerText == "热雪奇迹") {
                            orderDescription.append($('#coolshowusername')[0].value + "@");
                        } else {
                            orderDescription.append($('#coolshowusername')[0].value);
                        }
                        orderDescription.save();
                        if(fn) {
                            fn();
                        }
                    }
                }
                {
                    {
                        let parentEle = $(`div.mce-container-body.mce-flow-layout > div.mce-path.mce-flow-layout-item.mce-first`)[0];
                        let a_quickContent = document.createElement('a');
                        parentEle.appendChild(a_quickContent);
                        a_quickContent.innerText = '要求退款';
                        a_quickContent.className = "pull-left text-success font-sm";
                        a_quickContent.style.color = '#00B38B';
                        a_quickContent.style.marginRight = '15px'
                        a_quickContent.onclick = () => {
                            window.postMessage({name: "getClotaTrs"}, '*');
                            setTimeout(() => {
                                $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.innerHTML = '';
                                orderDescription.save();
                                // 【订单号】
                                // 【游客姓名手机号】
                                // 【出行日期】
                                // 【具体内容】
                                // 【客户诉求】
                                // 【回电号码】

                                if(clotaTrs && (clotaTrs.length > 0)) {
                                    // orderDescription.append(`客户于${clotaTrs[0].time}在${clotaTrs[0].origin}购买的${clotaTrs[0].product}，因xxxxx原因要求退款，不认可退改规则`);
                                    // for (let i = 0; i < clotaTrs.length; i++) {
                                    //     orderDescription.append(`订单号：${clotaTrs[i].id}；${clotaTrs[i].info}；`);
                                    // }『』
                                    let all_id = '';
                                    let all_info = '';
                                    let all_time = '';
                                    for (let i = 0; i < clotaTrs.length; i++) {
                                        all_id += `『${clotaTrs[i].id}』`;
                                        all_info += `『${clotaTrs[i].info}』`;
                                        all_time += `『${clotaTrs[i].time}』`;
                                    }
                                    orderDescription.append(`【订单号】${all_id}`);
                                    orderDescription.append(`【游客姓名手机号】${all_info}`);
                                    orderDescription.append(`【下单日期】${all_time}`);
                                    orderDescription.append(`【具体内容】客户于${clotaTrs[0].time}在${clotaTrs[0].origin}购买的${clotaTrs[0].product}等票，因xxxxx原因要求退款，不认可退改规则`);
                                    orderDescription.append(`【客户诉求】退款`);
                                } else {
                                    // orderDescription.append(`客户于xxxxx从xxxxx购买的xxxxx，因xxxxx原因要求退款，不认可退改规则`);
                                    // orderDescription.append(`订单号：xxxxx；出行人姓名：xxxxx；下单/回电手机号：xxxxx；`);

                                    orderDescription.append(`【订单号】`);
                                    orderDescription.append(`【游客姓名手机号】`);
                                    orderDescription.append(`【下单日期】`);
                                    orderDescription.append(`【具体内容】客户从xxxxx购买的xxxxx，因xxxxx原因要求退款，不认可退改规则`);
                                    orderDescription.append(`【客户诉求】退款`);
                                }
                                orderDescription.append(`【回电号码】${tel.value}`);
                                orderDescription.append('告知登记反馈');
    
                                let e = $(`label:contains("业态")`).parent('div.form-group').find('div.ember-view.custom-field-hook > div.chained_droplist.custom-filed-chained-droplist.ember-view.cascade-field > div:nth-child(2) > div.form-control > div.select-value')[0] || {};
                                if(e.innerText == "热雪奇迹") {
                                    orderDescription.append($('#coolshowusername')[0].value + "@");
                                } else {
                                    orderDescription.append($('#coolshowusername')[0].value);
                                }
                                orderDescription.save();
                                window.postMessage({name: "initClotaTrs"}, '*');
                            }, 100);
                            $('label:contains("状态")').parent().find('div > a').trigger('touchstart');
                            $('div:contains("解决中")').parent().trigger('mouseup');
                            $(`label:contains('退改政策')`).parent('li').click();
                            $(`label:contains('天津内部流转')`).parent('li').click();
                        }
                    }
                    quickContent('是否开园(是)', '客户来电咨询园区是否开园', '告知开园', () => {
                        $(`label:contains('文旅城基本信息')`).parent('li').click();
                    });
                    quickContent('是否开园(否)', '客户来电咨询园区是否开园', '告知闭园', () => {
                        $(`label:contains('文旅城基本信息')`).parent('li').click();
                    });
                    quickContent('是否需要核酸(是)', '客户来电咨询入园是否需要核酸检测证明', '告知需要', () => {
                        $(`label:contains('游玩政策')`).parent('li').click();
                    });
                    quickContent('是否需要核酸(否)', '客户来电咨询入园是否需要核酸检测证明', '告知不需要', () => {
                        $(`label:contains('游玩政策')`).parent('li').click();
                    });
                    quickContent('营业时间(手动)', '客户来电咨询营业时间', '告知', () => {
                        $(`label:contains('文旅城基本信息')`).parent('li').click();
                    });
                    quickContent('防疫政策(手动)', '客户来电咨询防疫要求', '告知', () => {
                        $(`label:contains('游玩政策')`).parent('li').click();
                    });
                    quickContent('免票政策(手动)', '客户来电咨询免票要求', '告知', () => {
                        $(`label:contains('免票及优待政策')`).parent('li').click();
                    });
                    quickContent('优待票政策(手动)', '客户来电咨询优待票要求', '告知', () => {
                        $(`label:contains('免票及优待政策')`).parent('li').click();
                    });
                    quickContent('票价(手动)', '客户来电咨询票价', '告知', () => {
                        $(`label:contains('产品内容')`).parent('li').click();
                    });
                }

                {
                    let ifrBodyHtml = $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.innerHTML;
                    if(ifrBodyHtml.indexOf($('#coolshowusername')[0].value) == -1) {
                        for (let i = orderDescription.getLength(); i >= 1; i--) {
                            orderDescription.remove(i);
                        }
                        orderDescription.append('应急');
                        orderDescription.append($('#coolshowusername')[0].value);
                    }
                }
                if(clientName.value == '') {
                    changeValue(clientName, '女士');
                }
                changeValue(phone, tel.value);
                channel.click();
                if($('label:contains("业态")').parent('div.form-group').find('div.form-control > div.select-value')[0].innerText == '请选择') {
                    park.click();
                }
                if($('label:contains("咨询工单类别")').parent('div.form-group').find('div.form-control > div.select-value')[0].innerText == '请选择') {
                    product.click();
                }
                if($('label:contains("工单流转方式")').parent('div.form-group').find('div.form-control.input-sm.custom-filed-droplist > div.select-value')[0].innerText == '') {
                    unrelated.click();
                }
                {
                    let parentEle = $('label:contains("客户姓名")').parent('div.form-group').find('label')[0];
                    let btnSexSwitch = document.createElement('button');
                    btnSexSwitch.className = "btn btn-sm btn-warning";
                    parentEle.appendChild(btnSexSwitch);
                    btnSexSwitch.innerText = "切换性别";
                    btnSexSwitch.style.lineHeight = "16px";
                    btnSexSwitch.onclick = () => {
                        if(clientName.value == "女士") {
                            changeValue(clientName, '先生');
                        } else {
                            changeValue(clientName, '女士');
                        }
                    }
                }
                {
                    function AutoTitle() {
                        function getTargetEvent(contains) {
                            return $(`label:contains("${contains}")`).parent('div.form-group').find('div.ember-view.custom-field-hook > div.chained_droplist.custom-filed-chained-droplist.ember-view.cascade-field > div:nth-child(2) > div.form-control > div.select-value')[0];
                        }//业态/咨询工单类别
                        let place = $('label:contains("地方")').parent('div.form-group').find('div.ember-view.custom-field-hook > div.ember-view.select-with-search > div.form-control.input-sm.custom-filed-droplist > div')[0] || {};  //地方
                        let kind = getTargetEvent("业态") || {}; //业态
                        let type = getTargetEvent("咨询工单类别") || {}; //类别
                        let text = `${place.innerText || ""}文旅城—${kind.innerText || "其他"}—电话—${type.innerText || "其他"}`;
                        let targetInput = document.querySelectorAll("input.form-control.input-sm.ember-view.ember-text-field")[0]; 
                        changeValue(targetInput, text); //触发input的change事件
                        let ifrHtml = $('label:contains("描述")').parent('div.form-group').find('iframe')[0].contentWindow.document.body.querySelectorAll("p:last-child")[0] || {};
                        if(kind.innerText == "热雪奇迹") {
                            if(orderDescription.getInnerText(orderDescription.getLength()).slice(-1) != "@") {
                                orderDescription.change(orderDescription.getLength(), orderDescription.getInnerText(orderDescription.getLength()) + "@");
                            }
                        } else {
                            if(orderDescription.getInnerText(orderDescription.getLength()).slice(-1) == "@") {
                                orderDescription.change(orderDescription.getLength(), orderDescription.getInnerText(orderDescription.getLength()).slice(0, -1));
                            }
                        }
                    }
                    function addAutoTitleListener(e) {
                        e.addEventListener('DOMNodeInserted',()=>{
                            setTimeout(()=>{
                                AutoTitle();
                            },200);
                        });
                        e.addEventListener('DOMCharacterDataModified',()=>{
                            setTimeout(()=>{
                                AutoTitle();
                            },200);
                        });
                    }
                    addAutoTitleListener($('label:contains("地方")').parent('div.form-group').find('div.ember-view.custom-field-hook > div.ember-view.select-with-search > div.form-control.input-sm.custom-filed-droplist > div')[0]);
                    addAutoTitleListener($('label:contains("业态")').parent('div.form-group').find('div.ember-view.custom-field-hook > div.chained_droplist.custom-filed-chained-droplist.ember-view.cascade-field')[0]);
                    addAutoTitleListener($('label:contains("咨询工单类别")').parent('div.form-group').find('div.ember-view.custom-field-hook > div.chained_droplist.custom-filed-chained-droplist.ember-view.cascade-field')[0]);
                }

                {
                    //点击“保存”时检查相关项目
                    {
                        // 检查是否呼出工单
                        let activeLi = document.querySelectorAll('li.flex-layout.flex-align-items-center.ember-view.active')[0];
                        if(activeLi.querySelector('i.icon-callout')){
                            function checkCallout() {
                                $('button:contains("保存")')[0].removeEventListener('mousedown', checkCallout);
                                alert('检测到当前工单为呼出工单，请核实无误后重新点击保存！');
                            }
                            $('button:contains("保存")')[0].addEventListener('mousedown', checkCallout);
                        }
                    }
                    {
                        //检查退改、投诉等工单是否选择了"解决中"
                        function checkResolved() {
                            let targetEle = $(`label:contains("咨询工单类别")`).parent('div.form-group').find('div.ember-view.custom-field-hook > div.chained_droplist.custom-filed-chained-droplist.ember-view.cascade-field > div:nth-child(2) > div.form-control > div.select-value')[0];
                            let targetEleText = targetEle ? targetEle.innerText : '';
                            if((targetEleText == '退改政策' || targetEleText == '会员开发票' || targetEleText == '') && $('label:contains("状态")').parent('div.form-group').find('div > a > span:nth-child(1)')[0].innerText == '已解决' && $('label:contains("工单流转方式")').parent('div.form-group').find('div.select-value')[0].title != '未流转') {
                                $('button:contains("保存")')[0].removeEventListener('mousedown', checkResolved);
                                alert('检测到当前工单咨询工单类别为"已解决"，请核实是否有误！');
                            }
                        }
                        $('button:contains("保存")')[0].addEventListener('click', checkResolved);
                    }
                }

                {
                    // 选择工单标签
                    if($('#coolshownoticket')[0].checked){
                        let woClick = (e) => {
                            let event = new MouseEvent(e, { bubbles: true });
                            event.simulated = true;
                            $('label:contains("工单标签")').parent('div.form-group').find('div.active.ember-view.ui-tag-select.editable')[0].dispatchEvent(event);
                        }
                        woClick('mouseover');
                        woClick('click');
                        woClick('click');   //需要两次click才能正常触发(原因未知)
                        woClick('mouseout');
                        // 触发click后网页会发送ajax,考虑延迟设置1秒后继续操作
                        setTimeout(() => {
                            $('label:contains("工单标签")').parent('div.form-group').find('a:contains("营销/拉新-非活动")').parent('div.dropdown > ul.dropdown-menu > li')[0].click();
                            woClick('mouseover');
                            woClick('click');
                            woClick('click');
                            woClick('mouseout');
                            setTimeout(() => {
                                $('label:contains("工单标签")').parent('div.form-group').find('a:contains("消费-未知")').parent('div.dropdown > ul.dropdown-menu > li')[0].click();
                            }, 1000);
                        }, 1000);
                    }
                }
            },1000);
        }
        document.addEventListener('DOMNodeInserted', (e) => {
            switch (e.target.className) {
                case 'screen-pop':
                    $('a:contains("新建工单")')[0].addEventListener('click', () => {
                        setTimeout(() => {
                            btn_writeForm.click();
                        }, 2000);
                    });
                    break;
                case 'udesk-webapp-ts-react-modal-root':
                    if(e.target.querySelector('.udesk-webapp-ts-react-modal-title').innerText == '工单分配' && $('div:contains("状态：")').parent('.udesk-webapp-ts-react-row.udesk-webapp-ts-react-row-middle').find('div > div > span').text() != '解决中') {
                        alert('转单前请检查工单状态是否为"解决中"！');
                    }
                    break;
                default:
                    break;
            }
        });
    }
    {
        let parentEle = document.querySelector("body > div.header-section");
        let input_name = document.createElement('input');
        input_name.id = 'coolshowusername';
        input_name.style.float = 'left';
        input_name.style.marginTop = '12px';
        input_name.style.marginLeft = '14px';
        input_name.style.width = '60px';
        input_name.className = 'ember-view ember-text-field';
        input_name.placeholder = '姓名';
        parentEle.appendChild(input_name);

        let label_noTicket = document.createElement('label');
        label_noTicket.innerText = '是否选择工单标签：';
        let input_noTicket = document.createElement('input');
        input_noTicket.type = 'checkbox';
        input_noTicket.checked = true;
        input_noTicket.id = 'coolshownoticket';
        let div_noTicket = document.createElement('div');
        div_noTicket.style.float = 'left';
        div_noTicket.style.marginTop = '12px';
        div_noTicket.style.marginLeft = '14px';
        div_noTicket.appendChild(label_noTicket);
        div_noTicket.appendChild(input_noTicket);
        parentEle.appendChild(div_noTicket);
    }

    //autoCheck
    {
        function getAgentIdSync(usr) {
            return $.ajax({
                url: "/spa1/init_data/agents_list",
                type: "GET",
                async: false,
                error: e => {
                    alert(`获取agentId失败！error function: getAgentIdSync, status:${e.status}, errorMsg:${e.errorMsg}`);
                }
            }).then(res => {
                let result = {};
                res.agents.forEach(element => {
                    if(element.aliase == usr || element.nick_name == usr) {
                        result = element;
                    }
                });
                return result.id;
            });
        }

        {
            let parentEle = document.querySelector("body > div.header-section");
            let autoCheck = document.createElement('button');
            parentEle.appendChild(autoCheck);
            autoCheck.innerText = 'autoCheck';
            autoCheck.style.float = 'right';
            autoCheck.style.marginTop = '12px';
            autoCheck.style.marginLeft = '14px';
            autoCheck.className = "btn btn-sm btn-success";
            autoCheck.id = 'coolshowautocheck';
            autoCheck.onclick = () => {
                let tittle = document.querySelector('header > div:nth-child(1)') ? document.querySelector('header > div:nth-child(1)').innerText : '';
                if(tittle != '我的已解决工单' && tittle != '所有工单' && tittle != `今日工单-${$('a > span.user-text')[0].title}`) {
                    //如果不在上述页面，就转至今日工单（判断是否存在，如不存在就初始化）
                    function getMyFilterId() {
                        return $.ajax({
                            url: "/spa1/ticket/filters",
                            type: "GET",
                            async: false
                        }).then(res => {
                            if(res.code !== 1000){
                                return false;
                            } else {
                                for (let i = 0; i < res.filters.length; i++) {
                                    if(res.filters[i].name == `今日工单-${$('a > span.user-text')[0].title}`) {
                                        return res.filters[i].id;
                                    }
                                }
                                return 0;
                            }
                        });
                    }
                    (async () => {
                        let permission_id = await getAgentIdSync($('a > span.user-text')[0].title);
                        if(await getMyFilterId() == 0){
                            $.ajax({
                                url: "/spa1/ticket/filters",
                                type: "POST",
                                dataType: "json",
                                data: `{"filter":{"name":"今日工单-${$('a > span.user-text')[0].title}","permission":"User","permission_id":[${permission_id}],"sort_by":[],"all_conditions":[{"field_name":"creator_id","operation":"is","value":"current_user"},{"field_name":"created_at","operation":"today","value":null}],"any_conditions":[],"group_name":""}}`,
                                contentType: "application/json"
                            }).then(res => {
                                alert('首次初始化过滤器，请重新操作！');
                            });
                        } else {
                            let filterId = await getMyFilterId();
                            $.ajax({
                                url: `https://1349541.s2.udesk.cn/spa1/ticket/filters/${filterId}/columns`,
                                type: "PUT",
                                dataType: "json",
                                data: `{"sort_columns":["subject","SelectField_5257","SelectField_6565","SelectField_6564","content","status","field_num"]}`,
                                contentType: "application/json"
                            }).then(res => {
                                window.history.pushState(null, null, `https://1349541.s2.udesk.cn/entry/ticket/list/${filterId}`);
                                dispatchEvent(new PopStateEvent('popstate'));
                            });
                        }
                    })();
                } else {
                    let times = 0;
                    let err = 0;
                    let trs = document.querySelectorAll('div.udesk-webapp-ts-react-spin-container div.udesk-webapp-ts-react-table-container tbody tr');
                    trs.forEach(ele => {
                        if(ele.ariaHidden) {
                            return;
                        }
                        times++;
                        let thisErr = 0;
                        let tds = ele.querySelectorAll('td');
                        let tit = tds[1].innerText.split('—');
                        tit[0] = tit[0].slice(0, -3);   //去掉'文旅城'三个字，方便判断
                        let place = tds[2].innerText;
                        let service = tds[3].innerText.split('/')[1] || tds[3].innerText;
                        let type = tds[4].innerText.split('/')[1];
                        if(tit[0] != place) {
                            ele.style.backgroundColor = 'yellow';
                            tds[2].style.backgroundColor = '#ff9797'
                            thisErr++;
                        }
                        if(tit[1] != service) {
                            ele.style.backgroundColor = 'yellow';
                            tds[3].style.backgroundColor = '#ff9797'
                            thisErr++;
                        }
                        if(tit[3] != type) {
                            ele.style.backgroundColor = 'yellow';
                            tds[4].style.backgroundColor = '#ff9797'
                            thisErr++;
                        }
                        if(thisErr > 0) {
                            err++;
                        }
                    });
                    alert(`检查结束! 共检查${times}条项目, 发现${err}条错误项目`);
                    {
                        //检查未生成工单            
                        function getCallLogSync(timeStr, agentId) {
                            return $.ajax({
                                url: "/spa1/callcenter_logs/list",
                                type: "POST",
                                dataType: "json",
                                data: `{"all_conditions":[{"field_name":"created_at","operation":"gte","value":"${timeStr} 00:00:00"},{"field_name":"created_at","operation":"lte","value":"${timeStr} 23:59:59"},{"field_name":"get_direction","operation":"should","value":"呼入"},{"field_name":"relevant_agent_ids","operation":"should","value":${agentId}}],"page":1,"page_size":500}`,
                                contentType: "application/json",
                                error: e => {
                                    document.getElementById('coolshowautocheck').className = "btn btn-sm btn-danger";
                                    document.getElementById('coolshowautocheck').innerText = 'ERROR';
                                    alert(`检查未生成工单失败！error function: getCallLogSync, status:${e.status}, errorMsg:${e.errorMsg}`);
                                }
                            }).then(res => {return res}); 
                        }
                    
                        (async function() {
                            document.getElementById('coolshowautocheck').className = "btn btn-sm btn-warning";
                            document.getElementById('coolshowautocheck').innerText = 'CHECKING';
                            let callLog = await getCallLogSync((new Date().getFullYear()) + '-' + (new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1) + '-' + (new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()), await getAgentIdSync($('a > span.user-text')[0].title));
                            if(callLog.code == 1000) {
                                let items = callLog.items;
                                items.forEach(ele => {
                                    if((!ele.call_log) && (ele.call_log.tickets.length == 0)){
                                        document.getElementById('coolshowautocheck').className = "btn btn-sm btn-danger";
                                        document.getElementById('coolshowautocheck').innerText = 'FAILD';
                                        return;
                                    }
                                });
                                document.getElementById('coolshowautocheck').className = "btn btn-sm btn-success";
                                document.getElementById('coolshowautocheck').innerText = 'PASS';
                                if(items.length != document.querySelector('div[title^="今日工单-"] > span:nth-child(2)').innerText) {
                                    alert('通话数量与工单数量不一致，请检查是否有误！');
                                } 
                            }
                        })();
                    }
                }
            };
        }

        {
            let parentEle = document.querySelector("body > div.header-section");
            let btn_agentInfo = document.createElement('button');
            parentEle.appendChild(btn_agentInfo);
            btn_agentInfo.innerHTML = `置忙时间: <span id="coolshowbusytime">0秒</span>，置忙率: <span id="coolshowbusyratio">0%</span>，参评率: <span id="coolshowcallinsurvey">0%</span>`;
            btn_agentInfo.style.float = 'right';
            btn_agentInfo.style.marginTop = '12px';
            btn_agentInfo.style.marginLeft = '14px';
            btn_agentInfo.className = "btn btn-sm btn-default";
            btn_agentInfo.onclick = () => {
                function getBusyTimeRateSync(agentId) {
                    return $.ajax({
                        url: "https://cbi.s2.udesk.cn/backend/report/cc_agent_attendance_day?source=CS&callType=open_linapp",
                        type: "POST",
                        dataType: "json",
                        data: `{"ids":[${agentId}],"statAt":["${new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + "-" + (new Date().getDate() < 10 ? "0" + (new Date().getDate()) : new Date().getDate())} 00:00:00","${new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + "-" + (new Date().getDate() < 10 ? "0" + (new Date().getDate()) : new Date().getDate())} 23:59:59"],"permission":["all","queue"],"orderField":null,"orderType":"none","pageNum":1,"pageSize":20,"timeStrategy":"work","displayForbiddenAgent":0}`,
                        contentType: "application/json"
                    }).then(res => {
                        return res.code == 200 ? res.data.rows[0].cc_agent_attendance__busy_time_rate : 'error';
                    }); 
                }
                function getCallinSurveyRateSync(agentId) {
                    return $.ajax({
                        url: "https://cbi.s2.udesk.cn/backend/report/cc_agent_callin?source=CS&callType=open_linapp",
                        type: "POST",
                        dataType: "json",
                        data: `{"ids":[${agentId}],"statAt":["${new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + "-" + (new Date().getDate() < 10 ? "0" + (new Date().getDate()) : new Date().getDate())} 00:00:00","${new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + "-" + (new Date().getDate() < 10 ? "0" + (new Date().getDate()) : new Date().getDate())} 23:59:59"],"permission":["all","queue"],"orderField":null,"orderType":"none","pageNum":1,"pageSize":20,"timeStrategy":"work","displayForbiddenAgent":0}`,
                        contentType: "application/json"
                    }).then(res => {
                        return res.code == 200 ? res.data.rows[0].cc_agent_callin__callin_survey_rate : 'error';
                    }); 
                }
                (async () => {
                    let id = await getAgentIdSync($('a > span.user-text')[0].title);
                    document.getElementById('coolshowbusyratio').innerText = await getBusyTimeRateSync(id);
                    document.getElementById('coolshowcallinsurvey').innerText = await getCallinSurveyRateSync(id);
                })();
            }
            setInterval(() => {
                btn_agentInfo.click();
            }, 1000 * 60 * 5);
            {
                //计算置忙时间
                let restTime = 0;
                let restTimeInterval = 0;
                let observer = new MutationObserver(mutationsList => {
                    if($('ul.notification-menu.top-notification-menu > li.top-bar-call-operate > a')[0].title == '忙碌' && restTimeInterval == 0) {
                        restTimeInterval = setInterval(() => {
                            restTime++;
                            document.getElementById('coolshowbusytime').innerText = parseInt(restTime / 60 / 60 % 24) + '时' + parseInt(restTime / 60 % 60) + '分' + parseInt(restTime % 60) + '秒';
                        }, 1000);
                    } else {
                        clearInterval(restTimeInterval);
                        restTimeInterval = 0;
                    }
                });
                observer.observe($('ul.notification-menu.top-notification-menu > li.top-bar-call-operate > a > i > i')[0], { attributes: true, childList: true, subtree: true });
            }
        }
    }
}

let setMain = setInterval(() => {
    if($('div.header-section div.search-field > input')[0]) {
        clearInterval(setMain);
        $('div.header-section div.search-field > input')[0].addEventListener('keydown', (e) => {
            if(e.key == 'Tab'){
                let pwd = prompt('请输入授权码：');
                let str = new Date().getHours().toString() + new Date().getMinutes().toString();
                str = str.split('').reverse();
                let res = [];
                str.forEach(item => {
                    if(item != 0) {
                        res.push(item);
                    }
                });
                str = res.join('');
                if(pwd != str) {
                    alert('授权码错误！');
                } else {
                    window.postMessage({name: "checkPermission"}, '*');
                }
            }
        });
    }
}, 1000);
