function getStrCode(s) {
    var start=s.lastIndexOf(":")+1;
    var code=s.substr(start,5);
    return code;
}
function getStrUrl(s) {
    var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    s = s.match(reg);
    return(s&&s.length?s[0]:null);
}
var donateObject = {
    save: function (uuid) {
        if (!uuid) {
            var url = common.baseUrl + "/api/v1/user/ajaxDonate";
        } else {
            var url = common.baseUrl + "/api/v1/user/donate/edit/" + uuid;
        }
        var donateTitle = $("#DonateTitle").val();
        if (donateTitle === "") {
            common.showHint("warning", "标题不能是空");
            return;
        }
        var shareUrl = $("#shareUrl").val();
        if (shareUrl === "") {
            common.showHint("warning", "资料名称不能是空");
            return;
        }
        var shareCode = $("#shareCode").val();

        var is_anonymous = 0;
        var anonymous = $("#anonymous").is(":checked");
        if (anonymous === false) {
            is_anonymous = 0;
        } else {
            is_anonymous = 1;
        }

        var donate_description = $("#remark").val();
        if (donate_description === "") {
            common.showHint("warning", "评论不能为空");
            return;
        }

        $("#save").attr("disabled", true);
        common.loadShow();
        $.ajax({
            type : "Post",  //提交方式
            url : url,//路径
            data : {
                "donate_title": donateTitle,
                "donate_description": donate_description,
                "url" : shareUrl,
                "pwd": shareCode,
                "anonymous": is_anonymous,
            },//数据，这里使用的是Json格式进行传输
            success : function(result) {//返回数据根据结果进行相应的处理
                if (result.code != 200) {
                    common.showHint("warning", result.message);
                    common.loadClose();
                    $("#save").attr("disabled", false);
                    return;
                }
                common.loadClose(function () {
                    $("#save").attr("disabled", false);
                    if (!uuid) {
                        window.location.href = "/donate/success/" + result.info.Uuid;
                    } else {
                        window.location.href = "/donate/edit/success/" + result.info.Uuid;
                    }
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                common.showHint("warning", "提交失败");
                common.loadClose();
                $("#save").attr("disabled", false);
            }
        });
    },

    init: function () {
        // 原始语法的界定符规则
        var rule = template.defaults.rules[0];
        rule.test = new RegExp(rule.test.source.replace('<%', '\\\[\\\?').replace('%>', '\\\?]'));
        window.onscroll = function () {
            donateObject.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (donateObject.finishLoad === true) {
                    return
                }
                donateObject.loadList();
            }
        };
        this.loadList();
    },

    loadList: function () {
        common.loadShow();
        common.noneNoMore();
        var url = common.baseUrl + "/api/v1/user/donate/list";
        $.ajax({
            type : "Get",  //提交方式
            url : url,//路径
            data : {
                "limit": donateObject.limit,
                "position": donateObject.position,
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
                    donateObject.finishLoad = true;
                    common.loadClose();
                    return;
                }

                var html = template('donate-template',  {
                    data: result.data.data
                });
                donateObject.position = result.data.position;
                $("#donate_list").append(html);
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

    initParse: function () {
        /*
         * 监听下载地址textarea输入变化
        */
        jQuery(function(){
            jQuery("#parseZone").bind("input propertychange", function(){
                var content=jQuery(this).val();
                if(content != null && content != "" && content != undefined) {
                    var url=getStrUrl(content);
                    if(url != null && url != "" && url != undefined) {
                        jQuery("#shareUrl").val(url);
                    }
                    var code=getStrCode(content);
                    if(code != null && code != "" && code != undefined) {
                        jQuery("#shareCode").val(code);
                    }
                }
            });
        });


    },

    delete: function (ele) {
        var deleteId =  ele.attr("delete-id");
        var url = common.baseUrl + "/api/v1/user/donate/delete/" + deleteId;
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
