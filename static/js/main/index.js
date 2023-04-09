var IndexObject = {
    position: 0,
    selectCategory: true,
    selectSearchButton: false,
    scrollLoading: false,
    loadListFinish: false,
    page: 0,
    infoUrl: "/info/",
    scrollFunction: function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block"
        } else {
            document.getElementById("myBtn").style.display = "none"
        }
    },
    noneNoData: function () {
        document.getElementById("zz-no-data").style.display = "none"
    },
    blockNoData: function () {
        document.getElementById("zz-no-data").style.display = "block"
    },
    noneNoMore: function () {
        document.getElementById("zz-no-more").style.display = "none"
    },
    blockNoMore: function () {
        document.getElementById("zz-no-more").style.display = "block"
    },
    getQueryVariable: function (name) {
        let rs = new RegExp("(^|)" + name + "=([^&]*)(&|$)", "gi").exec(window.document.location.href);
        let tmp;
        if ((tmp = rs)) return tmp[2];
        return null
    },
    topic: function (category_uuid) {
        let position = this.position;
        if (IndexObject.loadListFinish === true) {
            return
        }
        let data = "";
        if (position == 0) {
            data = "?category_uuid=" + category_uuid + "&limit=12"
        } else {
            data = "?category_uuid=" + category_uuid + "&limit=12&position=" + position
        }
        let dataUrl = "";
        if (!IndexObject.selectSearchButton) {
            dataUrl = common.baseUrl + "/api/v2/topic/list" + data
        } else {
            let search_text = common.getParam("search");
            if (search_text === "" || search_text === null) {
                common.showHint("warning", "请输入搜索内容");
                return false
            }
            dataUrl = common.baseUrl + "/api/v3/topic/search?title=" + search_text + "&limit=12&page=" + this.page
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", dataUrl, true);
        xhr.send();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState != 4) {
                return
            }
            if (xhr.readyState == 4 && xhr.status == 200) {
                IndexObject.canvasList(xhr)
            }
            IndexObject.scrollLoading = false
        }
    },
    search: function () {
        if (IndexObject.loadListFinish === true) {
            return
        }
        let search_text = common.getParam("search");
        if (search_text === "" || search_text === null) {
            common.showHint("warning", "请输入搜索内容");
            return false
        }
        dataUrl = common.baseUrl + "/api/v3/topic/search?title=" + search_text + "&limit=12&page=" + this.page
        var xhr = new XMLHttpRequest();
        xhr.open("GET", dataUrl, true);
        xhr.send();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState != 4) {
                return
            }
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.response) {
                    var res = JSON.parse(xhr.response);
                    IndexObject.noneNoData();
                    console.log("啥玩意2？？？", res.data.data);
                    if (res.data.data == undefined) {
                        IndexObject.blockNoMore();
                        IndexObject.loadListFinish = true;
                        return false
                    } else {
                        IndexObject.noneNoMore()
                    }
                    let list = res.data.data;
                    IndexObject.page = res.data.page;
                    if (!res.data.data) {
                        IndexObject.loadListFinish = true;
                        return false
                    }

                    var content = `<div class="z-timeline-second">`;
                    for (var i = 0; i < list.length; i++) {
                        content += `<a class="all-a"href="/info/${list[i].TopicUuid}"><div class="list-item"><div class="list-item-title"><span>${list[i].Title}</span><span class="zz-tag">${list[i].CategoryDetail.CategoryName}</span></div><div class="list-item-info">${list[i].Keyword}</div></div></a>`
                    }
                    content += `</div>`;
                    var box = document.getElementById("z-timeline-container");
                    box.innerHTML = box.innerHTML + content

                }
            }
            IndexObject.scrollLoading = false
        }
    },
    canvasList: function (xhr) {
        if (xhr.response) {
            var res = JSON.parse(xhr.response);
            IndexObject.noneNoData();
            console.log("啥玩意？？？", res.data.data);
            if (res.data.data == undefined) {
                IndexObject.blockNoMore();
                IndexObject.loadListFinish = true;
                return false
            } else {
                IndexObject.noneNoMore()
            }
            let list = res.data.data;
            IndexObject.position = res.data.position;
            if (!res.data.data) {
                IndexObject.loadListFinish = true;
                return false
            }
            if (IndexObject.position == 0) {
                if (!res.data.data) {
                    IndexObject.blockNoData();
                    return false
                } else {
                    IndexObject.noneNoData()
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
        if (positionGet) {
            this.position = positionGet;
            return;
        }
        this.position = position;
    },
    Init: function (category_uuid) {
        window.onscroll = function () {
            IndexObject.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (IndexObject.scrollLoading === true) {
                    console.log("loading？？？");
                    return
                }
                IndexObject.scrollLoading = true;
                console.log("走这里边了吗？？？");
                IndexObject.topic(category_uuid)
            }
        };
    },
    SearchInit: function () {
        window.onscroll = function () {
            IndexObject.scrollFunction();
            var bottom = common.getScrollHeight() - (common.getScrollTop() + common.getWindowHeight());
            if (bottom <= 200) {
                if (IndexObject.scrollLoading === true) {
                    console.log("loading？？？");
                    return
                }
                IndexObject.scrollLoading = true;
                console.log("走这里边了吗？？？");
                IndexObject.search()
            }
        };
    }
};
