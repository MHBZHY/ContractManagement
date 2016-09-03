/**
 * Created by zhy on 16/6/10.
 */
var contracts = [];//分割完成的合同列表
var count;//总合同数
var keys = ['id', 'name', 'date', 'path'];//解析用键值
var userKeys = ['id', 'name', 'date', 'phone', 'mail'];
var userPrivilegeKeys = ['id', 'name', 'date', 'path', 'privilege'];
var URL = '../../';
var presentPageNum = 1;


$.getAndShowDataInTable = function (callBack) {
    $.getData(function () {
        $.showDataInTable(contracts[0]);

        //第一页
        presentPageNum = 1;

        //设置页码
        $.changePageNumber();
        
        //附加操作
        callBack();
    })
};

$.getData = function (callBack) {
    var action;
    
    switch (presentMode) {
        case "0":
            action = 'all_contracts';
            break;
        case "1":
            action = 'all_users';
            break;
        
        default:
            action = '';
            break;
    }
    
    $.post(URL, {
        'action': action,
        'user_id': userId
    }, function (data) {
        count = data.length;
        $.divideData(data);

        callBack();
    });
};

$.divideData = function (undivided_contracts) {
    var tempArr = [];

    $(undivided_contracts).each(function (index) {
        var contractDic = this;

        if (index % numOfRowInTable == 0 && index != 0) {
            //满十个推入列表
            contracts.push(tempArr);
            tempArr = [];
        }

        //拼接合同(字典转数组)
        var contract = [];

        keys.forEach(function (key) {
            contract.push(contractDic[key]);
        });

        tempArr.push(contract);
    });

    //如果有剩余
    if (tempArr.length != 0) {
        contracts.push(tempArr);
    }
};

$.showDataInTable = function (dataSource) {
    var trArr = table.find("tr").not("tr.first-line");
    var tdArr = [];

    $(trArr).each(function () {
        tdArr.push($(this).find("td"));
    });

    //添加下载链接
    $(dataSource).each(function (trIndex) {
        var dataRow = this;

        $(tdArr[trIndex]).each(function (tdIndex) {
            //最后一行
            if (tdIndex == tdArr[trIndex].length - 1 && presentMode == "0") {
                $(this).html('<a href="' + dataRow[tdIndex] + '">下载</a>');
                return;
            }

            $(this).html(dataRow[tdIndex]);
        });
    })
};

$.changePageNumber = function () {
    var pageNum = Math.ceil(count / numOfRowInTable);

    if (pageNum == 0) {
        pageNum++;
    }

    page.html(presentPageNum + '/' + pageNum + "页, 共" + count + "个");

    //判断右侧功能模块
    $.judgeChangePageModule();

    //清空table
    table.empty();

    //重新生成table
    $.geneMainTable();

    //填充table内容
    $.showDataInTable(contracts[presentPageNum - 1]);
};

$.jumpToPage = function (num) {
    presentPageNum = num;
    $.showDataInTable(contracts[presentPageNum - 1]);
    $.changePageNumber();
};

$.updateRow = function (inner, id) {
    $.post(URL, {
        "action": "update_row",
        "inner": inner,
        "id": id
    }, function (data) {
        alert(data);

        location.reload(true);
    })
};