var express = require('express');
var router = express.Router();

//引入userModel文件
var userModel = require('../model/userModel');
var jwt = require('../utils/jwt')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//管理系统
router.post('/cms/regist' , function (req , res ,next ){
    let {username,password ,password2} = req.body
      
    userModel.find({username}).then(arr=>{
      if(arr.length > 0) {
        res.json({err: 1, msg: '当前用户名已注册，请重新输入'})
      } else {
        // 当前用户名没有问题，直接入库
        let user = {
          username,
          password, 
          create_time: Date.now()
        }
            userModel.insertMany([user]).then(()=>{
              res.json({err:0, msg:'注册成功'})

            })
          }
    })
})


//登入接口
router.post('/cms/login' , function (req ,res) {
   let{ username , password} = req.body
   //登入成功 返回token给前端
  userModel.find({username , password}).then((arr)=>{
     if(arr.length ===1 ){
       let data = {
         err: 0,
         msg:'登陆成功',
         data: {
            token: jwt.createToken({username , password}),
            username
         }
       }
       res.json(data)
     }
  })
})


//查看数据库
router.get('/all' , function(req , res , next ) {
  userModel.find({}).then(arr=>{
    let data={
      err:0,
      msg:'success',
      data:{
        list:arr
      }
    }
    res.json(data)
  })
})

module.exports = router;
