var EmailUserObject = {
    sendVerifyCode: function (email) {
        // 创建XHR对象
        const xhr = new XMLHttpRequest();
        // 监听请求状态变化
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    common.showHint("success", "获取验证码成功");
                } else {
                    common.showHint("error", "获取验证码失败，请稍后再试");
                    // console.error('请求失败', xhr.status);
                }
            }
        };
        // 配置请求
        const url = common.baseUrl + "/api/v2/user/sendRegUserCode";
        const params = {
            email: email,
        };
        const jsonParams = JSON.stringify(params);
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        // 发送请求
        xhr.send(jsonParams);
    },
    reg: function (username,email,password,code) {
        // 创建XHR对象
        const xhr = new XMLHttpRequest();
        // 监听请求状态变化
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var res = JSON.parse(xhr.response);
                    if (res.code === 200)
                    {
                        common.showHint("success", "注册成功");
                        window.location.href = "/email/login"
                        return
                    }else {
                        common.showHint("warning", res.message);
                        return;
                    }
                }
                common.showHint("error", "注册失败，请稍后再试");
            }
        };
        // 配置请求
        const url = common.baseUrl + "/api/v2/user/reg";
        const params = {
            username:username,
            email: email,
            password:password,
            code:code
        };
        const jsonParams = JSON.stringify(params);
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        // 发送请求
        xhr.send(jsonParams);
    },
    login: function () {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        if (!common.checkEmail(email)) {
            common.showHint("warning", "请输入正确邮箱");
            return false;
        }
        let data = {email: email, password: password};
        var xhr = new XMLHttpRequest();
        xhr.open("POST", common.baseUrl + "/api/v2/user/login", true);
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.response) {
                    var res = JSON.parse(xhr.response);
                    if (res.code == 200) {
                        // if (changeCss) {
                        //     document.getElementById("user-phone").style.display = "block";
                        //     document.getElementById("zz-login-btn-top").style.display = "none";
                        //     document.getElementById("z-login-box").style.display = "none";
                        //     document.getElementById("user-phone").innerHTML = topBannerLibrary.vaguePhone(phone);
                        // }
                        localStorage.setItem("user_uuid", res.data.user_uuid);
                        // localStorage.setItem("user_uuid_phone", passPhone);
                        common.showHint("success", "登录成功");
                        window.location.href = "/";
                        return
                    } else {
                        common.showHint("warning", res.message);
                    }
                }
            }
        }
    }
}
