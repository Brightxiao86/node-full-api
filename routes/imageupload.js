var express = require('express');
var router = express.Router();
var multiparty = require('multiparty')
var path = require('path')
var fs = require('fs')


router.post('/img', function(req, res, next) {
    // 创建一个实例
    var form = new multiparty.Form()
    // form.parse方法的作用：把req中的图片数据转存到服务器临时存储路径中去
    form.parse(req, function(err, fields, files) {
        if(err) {
            res.json({err:1,msg:'图片上传失败'})
        } else {
            // 图片成功
            console.log('files', files)
            const file = files.file[0]
            // 使用fs模块把临时路径中的图片数据，写入到服务器硬盘中
            let readStream = fs.createReadStream(file.path)

            let now = Date.now()
              //创建地址  把图片存储静态资源的地址也就是public 
            let p = path.join(__dirname, '../public/imgs/'+now+'-'+file.originalFilename)
           
            let writeStream = fs.createWriteStream(p)
            //管道流 把读取文件的管道流和写入文件的管道流 接通 让图片可以传递过来。
            readStream.pipe(writeStream)
              //监听
            writeStream.on('close', function() {
                let data = {
                    url: `/imgs/${now}-${file.originalFilename}`
                }
                res.json({err:0,msg:'图片上传成功', data})
            })
        }
    });
  
});

module.exports = router;
