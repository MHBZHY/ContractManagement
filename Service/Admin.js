/**
 * Created by zhy on 16/6/12.
 */
function AdminController() {
    var self = this;

    var active = "";
    var operation = "";
    
    this.admin_flag = "";
    this.admin_module = "";

    this.admin_func = function (step) {
        var admin1 = "", admin2 = "";

        switch (step) {
            case 0:
                admin1 = " admin";
                admin2 = "";

                break;
            case 1:
                admin1 = "";
                admin2 = " admin";

                break;

            default:
                break;
        }


        self.admin_flag = "管理员, ";
        self.admin_module = "<li class='admin_operation'>" +
            "<p class='operation-header'>管理员特权~</p>" +
            "<input class='activated" + admin1 + "' type='submit' value='选择用户' disabled>" +
            "<form action='../../' method='post'>" +
            "<input class='activated" + admin2 + "' type='submit' value='选择合同'>" +
            "<input type='text' name='action' value='choose_contract'>" +
            "</form>" +
            "</li>" +
            "<li class='restart'>" +
            "<p class='operation-header'>重新开始</p>" +
            "<form action='../../' method='post'>" +
            "<input class='activated' type='submit' value='重新开始'>" +
            "<input type='text' name='action' value='restart'>" +
            "</form>" +
            "</li>";
    };

    // this.activate = function (req, res) {
    //     if (req.session.admin_activatied == 0 || req.session.admin_activatied == undefined) {
    //         //激活管理员功能
    //         req.session.admin_activatied = 1;
    //         //加入active标签, 使按钮常亮
    //         active = "admin";
    //         operation = "取消";
    //         //重新设置按钮
    //         self.admin_func();
    //         //刷新
    //         res.send('<script type="text/javascript">' +
    //             'location.href="' + req.headers.referer + '"' +
    //             '</script>')
    //     }
    //     else if (req.session.admin_activatied == 1) {
    //         req.session.admin_activatied = 0;
    //         active = "";
    //         operation = "";
    //         self.admin_func();
    //         res.send('<script type="text/javascript">' +
    //             'location.href="' + req.headers.referer + '"' +
    //             '</script>')
    //     }
    // };
    
    this.reset = function () {
        active = "";
        operation = "";
        self.admin_flag = "";
        self.admin_module = "";
    }
}

module.exports = new AdminController();