var userAskSeekList = {
    init: function () {
        // 原始语法的界定符规则
        var rule = template.defaults.rules[0];
        rule.test = new RegExp(rule.test.source.replace('<%', '\\\[\\\?').replace('%>', '\\\?]'));
        window.onscroll = function () {
            userAskSeekList.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (userAskSeekList.finishLoad === true) {
                    return
                }
                userAskSeekList.loadList();
            }
        };
        this.loadList();
    },

    loadList: function () {
        common.loadShow();
        common.noneNoMore();
        var url = common.baseUrl + "/api/v1/user/admin/reply/list";
        $.ajax({
            type : "Get",  //提交方式
            url : url,//路径
            data : {
                "limit": userAskSeekList.limit,
                "position": userAskSeekList.position,
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
                    userAskSeekList.finishLoad = true;
                    common.loadClose();
                    return;
                }

                var html = template('ask-seek-template',  {
                    data: result.data.data
                });
                userAskSeekList.position = result.data.position;
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

    clickFocus: function (shareUrl, code) {
        $("#shareUrl").val(shareUrl);
        $("#code").val(code);
        $("#save").attr("data-clipboard-text", code);
        $('#myModal').modal();
    },

    hrefShareUrl: function () {
        var clipboard = new ClipboardJS('#save');
        clipboard.on('success', function (e) {
            common.showHint("success", "复制提取码成功，请点击链接使用提取码");
            e.clearSelection();
            var url = $("#shareUrl").val();
            var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            var objExp=new RegExp(Expression);
            if(!objExp.test(url)){
                url = "https://" + url;
            }
            window.open(url);
        });
        clipboard.on('error', function (e) {
            common.showHint("warning", "复制失败");
        });
    },

    delete: function (ele) {
        var deleteId =  ele.attr("delete-id");
        var url = common.baseUrl + "/api/v1/user/reply/delete/" + deleteId;
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
}
