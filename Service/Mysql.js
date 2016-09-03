/**
 * Created by zhy on 16/6/8.
 */
function Mysql() {
    var mysql = require('mysql');

    var host = 'localhost';
    var port = '3306';
    var user = 'root';
    var password = '248326';
    var db = 'ContractManagement';
    var charset = 'UTF8_BIN';

    this.getConnection = function () {
        var connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            port: port,
            database: db,
            charset: charset
        });

        connection.connect();

        return connection;
    };
}

module.exports = Mysql;