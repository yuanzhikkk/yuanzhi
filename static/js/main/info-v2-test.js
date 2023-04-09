var InfoObject = {
    topicInfo: function () {
        let data = common.getParam("topic_uuid");
        var xhr = new XMLHttpRequest();
        xhr.open("GET", common.baseUrl + "/api/v2/topic/info?topic_uuid=" + data, true);
        xhr.send();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.response) {
                    var res = JSON.parse(xhr.response);
                    var content = `<div class="info-title"><h1>${res.data.Keyword}</h1></div>`;
                    var box = document.getElementById("z-timeline-container-info-z");
                    box.innerHTML = content;
                    var content2 = `<div class="info-content">${res.data.Description}</div>`;
                    var box2 = document.getElementById("info-content-box-zz");
                    box2.innerHTML = content2;
                }
            }
        };
    }, copy: function () {
        var clipboard = new ClipboardJS('#copyData');
        clipboard.on('success', function (e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
            window.scrollTo(0, 0);
            common.showHint("success", "复制提取码成功，请点击链接使用提取码");
            e.clearSelection();
        });
        clipboard.on('error', function (e) {
            common.showHint("warning", "复制失败");
        });
    }, contact: function () {
        let app = common.getParam("app");
        switch (app) {
            case "qq":
                qq.miniProgram.navigateTo({url: '/pages/user/contact/contact',});
                break;
            case "wechat":
                wx.miniProgram.navigateTo({url: '/pages/user/contact/contact',});
                break;
            default:
                window.open("contact.html");
                break;
        }
    },
    downLoad: function (topic_uuid) {
        let app = this.app;
        if (!topic_uuid || topic_uuid == null) {
            common.showHint("warning", "数据id不存在");
            return;
        } else {
            var url = common.baseUrl + "/api/v2/topic/download/url?topic_uuid=" + topic_uuid;
            $.ajax({
                type : "Get",  //提交方式
                url : url,//路径
                data : {},//数据，这里使用的是Json格式进行传输
                success : function(res) {//返回数据根据结果进行相应的处理

                    if (res.code == 50001) {
                        window.open("/login");
                        return;
                    }

                    if (res.code == 200) {
                        document.getElementById("z-info-box").style.display = "block";
                        var content2 = `<span>链接:<a target="_blank" href="${res.data.BaiduUrl}">${res.data.BaiduUrl}</a></span>`;
                        var box2 = document.getElementById("BaiduUrl");
                        box2.innerHTML = content2;
                        var content3 = `<span>提取码:${res.data.BaiduPassword}</span>`;
                        var box3 = document.getElementById("BaiduPassword");
                        box3.innerHTML = content3;
                        var copyContent = "链接:" + res.data.BaiduUrl + "  提取码: " + res.data.BaiduPassword + " 复制这段内容后打开百度网盘手机App，操作更方便哦 \n" + "--来自源识资料库的分享";
                        if (app == "qq" || app == "wechat") {
                            document.getElementById("copyData").setAttribute("data-clipboard-text", copyContent);
                        } else {
                            document.getElementById("copyData").setAttribute("data-clipboard-text", res.data.BaiduPassword);
                        }
                        return;
                    }
                    window.scrollTo(0, 0);
                    common.showHint("warning", res.message);
                    return;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    common.showHint("warning", "提交失败");
                    common.loadClose();
                    $("#save").attr("disabled", false);
                }
            });
        }
    },
    push: function (topic_uuid) {
        let app = this.app;
        if (!topic_uuid || topic_uuid == null) {
            common.showHint("warning", "数据id不存在");
            return;
        } else {
            var url = common.baseUrl + "/api/v1/topic/push/email?topic_uuid=" + topic_uuid;
            $.ajax({
                type : "Get",  //提交方式
                url : url,//路径
                data : {},//数据，这里使用的是Json格式进行传输
                success : function(res) {//返回数据根据结果进行相应的处理

                    if (res.code == 50001) {
                        window.open("/login");
                        return;
                    }

                    if (res.code == 200) {
                        common.showHint("warning", "推送成功");
                        return;
                    }
                    window.scrollTo(0, 0);
                    common.showHint("warning", res.message);
                    return;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    common.showHint("warning", "提交失败");
                    common.loadClose();
                    $("#save").attr("disabled", false);
                }
            });
        }
    }
};
