{
    function getAgentObjSync(usr) {
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
            result.text = result.nick_name;
            return result;
        });
    }
    (async () => {
        let obj = await getAgentObjSync('龚云英-天津跟单');
        $.ajax({
            url: "/spa1/macros",
            type: "POST",
            dataType: "json",
            data: `{"macro":{"title":"解决中+转单龚云英","permission":2,"operations":[["Status",4,null,null,{},[]],["Agent",${JSON.stringify(obj)},null,null,{},[]]]}}`,
            contentType: "application/json"
        });
    })()
}