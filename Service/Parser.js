/**
 * Created by zhy on 16/6/8.
 */
function RequestParser(app) {
    var bodyParser = require('body-parser');
    var urlEncodedParser = bodyParser.urlencoded({extended: false});

    var use = require('./User');
    var user = new use();

    var contracts = require('./Contract');
    var contract = new contracts();
    
    var path = require('path');

    var express = require('express');

    //管理员
    var admin = require('./Admin');

    var name;
    var date;

    //公有函数
    this.parseRequest = function () {
        if (app) {
            //post请求
            app.post('/', urlEncodedParser, function (req, res) {
                switch (req.body.action) {
                    //登录
                    case 'login':
                        login(req, res);
                        break;
                    //注册
                    case 'register':
                        register(req, res);
                        break;
                    //获取所有合同
                    case 'all_contracts':
                        getAllContracts(req, res);
                        break;
                    //删除合同
                    case 'delete':
                        del(req, res);
                        break;
                    //修改合同
                    case 'update_row':
                        updateRow(req, res);
                        break;
                    //修改密码
                    case 'update_password':
                        updatePassword(req, res);
                        break;
                    //登出
                    case 'logout':
                        logout(req, res);
                        break;
                    // //激活管理员功能
                    // case 'admin_activate':
                    //     admin.activate(req, res);
                    //     break;
                    //获取所有用户
                    case 'all_users':
                        user.all(function (err, rows) {
                            if (err) {
                                res.send('<script type="text/javascript">' +
                                    'alert("不明错误");' +
                                    'location.href=""' +
                                    '</script>');
                                return;
                            }

                            res.send(rows);
                        });
                        break;
                    
                    default:
                        break;
                }
            });
            
            //获取所有用户
            app.post('/getAllUsers', urlEncodedParser, function (req, res) {
                user.all(function (err, rows) {
                    res.send(rows);
                })
            });

            //文件上传
            app.post('/upload', urlEncodedParser, function (req, res) {
                uploadContract(req, res);
            });

            //get请求
            app.get('/', urlEncodedParser, function (req, res) {
                switch (req.query.action) {
                    case 'logout':
                        logout(req, res);
                        break;

                    default:
                        if (req.session.userId && req.session.userId !== undefined) {
                            res.redirect('/view/main.html');
                        }
                        else {
                            res.redirect('/view/index.html');
                        }
                        break;
                }
            });

            //请求主页
            app.get('/view/main.html', urlEncodedParser, function (req, res) {
                if (req.session.userId && req.session.userId !== undefined) {
                    //第一步, 选择用户
                    admin.admin_func(0);
                    //生成页面
                    renderMain(req, res);
                }
                else {
                    res.send('<script type="text/javascript">' +
                        'alert("请先登录");' +
                        'location.href="/"' +
                        '</script>')
                }
            });

            //修改密码
            app.get('/view/change_password.html', urlEncodedParser, function (req, res) {
                if (req.session.userId && req.session.userId !== undefined) {
                    res.render('change_password', {
                        input_name: ''
                    })
                }

                res.render('change_password', {
                    input_name: '<input type="text" name="name" placeholder="用户名">'
                })
            });
        }
    };

    //私有函数
    function login(req, res) {
        //输入框没有填写完全
        if (req.body.name == "" || req.body.password == "") {
            res.send('<script type="text/javascript">' +
                'alert("请完成输入");' +
                'location.href="' + req.headers.referer + '"' +
                '</script>');
            return;
        }

        //寻找用户
        user.search(req.body.name, function (error, rows) {
            if (error) {
                res.send('<script type="text/javascript">' +
                    'alert("未知错误");' +
                    'location.href="' + req.headers.referer + '"' +
                    '</script>');
                return;
            }
            if (rows.length == 0) {
                res.send('<script type="text/javascript">' +
                    'alert("用户不存在");' +
                    'location.href="' + req.headers.referer + '"' +
                    '</script>');
                return;
            }
            if (rows[0]['password'] !== req.body.password) {
                res.send('<script type="text/javascript">' +
                    'alert("密码错误");' +
                    'location.href="' + req.headers.referer + '"' +
                    '</script>');
                return;
            }

            //session id 赋值
            req.session.userId = rows[0]['id'];
            name = rows[0]['name'];
            date = rows[0]['date'];

            //判断是否管理员
            if (rows[0]['isadmin'] == 1) {
                //设置管理员信息
                req.session.isAdmin = 1;
                admin.admin_func();
            }
            else {
                req.session.isAdmin = 0;
            }

            //若登录失败
            if (req.session.userId == undefined || !req.session.userId) {
                res.send('<script type="text/javascript">' +
                    'alert("登录失败");' +
                    'location.href="' + req.headers.referer + '"' +
                    '</script>');
                return;
            }

            //登录成功
            res.redirect("/view/main.html");
        });
    }
    
    function register(req, res) {
        if (req.body.password == "" || req.body.password_confirm == "" || req.body.name == "") {
            res.send('<script type="text/javascript">' +
                'alert("请完成输入");' +
                'location.href="' + req.headers.referer + '"' +
                '</script>');
            return;
        }

        if (req.body.password != req.body.password_confirm) {
            res.send('<script type="text/javascript">' +
                'alert("两次密码输入不同");' +
                'location.href="' + req.headers.referer + '"' +
                '</script>');
            return;
        }

        user.add(req.body.name, req.body.password, function (error) {
            if (error) {
                res.send('<script type="text/javascript">' +
                    'alert("注册失败!请重试");' +
                    'location.href="' + req.headers.referer + '"' +
                    '</script>');
                return;
            }

            res.send('<script type="text/javascript">' +
                'alert("注册成功");' +
                'location.href="/"' +
                '</script>');
        });
    }
    
    function getAllContracts(req, res) {
        if (req.session.admin_activatied == 1) {
            contract.adminGetAll(function (err, rows) {
                if (err) {
                    res.send('0');
                    return;
                }

                res.send(rows);
            })
        }
        else {
            contract.getAll(req.session.userId, function (error, rows) {
                if (error) {
                    res.send('0');
                    return;
                }

                res.send(rows);
            })
        }
    }
    
    function uploadContract(req, res) {
        contract.add(req, res);
    }
    
    function del(req, res) {
        contract.delete(req.body.contract_id, function (error) {
            if (error) {
                console.log(error);
                res.send('删除失败');
                return;
            }

            res.send('删除成功');
        })
    }

    function updateRow(req, res) {
        contract.updateFileName(req.body.id, req.body.inner, function (error) {
            if (error) {
                res.send('更新失败');
                return;
            }

            res.send('更新成功');
        });
    }

    function updatePassword(req, res) {
        if (req.body.new_password != req.body.new_password_confirm) {
            res.send('<script type="text/javascript">' +
                'alert("两次密码输入不符");' +
                'location.href="' + req.headers.referer + '"' +
                '</script>');

            return;
        }

        var userId = req.session.userId;

        if (!userId || userId == undefined) {
            user.search(req.body.name, function (error, rows) {
                if (error) {
                    res.send('<script type="text/javascript">' +
                        'alert("用户不存在");' +
                        'location.href="' + req.headers.referer + '"' +
                        '</script>');

                    return;
                }

                userId = rows[0].id;
                userUpdate(userId);
            })
        }
        else {
            userUpdate(userId);
        }

        function userUpdate(userId) {
            user.update(userId, req.body.old_password, ['password'], [req.body.new_password], function (error) {
                if (error) {
                    res.send('<script type="text/javascript">' +
                        'alert("更新失败");' +
                        'location.href="' + req.headers.referer + '"' +
                        '</script>');

                    return;
                }

                res.send('<script type="text/javascript">' +
                    'alert("更新成功");' +
                    'location.href="/"' +
                    '</script>');

                //登出
                user.logout(req);
            })
        }
    }
    
    function renderMain(req, res) {
        console.log(admin.admin_module);
        res.render('main', {
            user_name: name,
            admin_flag: admin.admin_flag,
            is_admin: req.session.isAdmin,
            user_id: req.session.userId,
            date: date,
            admin_module: admin.admin_module,
            table_mode: (req.session.isAdmin == 0) ? 0 : 1
        })
    }

    function logout(req, res) {
        user.logout(req);
        admin.reset();

        res.send('1');
    }
}

module.exports = RequestParser;