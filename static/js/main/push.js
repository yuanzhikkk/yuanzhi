var PushObject = {
    position: 0,
    selectCategory: true,
    selectSearchButton: false,
    scrollLoading: false,
    loadListFinish: false,
    category_uuid: "",
    TimeKey: "",
    reCanvas: function (category_uuid) {
        PushObject.position = 0;
        PushObject.loadListFinish = false;
        $("#z-timeline-container").html("");
        PushObject.category_uuid = category_uuid;
        PushObject.topic(category_uuid);
    },
    scrollFunction: function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block"
        } else {
            document.getElementById("myBtn").style.display = "none"
        }
    },
    topic: function (category_uuid) {
        let position = this.position;
        if (PushObject.loadListFinish === true) {
            return
        }
        let data = "";
        if (position == 0) {
            data = "?category_uuid=" + category_uuid + "&limit=12&time_key=" + PushObject.TimeKey;
        } else {
            data = "?category_uuid=" + category_uuid + "&limit=12&position=" + position + "&time_key=" + PushObject.TimeKey;
        }
        let dataUrl = "";
        if (!PushObject.selectSearchButton) {
            dataUrl = common.baseUrl + "/api/v1/push/list" + data
        } else {
            let search_text = common.getParam("search");
            if (search_text === "" || search_text === null) {
                common.showHint("warning", "请输入搜索内容");
                return false
            }
            dataUrl = common.baseUrl + "/api/v2/topic/search?title=" + search_text + "&limit=12&position=" + position
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", dataUrl, true);
        xhr.send();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState != 4) {
                return
            }
            if (xhr.readyState == 4 && xhr.status == 200) {
                PushObject.canvasList(xhr)
            }
            PushObject.scrollLoading = false
        }
    },
    canvasList: function (xhr) {
        if (xhr.response) {
            var res = JSON.parse(xhr.response);
            console.log("啥玩意？？？", res.data.data);
            if (res.data.data == undefined) {
                PushObject.loadListFinish = true;
                return false
            } else {
            }
            let list = res.data.data;
            PushObject.position = res.data.position;
            if (!res.data.data) {
                PushObject.loadListFinish = true;
                return false
            }
            if (PushObject.position == 0) {
                if (!res.data.data) {
                    PushObject.blockNoData();
                    return false
                } else {
                    PushObject.noneNoData()
                }
                var content = `<div class="z-timeline">`;
                for (var i = 0; i < list.length; i++) {
                    content += `<a class="all-a" href="/info/${list[i].TopicUuid}"><div class="list-item"><div class="list-item-title"><span>${list[i].Title}</span><span class="zz-tag">${list[i].CategoryDetail.CategoryName}</span></div><div class="list-item-info">${list[i].Keyword}</div></div></a>`
                }
                content += `</div>`;
                var box = document.getElementById("z-timeline-container");
                box.innerHTML = content
            } else {
                var content = `<div class="z-timeline-second">`;
                for (var i = 0; i < list.length; i++) {
                    content += `<a class="all-a"href="/info/${list[i].TopicUuid}"><div class="list-item"><div class="list-item-title"><span>${list[i].Title}</span><span class="zz-tag">${list[i].CategoryDetail.CategoryName}</span></div><div class="list-item-info">${list[i].Keyword}</div></div></a>`
                }
                content += `</div>`;
                var box = document.getElementById("z-timeline-container");
                box.innerHTML = box.innerHTML + content
            }
        }
    },
    toInfoPage: function (TopicUuid) {
        if (!TopicUuid) {
            common.showHint("warning", "请输入内容索引");
            return false;
        }
        window.open(this.infoUrl + "/" + TopicUuid);
    },
    SetPosition: function (position) {
        var positionGet = common.getParam("position");
        if(positionGet) {
            this.position = positionGet;
            return;
        }
        this.position = position;
    },
    Init: function (category_uuid) {
        PushObject.category_uuid = category_uuid;
        window.onscroll = function () {
            PushObject.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (PushObject.scrollLoading === true) {
                    console.log("loading？？？");
                    return
                }
                PushObject.scrollLoading = true;
                console.log("走这里边了吗？？？");
                PushObject.topic(PushObject.category_uuid);
            }
        };
        PushObject.topic(PushObject.category_uuid);
    }
};
