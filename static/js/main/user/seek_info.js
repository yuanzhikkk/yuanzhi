var seekInfoObject = {
    position: 0,
    limit: 10,
    finishLoad: false,

    save: function (seekUuid, uuid) {
        if (!uuid) {
            var url = common.baseUrl + "/api/v1/user/reply/seek";
        } else {
            var url = common.baseUrl + "/api/v1/user/edit/reply/seek";
        }
        var shareUrl = $("#shareUrl").val();
        if (shareUrl === "") {
            common.showHint("warning", "资料名称不能是空");
            return;
        }
        var sharePwd = $("#code").val();

        var is_anonymous = 0;
        var anonymous = $("#anonymous").is(":checked");
        if (anonymous === false) {
            is_anonymous = 0;
        } else {
            is_anonymous = 1;
        }

        var comment = $("#comment").val();
        if (comment == "") {
            common.showHint("warning", "评论不能为空");
            return;
        }

        var data = {
            "seek_uuid": seekUuid,
            "url" : shareUrl,
            "pwd": sharePwd,
            "comment": comment,
            "anonymous": is_anonymous,
        };

        if (uuid) {
            data.uuid = uuid;
        }

        $("#save").attr("disabled", true);
        common.loadShow();
        $.ajax({
            type : "Post",  //提交方式
            url : url,//路径
            data : data,//数据，这里使用的是Json格式进行传输
            success : function(result) {//返回数据根据结果进行相应的处理
                if (result.code == 50001) {
                    window.location.href = "/login";
                    return;
                }

                if (result.code != 200) {
                    common.showHint("warning", result.message);
                    common.loadClose();
                    $("#save").attr("disabled", false);
                    return;
                }
                common.loadClose(function () {
                    $("#save").attr("disabled", false);
                    window.location.href = "/user/ask/success/" + result.data.Uuid;
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                common.showHint("warning", "提交失败");
                common.loadClose();
                $("#save").attr("disabled", false);
            }
        });
    },

    init: function (seekUuid) {
        // 原始语法的界定符规则
        var rule = template.defaults.rules[0];
        rule.test = new RegExp(rule.test.source.replace('<%', '\\\[\\\?').replace('%>', '\\\?]'));
        window.onscroll = function () {
            seekInfoObject.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (seekInfoObject.finishLoad === true) {
                    return
                }
                seekInfoObject.loadList(seekUuid);
            }
        };
        this.loadList(seekUuid);
    },

    blockNoMore: function () {
        document.getElementById("zz-no-more").style.display = "block"
    },

    loadList: function (seekUuid) {
        common.loadShow();
        var url = common.baseUrl + "/api/v1/user/reply/list";
        $.ajax({
            type : "Get",  //提交方式
            url : url,//路径
            data : {
                "seek_uuid" : seekUuid,
                "limit": seekInfoObject.limit,
                "position": seekInfoObject.position,
            },//数据，这里使用的是Json格式进行传输
            success : function(result) {//返回数据根据结果进行相应的处理
                if (result.code != 200) {
                    common.showHint("warning", "加载失败");
                    common.loadClose();
                    return;
                }

                if (!result.data.data) {
                    seekInfoObject.blockNoMore();
                    seekInfoObject.finishLoad = true;
                    common.loadClose();
                    return;
                }

                var html = template('ask-template',  {
                    data: result.data.data
                });
                seekInfoObject.position = result.data.position;
                $("#ask_list").append(html);
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
