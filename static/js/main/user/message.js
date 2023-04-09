var MessageObject = {
    position: 0,
    limit: 10,
    finishLoad: false,
    Init: function () {
        // 原始语法的界定符规则
        var rule = template.defaults.rules[0];
        rule.test = new RegExp(rule.test.source.replace('<%', '\\\[\\\?').replace('%>', '\\\?]'));
        window.onscroll = function () {
            MessageObject.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (MessageObject.finishLoad === true) {
                    common.loadClose();
                    return
                }
                MessageObject.loadList();
            }
        };
        this.loadList();
    },

    loadList: function () {
        common.noneNoMore();
        common.loadShow();
        var url = common.baseUrl + "/api/v1/user/message_list";
        $.ajax({
            type : "Get",  //提交方式
            url : url,//路径
            data : {
                "user_uuid" : localStorage.getItem("user_uuid"),
                "limit": MessageObject.limit,
                "position": MessageObject.position,
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
                    // common.showHint("success", "加载完成没有更多数据");
                    MessageObject.finishLoad = true;
                    common.loadClose();
                    return;
                }

                var html = template('message-template',  {
                    data: result.data.data
                });
                MessageObject.position = result.data.position;
                $("#message-list").append(html);
                common.loadClose();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
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

    open: function (content) {
        $("#content").text(content);
        $("#messageModal").modal();
    },
};
