/**
 * Created by zhy on 16/6/11.
 */
var ul;
var table;
var userId;
var isAdmin;
var page;
var numOfRowInTable = 12;
var presentMode;

$(function () {
    ul = $("ul.operation");
    table = $("div.main div.right table");
    userId = $("p#user_id").html();
    isAdmin = $("p#is_admin").html();
    page = $("p.pages");
    presentMode = $("p#table_mode").html();

    //生成table
    $.geneMainTable();
    
    //设置大小
    $.setFrame();

    //判断是否管理
    if (isAdmin == "0") {
        //添加模块
        $.addContractModule();
        $.deleteContractModule();
        $.changePageModule();
    }
    
    //获取数据
    $.getAndShowDataInTable(function () {
        //判断模块是否应当被启用
        $.judgeDeleteModules();
        $.judgeChangePageModule();
    });
});

$(window).resize(function () {
    $.setFrame();
});

$.setFrame = function () {
    var height = $(window).height();

    $("div.main div.left").height(height - $("div.title").height());
    $("div.main div.right").height(height - $("div.title").height());

    var rowHeight = table.height() / (numOfRowInTable + 1);
    table.find("tr").height(rowHeight);
};

$.judgeDeleteModules = function () {
    //删除
    if ($($("tr.active").find("td")[0]).html() == "") {
        $.disableDeleteModule();
    }
    else if (DELETE_CONTRACT_ENABLED == false) {
        $.enableDeleteModule();
    }
};

$.judgeChangePageModule = function () {
    //向上翻页
    if (presentPageNum == 1) {
        $.disableGoLastPageModule();
    }
    else if (GO_LAST_PAGE_ENABLED == false) {
        $.enableGoLastPageModule();
    }

    //向下翻页
    if (presentPageNum == Math.ceil(count / numOfRowInTable) || Math.ceil(count / numOfRowInTable) == 0) {
        $.disableGoNextPageModule();
    }
    else if (GO_NEXT_PAGE_ENABLED == false) {
        $.enableGoNextPageModule();
    }
};

$.isEditing = function () {

};

$.onBlur = function (self) {
    var td = self.parent();
    var inner = self.val();
    var oldValue = self.attr("oldValue");

    td.html(inner);
    
    if (inner != oldValue) {
        $.updateRow(inner, td.prev().html());
    }
};

// $.justOnePage = function () {
//     $.noLastPage();
//     $.noNextPage();
// };

$.logout = function () {
    $.post(URL, {
        "action": "logout"
    }, function () {
        location.href="/";
    })
};