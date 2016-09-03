/**
 * Created by zhy on 16/6/9.
 */
function Contract() {
    //自身指针
    var self = this;

    //数据库
    var Sql = require('./Mysql');
    var mysql = new Sql();
    var connection = mysql.getConnection();

    //文件
    var fs = require('fs');

    //路径
    var path = require('path');
    var basicPath = path.join(__dirname, "../Public");

    //文件表单处理
    var multiparty = require('multiparty');

    //返回所有合同
    this.getAll = function (userId, callBack) {
        connection.query('SELECT ct.id, ct.name, ct.date, ct.path FROM contract ct, user_contract uc ' +
            'WHERE ct.id = uc.contract_id AND uc.user_id = "' + userId + '"', function (error, rows) {
            callBack(error, rows);
        });
    };

    //返回所有用户的合同...
    this.adminGetAll = function (callBack) {
        connection.query('SELECT ct.id, ct.name, ct.date, ct.path FROM contract ct', function (err, rows) {
            callBack(err, rows);
        })
    };

    //添加
    this.add = function (req, res, callBack) {
        var newPath = path.join(__dirname, "../Public/upload/");
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({uploadDir: newPath});
        //上传完成后处理
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log('Parser error: ' + err);
            }
            else {
                // console.log(files);
                
                //各种文件路径
                var inputFile = files.file[0];
                var uploadedPath = inputFile.path;
                var dstPath = newPath + req.session.userId + "_" + inputFile.originalFilename;
                // console.log(dstPath);

                //检查文件是否已存在
                if (fs.existsSync(dstPath) == true) {
                    res.send('<script>' +
                        'alert("文件已存在");' +
                        'location.href="../../"' +
                        '</script>');
                    return;
                }
                
                //重命名为真实文件名
                fs.rename(uploadedPath, dstPath, function (err) {
                    if (err) {
                        console.log('rename error: ' + err);
                        res.send('<script>' +
                            'alert("上传失败");' +
                            'location.href="../../"' +
                            '</script>');

                        return;
                    }

                    console.log('rename ok');
                    console.log(req.url);

                    //重命名成功后插入数据库
                    var sql = 'insert into contract(name, path, date) values("' +
                        inputFile.originalFilename + '", "' +
                        req.url + '/' + req.session.userId + "_" + inputFile.originalFilename + '", "' +
                        new Date().toLocaleDateString() + '")';

                    // console.log(sql);
                    
                    connection.query(sql, function (error) {
                        if (error) {
                            res.send('<script>' +
                                'alert("数据库操作失败");' +
                                'location.href="../../"' +
                                '</script>');

                            return;
                        }

                        //新增用户-合同信息
                        var sql2 = 'insert into user_contract(user_id, contract_id) values(' +
                            req.session.userId + ', (SELECT max(id) FROM contract))';

                        connection.query(sql2, function (error) {
                            if (error) {
                                res.send('<script>' +
                                    'alert("数据库操作失败");' +
                                    'location.href="../../"' +
                                    '</script>');

                                return;
                            }

                            res.send('<script>' +
                                'alert("数据库操作成功");' +
                                'location.href="../../"' +
                                '</script>');
                        });
                    });
                });
            }
        });
    };

    //更新文件名称
    this.updateFileName = function (contractId, filename, callBack) {
        //获取userid
        connection.query('select user_id from user_contract where contract_id = ' + contractId, function (err, rows) {
            var userId = rows[0]['user_id'];
            
            //获取文件路径
            connection.query('select path from contract where id = ' + contractId, function (error, rows) {
                if (error) {
                    callBack(error);
                    return;
                }

                var oldPath = basicPath + rows[0].path;
                var newPath = basicPath + "/upload/" + userId + "_" + filename;

                // console.log(oldPath);
                // console.log(newPath);

                //重命名文件
                fs.rename(oldPath, newPath, function (error) {
                    if (error) {
                        callBack(error);
                        return;
                    }

                    //更新数据库
                    self.update(contractId, ['name', 'path'], [filename, '/upload/' + userId + "_" + filename], function (error) {
                        callBack(error);
                    })
                });
            });
        });
    };

    //更新数据库
    this.update = function (contractId, fields, data, callBack) {
        var sql = "update contract ct set ";

        for (var i = 0; i < fields.length; i++) {
            sql += "ct." + fields[i] + "='" + data[i] + "',";
        }

        sql = sql.substring(0, sql.length - 1);
        sql += " where ct.id = " + contractId;

        console.log(sql);

        connection.query(sql, function (error) {
            callBack(error);
        })
    };

    //删除合同
    this.delete = function (contractId, callBack) {
        //获得文件路径
        connection.query('select path from contract where id = ' + contractId, function (error, rows) {
            if (error) {
                callBack(error);
                return;
            }

            var filePath = basicPath + rows[0].path;

            //删除文件
            fs.unlink(filePath, function (error) {
                if (error) {
                    callBack(error);
                    return;
                }

                //删除数据库对应条目
                connection.query('delete from user_contract where contract_id = ' + contractId, function (error) {
                    callBack(error);
                });
            })
        });
    }
}

module.exports = Contract;