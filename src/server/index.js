// node 后端
// index.js 入口文件

import express from 'express'
import bodyParser from "body-parser";
import {router as dataRoutes} from './api/carbonData.js'

const app = express()

//采用设置所有均可访问的方法解决跨域问题
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() === 'options')
        res.send(200); //让options尝试请求快速结束
    else
        next();
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 后端路由
app.use('/api/carbondata', dataRoutes)

// 监听端口
app.listen(3000)
console.log('Successfully listen at port:3000...')