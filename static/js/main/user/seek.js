var seekObject = {
    requestSeek: function (uuid) {
        $("#save").attr("disabled", true);

        var meansName = $("#means_name").val();
        if (meansName === "") {
            common.showHint("warning", "资料名称不能是空");
            return;
        }
        var meansDescription = $("#means_description").val();
        if (meansDescription === "") {
            common.showHint("warning", "资料描述不能是空");
            return;
        }

        var is_anonymous = 0;
        var anonymous = $("#anonymous").is(":checked");
        if (anonymous === false) {
            is_anonymous = 0;
        } else {
            is_anonymous = 1;
        }

        var data = {
            "means-name" : meansName,
            "means-description": meansDescription,
            "anonymous": is_anonymous,
        };
        if (!uuid) {
            var url = common.baseUrl + "/api/v1/user/seek";
        } else {
            var url = common.baseUrl + "/api/v1/user/seek/edit/" + uuid;
            data.uuid = uuid;
        }
        common.loadShow();
        $.ajax({
            type : "Post",  //提交方式
            url : url,//路径
            data : data,//数据，这里使用的是Json格式进行传输
            success : function(result) {//返回数据根据结果进行相应的处理
                if (result.code == 50001) {
                    window.location.href = "/login";
                    return;
                }

                if (result.code != 200) {
                    common.showHint("warning", result.message);
                    common.loadClose();
                    $("#save").attr("disabled", false);
                    return;
                }
                common.loadClose(function () {
                    window.location.href = "/user/seek/success/" + result.uuid;
                    $("#save").attr("disabled", false);
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                common.showHint("warning", "提交失败");
                common.loadClose();
                $("#save").attr("disabled", false);
            }
        });
    }
}
