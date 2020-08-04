var express = require('express');
var router = express.Router();
var GoodNewly = require('../model/cms/GoodNewly');
const { log } = require('debug');
//增加
router.post('/new', function(req, res, next) {
    let { id , name , desc , price, cate ,img, hot , rank} =req.body
    if(!name) return res.json({err:1,msg:'name是必须字段'})

    let ele= { 
        name ,
        desc,
        price,
        cate,
        img,
        hot: hot ? hot : false,
        rank:rank ? rank :0,
  }  
    if (id){
        GoodNewly.updateOne({_id : id } , {$set:ele}).then(()=>{
           res.json({err: 0 , msg :'修改成功'})
        })
    }else{
      ele.create_time =Date.now()
      GoodNewly.insertMany([ele]).then(()=>{
           res.json({err: 0 , msg :'添加成功'})
      })
    }
  
})
 
//获取所有商品

router.get('/list' , function(req , res ){
    let { page , size , cate} =req.query
     //取整判断如果 给了page的值那么page就等于page 否则page就等于1
    page = parseInt(page ? page : 1)
    size = parseInt(size ? size : 3)
    let xmm = {
        cate: cate ? cate : ''
    }
    if(!xmm.cate) delete xmm.cate

    GoodNewly.find(xmm).then(arr=>{
       //把查询到的数组赋值给total
       let total = arr.length    
       //查找cate里面           跳转的页数         限制条数     商品排序 
       GoodNewly.find(xmm).skip((page-1)*size).limit(size).sort({rank:1}).then(arr=>{
        res.json({err:0,msg:'success', data: {list:arr, total}})
    })
   })  
})

//获取商品详情
router .get ('/amend' , function (req ,res) {
    let { id } = req.query
    GoodNewly.find({_id : id }).then(arr=>{
        res.json({err : 0 , msg:'success' , data: arr[0]})
    })
})

module.exports = router;
