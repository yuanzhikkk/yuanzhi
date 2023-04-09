var feedbackObject = {
    save: function () {
        var url = common.baseUrl + "/api/v1/user/ajaxFeedback";
        var title = $("#title").val();
        if (title === "") {
            common.showHint("warning", "资料名称不能是空");
            return;
        }
        var description = $("#description").val();
        if (description === "") {
            common.showHint("warning", "资料描述不能是空");
            return;
        }

        var uuid = common.getParam("uuid");

        var requestData = {};
        requestData.title = title;
        requestData.description = description;

        if (uuid !== "") {
            requestData.uuid = uuid;
        }

        common.loadShow();
        $("#save").attr("disabled", true);
        $.ajax({
            type : "Post",  //提交方式
            url : url,//路径
            data : requestData,//数据，这里使用的是Json格式进行传输
            success : function(result) {//返回数据根据结果进行相应的处理
                if (result.code != 200) {
                    common.showHint("warning", "加载失败");
                    common.loadClose();
                    $("#save").attr("disabled", false);
                    return;
                }
                common.showHint("success", result.message);
                common.loadClose();
                $("#save").attr("disabled", false);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                common.showHint("warning", "提交失败");
                common.loadClose();
                $("#save").attr("disabled", false);
            }
        });
    },

    Init: function () {
        // 原始语法的界定符规则
        var rule = template.defaults.rules[0];
        rule.test = new RegExp(rule.test.source.replace('<%', '\\\[\\\?').replace('%>', '\\\?]'));
        window.onscroll = function () {
            feedbackObject.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (feedbackObject.finishLoad === true) {
                    common.showHint("success", "加载完成没有更多数据");
                    common.loadClose();
                    return
                }
                feedbackObject.loadList();
            }
        };
        this.loadList();
    },

    loadList: function () {
        common.loadShow();
        common.noneNoMore();
        var url = common.baseUrl + "/api/v1/user/feedback_list";
        $.ajax({
            type : "Get",  //提交方式
            url : url,//路径
            data : {
                "user_uuid" : localStorage.getItem("user_uuid"),
                "limit": feedbackObject.limit,
                "position": feedbackObject.position,
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
                    feedbackObject.finishLoad = true;
                    common.loadClose();
                    return;
                }

                var html = template('feedback-template',  {
                    data: result.data.data
                });
                feedbackObject.position = result.data.position;
                $("#feedback-list").append(html);
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
};
