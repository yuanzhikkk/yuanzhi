var loginObject = {
    loginUuid: "", init: function () {
        this.getWechatImage();
    }, getWechatImage: function () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", common.baseUrl + "/api/v1/user/qrcode?app=wechat", true);
        xhr.send();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.response) {
                    var res = JSON.parse(xhr.response);
                    if (res.code == 200) {
                        loginObject.startScan(res.Data.uuid);
                        document.getElementById("wechat-image").setAttribute("src", res.Data.img);
                    } else {
                        common.showHint("warning", "获取验证码失败，请稍后再试");
                        return
                    }
                }
            }
        };
    }, startScan: function (login_uuid) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", common.baseUrl + "/api/v1/user/checkLogin?login_uuid=" + login_uuid, true);
        xhr.send();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.response) {
                    var res = JSON.parse(xhr.response);
                    if (res.code == 103) {
                        setTimeout(function () {
                            loginObject.startScan(login_uuid);
                        }, 5000);
                        return
                    }
                    if (res.code == 200) {
                        window.location.href = "/";
                        return;
                    }
                    common.showHint("warning", "网络错误");
                    return
                }
            }
        };
    }, changeTab: function (index) {
        let item = document.getElementsByClassName("chang-item");
        for (var i = 0; i < item.length; i++) {
            item[i].style.color = "#000";
        }
        document.getElementsByClassName("chang-item")[index].style.color = "#409eff";
        let body = document.getElementsByClassName("zz-body");
        for (var i = 0; i < body.length; i++) {
            body[i].style.display = "none";
        }
        document.getElementsByClassName("zz-body")[index].style.display = "block";
    },
}
