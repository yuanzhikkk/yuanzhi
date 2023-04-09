var topBannerLibrary = {
    selectCategoryUuid: "",
    defaultSelectCategory: true,
    searchUrl: "/search",
    app: "",
    indexUrl: "index.html",
    init: function (completeFunction) {
        this.category(completeFunction);
    },
    cancelContact: function () {
        document.getElementById("z-info-box-contact").style.display = "none";
    },
    search: function () {
        let search_text = document.getElementById("search-box-value").value;
        if (!search_text) {
            common.showHint("warning", "请输入搜索内容");
            return false;
        }
        window.location.href = topBannerLibrary.searchUrl + "?search=" + search_text;
    },
    category: function (completeFunction) {
        var cache = common.getCache("category");
        if (cache) {
            topBannerLibrary.selectCategoryUuid = common.getParam("category_uuid");
            topBannerLibrary.makeCatrgoryTree(cache, topBannerLibrary.selectCategoryUuid);
            if (!completeFunction) {
                return;
            }
            completeFunction(topBannerLibrary.selectCategoryUuid);
            return
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", common.baseUrl + "/api/v1/category/list", true);
        xhr.send();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState != 4) {
                return;
            }
            if (xhr.status != 200) {
                common.showHint("warning", "网络错误");
                return;
            }
            if (!xhr.response) {
                common.showHint("warning", "获取响应失败");
                return;
            }
            var res = JSON.parse(xhr.response);
            if (res.code != 200) {
                common.showHint("warning", res.message);
                return;
            }
            let categoryList = res.data;
            common.setCache("category", categoryList);
            topBannerLibrary.selectCategoryUuid = common.getParam("category_uuid");
            topBannerLibrary.makeCatrgoryTree(categoryList, topBannerLibrary.selectCategoryUuid);
            if (!completeFunction) {
                return;
            }
            completeFunction(topBannerLibrary.selectCategoryUuid);
        };
    },
    clickFirstNav: function (uuid) {
        let url = this.indexUrl + "?category_uuid=" + uuid;
        if (this.app) {
            url += "&app=" + this.app;
        }
        window.location.href = url;
    },
    cancelInfo: function () {
        document.getElementById("z-info-box").style.display = "none";
    },
    login: function () {
        window.open("/login");
    },
    cancelLogin: function () {
        document.getElementById("z-login-box").style.display = "none";
    },
    makeCatrgoryTree: function (data, selectCategoryUuid) {
        let len = data.length;
        let res = [];
        let selectParentCategoryUuid = "";
        let belongIndex = 0;
        tmpParentIndex = 0;
        for (let i = 0; i < len; i++) {
            data[i].children = [];
            if (data[i].ParentCategoryUuid === "") {
                if (data[i].CategoryUuid == selectCategoryUuid) {
                    belongIndex = tmpParentIndex;
                }
                tmpParentIndex++;
                res.push(data[i]);
                belongSon = false;
                continue;
            }
        }
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < res.length; j++) {
                if (!res[j].children) {
                    res[j].children = [];
                }
                if (data[i].ParentCategoryUuid === res[j].CategoryUuid) {
                    if (data[i].CategoryUuid == selectCategoryUuid) {
                        selectParentCategoryUuid = data[i].ParentCategoryUuid;
                    }
                    res[j].children.push(data[i]);
                    break;
                }
            }
        }
        if (selectParentCategoryUuid == "") {
            if (res.length != 0) {
                selectParentCategoryUuid = res[belongIndex].CategoryUuid;
                if (topBannerLibrary.defaultSelectCategory) {
                    if (res[belongIndex].children.length > 0) {
                        topBannerLibrary.selectCategoryUuid = res[belongIndex].children[0].CategoryUuid;
                    }
                }
            } else {
                selectParentCategoryUuid = "";
                if (topBannerLibrary.defaultSelectCategory) {
                    topBannerLibrary.selectCategoryUuid = " `"
                }
            }
        }
        var content = `<div class="z-phone-hide">`;
        var sencondContent = `<div class="z-view-hide">`;
        for (let i = 0; i < res.length; i++) {
            var tmp = res[i];
            if (tmp.CategoryUuid != selectParentCategoryUuid) {
                content += `<div onClick="topBannerLibrary.clickFirstNav('${tmp.CategoryUuid}')" class="z-nav-item">${tmp.CategoryName}</div>`;
                continue;
            }
            if (topBannerLibrary.defaultSelectCategory) {
                content += `<div onClick="topBannerLibrary.clickFirstNav('${tmp.CategoryUuid}')" style="color:#7f7fff" class="z-nav-item">${tmp.CategoryName}</div>`;
            } else {
                content += `<div onClick="topBannerLibrary.clickFirstNav('${tmp.CategoryUuid}')" class="z-nav-item">${tmp.CategoryName}</div>`;
            }
            for (let num = 0; num < tmp.children.length; num++) {
                var tmpChild = tmp.children[num];
                if (tmpChild.CategoryUuid != topBannerLibrary.selectCategoryUuid) {
                    sencondContent += `<div class="z-view-item" onClick="topBannerLibrary.clickFirstNav('${tmpChild.CategoryUuid}')"><span>${tmpChild.CategoryName}</span></div>`;
                    continue;
                }
                sencondContent += `<div style="color:#7f7fff" class="z-view-item" onClick="topBannerLibrary.clickFirstNav('${tmpChild.CategoryUuid}')"><span>${tmpChild.CategoryName}</span></div>`;
            }
        }
        sencondContent += `</div>`;
        content += `</div>`;
        var box = document.getElementById("nav-list");
        box.innerHTML = content;
        var boxSon = document.getElementById("z-view-hide-box");
        boxSon.innerHTML = sencondContent;
        return res;
    },
    toTop: function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    },
    loginBtn: function (changeCss = true, func) {
        let phone = document.getElementById("zz-phone").value;
        let ver = document.getElementById("zz-ver").value;
        let passPhone = topBannerLibrary.vaguePhone(phone);
        if (!phone || !ver) {
            common.showHint("warning", "请输入手机号验证码");
            return false;
        }
        let data = {phone: phone, code: ver,};
        var xhr = new XMLHttpRequest();
        xhr.open("POST", common.baseUrl + "/api/v1/user/login", true);
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.response) {
                    var res = JSON.parse(xhr.response);
                    if (res.code == 200) {
                        if (changeCss) {
                            document.getElementById("user-phone").style.display = "block";
                            document.getElementById("zz-login-btn-top").style.display = "none";
                            document.getElementById("z-login-box").style.display = "none";
                            document.getElementById("user-phone").innerHTML = topBannerLibrary.vaguePhone(phone);
                        }
                        localStorage.setItem("user_uuid", res.Data.user_uuid);
                        localStorage.setItem("user_uuid_phone", passPhone);
                        if (func) func();
                        common.showHint("success", "登录成功");
                    } else {
                        common.showHint("warning", res.message);
                    }
                }
            }
        };
    },
    vaguePhone: function (str) {
        return str.substring(7, 11);
    },
    onKeyPress: function (e) {
        var keyCode = null;
        if (e.which) {
            keyCode = e.which;
        } else if (e.keyCode) {
            keyCode = e.keyCode;
        }
        if (keyCode == 13) {
            topBannerLibrary.search();
            return false;
        }
        return true;
    }
};
