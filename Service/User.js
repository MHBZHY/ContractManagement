/**
 * Created by zhy on 16/6/8.
 */
function User() {
    var Sql = require('./Mysql');
    var mysql = new Sql();
    var connection = mysql.getConnection();
    
    this.search = function (username, callBack) {
        connection.query("select * from User where User.name = '" + username + "'", function (error, rows) {
            callBack(error, rows);
        })
    };
    
    this.all = function (callBack) {
        connection.query("select * from user", function (err, rows) {
            callBack(err, rows);
        })
    };

    this.add = function (username, password, callBack, userInfo) {
        var sql = 'insert into user(name, password, date) values("' + username + '","' + password + '","' + new Date().toLocaleDateString() + '"';

        //若额外用户信息不为空
        if (userInfo != undefined) {
            sql += '"';
            userInfo.forEach(function (item) {
                sql += item + ',';
            });

            sql = sql.substring(0, sql.length - 1);
            sql += " ";
        }

        sql += ')';
        //提交至数据库
        connection.query(sql, function (error) {
            callBack(error);
        });
    };

    this.update = function (userId, oldPassword, fieldArr, valueArr, callBack) {
        var sql = 'update user set ';

        for (var i = 0; i < fieldArr.length; i++) {
            sql += fieldArr[i] + "='" + valueArr[i] + "',"
        }

        //删除多余","
        sql = sql.substring(0, sql.length - 1);
        sql += " where id = " + userId + " and password = '" + oldPassword + "'";

        console.log(sql);
        //提交
        connection.query(sql, function (error) {
            callBack(error);
        })
    };

    this.logout = function (req) {
        //断开与数据库的链接
        // connection.disconnect();

        //销毁session
        req.session.destroy();
    }
}

module.exports = User;