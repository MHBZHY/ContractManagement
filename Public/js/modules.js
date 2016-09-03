/**
 * Created by zhy on 16/6/11.
 */
// var ADD_CONTRACT_ENABLED = true;
var DELETE_CONTRACT_ENABLED = true;
var GO_LAST_PAGE_ENABLED = true;
var GO_NEXT_PAGE_ENABLED = true;

$.addContractModule = function () {
    ul.html(ul.html() + '<li class="add-contract">' +
        '<p class="operation-header">添加合同</p>' +
        '<form action="../upload" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="file" onchange="$.addContractFileChanged($(this))">' +
        '<input type="text" name="action" value="upload">' +
        '<input class="activated" type="button" value="点击选择文件" onclick="$.addContractEvent()">' +
        '<input class="activated" type="submit" class="function" value="提交">' +
        '</form>' +
        '</li>');
};

$.deleteContractModule = function () {
    ul.html(ul.html() + '<li class="delete-contract">' +
        '<p class="operation-header">删除合同</p>' +
        '<input class="activated" type="button" class="function" value="删除" onclick="$.deleteContract()">' +
        '</li>');
};

$.enableDeleteModule = function () {
    $.enable($("li.delete-contract input"));
    DELETE_CONTRACT_ENABLED = true;
};

$.disableDeleteModule = function () {
    $.disable($("li.delete-contract input.activated"));
    DELETE_CONTRACT_ENABLED = false;
};

$.changePageModule = function () {
    ul.html(ul.html() + '<li class="change-page">' +
        '<p class="operation-header">翻页</p>' +
        '<input class="activated" type="button" class="function changepage" value="上一页" onclick="$.lastPage()">' +
        '<input class="activated" type="button" class="function changepage" value="下一页" onclick="$.nextPage()">' +
        '</li>');
};

$.enableGoLastPageModule = function () {
    $.enable($("li.change-page input[value=上一页]"));
    GO_LAST_PAGE_ENABLED = true;
};

$.enableGoNextPageModule = function () {
    $.enable($("li.change-page input[value=下一页]"));
    GO_NEXT_PAGE_ENABLED = true;
};

$.disableGoLastPageModule = function () {
    $.disable($("li.change-page input[value=上一页].activated"));
    GO_LAST_PAGE_ENABLED = false;
};

$.disableGoNextPageModule = function () {
    $.disable($("li.change-page input[value=下一页].activated"));
    GO_NEXT_PAGE_ENABLED = false;
};

$.enable = function (input) {
    input.addClass("activated");
    input.removeAttr("disabled");
};

$.disable = function (input) {
    input.removeClass("activated");
    input.attr("disabled", "disabled");
};

$.geneMainTable = function () {
    switch (presentMode) {

        case "0":
            var innerTable = '<tr class="first-line"><th>合同编号</th><th>文件名</th><th>上传时间</th><th>下载文件</th></tr><tr class="active"><td></td><td></td><td></td><td></td></tr>';

            for (var i = 0; i < 11; i++) {
                innerTable += '<tr><td></td><td></td><td></td><td></td></tr>';
            }

            table.html(innerTable);

            //td双击事件
            var responsibleTrArr = table.find("tr").not("tr.first-line");
            var dbclickTDArr = [];

            $(responsibleTrArr).each(function () {
                dbclickTDArr.push($(this).find("td")[1]);
            });

            $(dbclickTDArr).dblclick(function () {
                var inner = $(this).html();
                $(this).html('<input class="inner" type="text" onblur="$.onBlur($(this))" value="' + inner + '" oldValue="' + inner + '">');
                $("input.inner").focus();
            });

            break;

        case "1":
            var innerTable = '<tr class="first-line"><th>用户编号</th><th>用户名</th><th>注册时间</th><th>电话号码</th><th>邮箱</th></tr><tr class="active"><td></td><td></td><td></td><td></td><td></td></tr>';

            for (var i = 0; i < 11; i++) {
                innerTable += '<tr><td></td><td></td><td></td><td></td><td></td></tr>';
            }

            table.html(innerTable);

            break;
        
        case "2":
            var innerTable = '<tr class="first-line"><th>合同编号</th><th>文件名</th><th>上传时间</th><th>下载文件</th><th>权限</th></tr><tr class="active"><td></td><td></td><td></td><td></td><td></td></tr>';

            for (var i = 0; i < 11; i++) {
                innerTable += '<tr><td></td><td></td><td></td><td></td><td></td></tr>';
            }

            table.html(innerTable);

            break;
        
        
        default:
            break;
    }
    
    //table各行等高
    var tableHeight = table.height();
    table.find("tr").height(tableHeight / (numOfRowInTable + 1));

    //table点击事件
    var responsibleTrArr = table.find("tr").not("tr.first-line");

    responsibleTrArr.click(function () {
        $("tr.active").removeClass('active');
        $(this).addClass('active');

        //判断右侧功能模块内容
        $.judgeDeleteModules();
        
        //管理员模式
        //用户选择合同
        if (presentMode == "1") {
            var chooseConInput = $("li.admin_operation input[type=submit]")[1];
            
            if ($($("tr.active").find("td")[0]).html() == "") {
                $.disable($(chooseConInput));
            }
            else {
                $.enable($(chooseConInput));
            }
        }
    });
};

$.addContractEvent = function (self) {
    $("li.add-contract input[type=file]").trigger("click");
};

$.addContractFileChanged = function (self) {
    var fileVal = self.val();

    $("li.add-contract input[type=button].activated").val(
        "已选择文件: " + fileVal.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1") + fileVal.replace(/.+\./,"") + ", 点击重新选择"
    )
};

$.deleteContract = function () {
    $.post(URL, {
        "action": "delete",
        "contract_id": $("tr.active").find("td")[0].innerHTML
    }, function (data) {
        alert(data);

        //刷新数据
        location.reload(true);
    })
};

$.lastPage = function () {
    presentPageNum--;
    $.changePageNumber();
};

$.nextPage = function () {
    presentPageNum++;
    $.changePageNumber();
};