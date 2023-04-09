var common = function () {
};
(function (library) {
    library.baseUrl = "https://www.book-rootK.com";
    library.SetBaseUrl = function (url) {
        library.baseUrl = url;
    };
    library.getParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null
    };
    library.showHint = function (type, text) {
        var dom = document.getElementById("zz-hint-box")
        if (dom) {
            dom.innerHTML = text;
        }
        if (type === "success") {
            if (dom) {
                document.getElementById("zz-hint-box").style.backgroundColor = "#67C23A";
            }
        }
        if (type === "warning") {
            if (dom) {
                document.getElementById("zz-hint-box").style.backgroundColor = "#F56C6C";
            }
        }
        if (type === "error") {
            if (dom) {
                document.getElementById("zz-hint-box").style.backgroundColor = "#F56C6C";
            }
        }
        if (dom) {
            document.getElementById("zz-hint-box").style.display = "block";
        }
        setTimeout(function () {
            if (dom) {
                document.getElementById("zz-hint-box").style.display = "none";
            }
        }, 5000)
    };
    library.getScrollTop = function () {
        var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop
    };
    library.getScrollHeight = function () {
        var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight
    };
    library.getWindowHeight = function () {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    };
    library.setCache = function (key, data) {
        var timestamp = Date.parse(new Date());
        timestamp += 300000;
        localStorage.setItem(key, JSON.stringify({data: data, time: timestamp}));
    };
    library.getCache = function (key) {
        var data = localStorage.getItem(key);
        if (!data) {
            return false;
        }
        data = JSON.parse(data);
        var now = Date.parse(new Date());
        if (data.time <= now) {
            return false;
        }
        return data.data;
    };

    library.logout = function () {
        common.loadShow();
        var url = common.baseUrl + "/api/v1/user/logout";
        $.ajax({
            type: "Get",  //提交方式
            url: url,//路径
            data: {},//数据，这里使用的是Json格式进行传输
            success: function (result) {//返回数据根据结果进行相应的处理
                if (result.code != 200) {
                    common.showHint("warning", result.message);
                    common.loadClose();
                    return;
                }
                common.showHint("success", "登出成功");
                common.loadClose();
                window.location.href = "/login";
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                common.showHint("warning", "登出失败");
                common.loadClose();
            }
        });
    };

    library.toTop = function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    library.onKeyPress = function (e) {
        var keyCode = null;
        if (e.which) {
            keyCode = e.which;
        } else if (e.keyCode) {
            keyCode = e.keyCode;
        }
        if (keyCode == 13) {
            library.search();
            return false;
        }
        return true;
    };

    library.search = function () {
        let search_text = document.getElementById("search-box-value").value;
        if (!search_text) {
            common.showHint("warning", "请输入搜索内容");
            return false;
        }
        window.location.href = "/search" + "?search=" + search_text;
    }

    library.noneNoMore = function () {
        document.getElementById("zz-no-more").style.display = "none"
    };
    library.blockNoMore = function () {
        document.getElementById("zz-no-more").style.display = "block"
    };

    library.loadShow = function () {
        loadingShow();
    }

    library.loadClose = function (fn) {
        setTimeout(() => {
            loadingHide();
            if (fn) {
                fn();
            }
        }, 500)
    }
    library.checkEmail = function (email) {
        let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/; //正则表达式
        if (email === "") { //输入不能为空
            return false;
        } else return reg.test(email);
    }
})(common)
