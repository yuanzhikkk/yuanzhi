var historyObject = {
    position: 0,
    limit: 10,
    finishLoad: false,
    Init: function () {
        // 原始语法的界定符规则
        var rule = template.defaults.rules[0];
        rule.test = new RegExp(rule.test.source.replace('<%', '\\\[\\\?').replace('%>', '\\\?]'));
        window.onscroll = function () {
            historyObject.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (historyObject.finishLoad === true) {
                    common.loadClose();
                    return
                }
                historyObject.loadList();
            }
        };
        this.loadList();
    },

    loadList: function () {
        common.loadShow();
        common.noneNoMore();
        var url = common.baseUrl + "/api/v3/topic/history";
        $.ajax({
            type : "Get",  //提交方式
            url : url,//路径
            data : {
                "user_uuid" : localStorage.getItem("user_uuid"),
                "limit": historyObject.limit,
                "position": historyObject.position,
            },//数据，这里使用的是Json格式进行传输
            success : function(result) {//返回数据根据结果进行相应的处理
                if (result.code == 50001) {
                    window.location.href = "/login";
                    return;
                }

                if (result.code != 200) {
                    common.showHint("warning", "加载失败");
                    common.loadClose();
                    return;
                }

                if (!result.data.data) {
                    common.blockNoMore();
                    historyObject.finishLoad = true;
                    common.loadClose();
                    return;
                }

                var html = template('history-template',  {
                    data: result.data.data
                });
                historyObject.position = result.data.position;
                $("#history-list").append(html);
                common.loadClose();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                common.showHint("warning", "网络错误");
                common.loadClose();
            }
        });
    },

    scrollFunction: function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block"
        } else {
            document.getElementById("myBtn").style.display = "none"
        }
    },
};
