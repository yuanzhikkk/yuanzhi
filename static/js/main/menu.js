var menuObject = {
    selectCategoryUuid: "",
    setCaches: function (categoryUuid) {
        this.selectCategoryUuid = categoryUuid;
    },
    category: function () {
        var id = "#" + this.selectCategoryUuid;
        $(id).attr("style", "color:#7f7fff;");
        var parentId = $(id).attr("data-parentid");
        $("#" + parentId).attr("style", "color:#7f7fff;");
    },
    toTop: function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    },
};
