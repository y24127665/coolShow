{
    let restTime = 0;
    let maxRestInterval = 0;
    let observer = new MutationObserver(mutationsList => {
        document.querySelectorAll('.menu-right > ul > li:nth-child(3) > ul > li').forEach(elLi => {
            if(elLi.innerText.indexOf('空闲') != -1) {
                elLi.onclick = () => {
                    clearInterval(maxRestInterval);
                    maxRestInterval = 0;
                    restTime = 0;
                }
            } else if(elLi.innerText.indexOf('忙碌') != -1) {
                elLi.onclick = () => {
                    clearInterval(maxRestInterval);
                    maxRestInterval = 0;
                    restTime = 0;
                }
            } else if(elLi.innerText.indexOf('小休') != -1) {
                elLi.onclick = () => {
                    maxRestInterval = setInterval(() => {
                        if(restTime++ >= (60 * 30 - 10)) {
                            $('.menu-right > ul > li:nth-child(3) > ul').find('li:contains("忙碌")')[0].click();
                            let checkTimes = 0;
                            let checkInterval = setInterval(() => {
                                checkTimes++;
                                if(($('.menu-right > ul > li:nth-child(3) > a')[0].title == '忙碌') || (checkTimes >= 10)) {
                                    clearInterval(checkInterval);
                                    alert('小休时间接近30分钟，已自动调整为忙碌状态！');
                                }
                            }, 500);
                        }
                    }, 1000);
                }
            } else if(elLi.innerText.indexOf('离线') != -1) {
                elLi.onclick = () => {
                    clearInterval(maxRestInterval);
                    maxRestInterval = 0;
                    restTime = 0;
                }
            }
        });
    });
    observer.observe($('li.ember-view.operate-li.top-bar-call-operate > a')[0], { attributes: true, childList: true, subtree: true });
}