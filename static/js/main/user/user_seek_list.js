var userSeekListObject = {
    position: 0,
    limit: 10,
    finishLoad: false,

    SetPosition: function (position) {
        var positionGet = common.getParam("position");
        if(positionGet) {
            this.position = positionGet;
            return;
        }
        this.position = position;
    },

    Init: function () {
        // 原始语法的界定符规则
        var rule = template.defaults.rules[0];
        rule.test = new RegExp(rule.test.source.replace('<%', '\\\[\\\?').replace('%>', '\\\?]'));
        window.onscroll = function () {
            userSeekListObject.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (userSeekListObject.finishLoad === true) {
                    return
                }
                userSeekListObject.loadList();
            }
        };
    },

    loadList: function () {
        common.loadShow();
        var url = common.baseUrl + "/api/v1/user/seek_list";
        $.ajax({
            type : "Get",  //提交方式
            url : url,//路径
            data : {
                "user_uuid" : localStorage.getItem("user_uuid"),
                "limit": userSeekListObject.limit,
                "position": userSeekListObject.position,
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
                    common.showHint("success", "加载完成没有更多数据");
                    userSeekListObject.finishLoad = true;
                    common.loadClose();
                    return;
                }

                var html = template('seek-list-template',  {
                    data: result.data.data
                });
                userSeekListObject.position = result.data.position;
                $("#seek-list").append(html);
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

    delete: function (ele) {
        var deleteId =  ele.attr("delete-id");
        var url = common.baseUrl + "/api/v1/user/seek/delete/" + deleteId;
        if (deleteId == "") {
            common.showHint("warning", "数据id不能为空");
            common.loadClose();
            return;
        }

        $("#save").attr("disabled", true);
        common.loadShow();
        $.ajax({
            type : "Post",  //提交方式
            url : url,//路径
            data : {},//数据，这里使用的是Json格式进行传输
            success : function(result) {//返回数据根据结果进行相应的处理
                if (result.code != 200) {
                    common.showHint("warning", result.message);
                    common.loadClose();
                    $("#save").attr("disabled", false);
                    return;
                }
                common.loadClose(function () {
                    $("#warnModal").modal("hide");
                    $("#data-" + deleteId).remove();
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                common.showHint("warning", "提交失败");
                common.loadClose();
                $("#save").attr("disabled", false);
            }
        });
    },
};
