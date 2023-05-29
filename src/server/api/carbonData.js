// 导入模块
import express from "express";
import mysql from 'mysql'

// 导入数据库基本信息和sql指令行
import {mysql as models} from "../databse.js";
import {sqlMap as sql} from "../sqlMap.js";

const router = express.Router()

// 获取碳排放因子一级分类信息
router.post('/primary', (req, res) => {
    // 连接数据库
    const connection = mysql.createConnection(models)
    connection.connect()
    // 获取请求体内容
    const params = req.body
    // 请求数据库
    connection.query(sql.carbon_data.primary_category, [], (err, result) => {
        // 存在错误就抛出
        if (err) throw err;
        if (result.length > 0) {
            console.log('Success...')
            res.json({
                code: 1,
                msg: result
            })
        } else {
            res.json({
                code: 0,
                msg: result
            })
            console.log('Failed...')
        }

    })
    connection.end()
})

// 获取具体材料信息
router.post('/material', (req,res) => {
    // 连接数据库
    const connection = mysql.createConnection(models)
    connection.connect()
    // 获取请求体内容
    const params = req.body
    // 请求数据库
    connection.query(sql.carbon_data.material_list, [], (err, result) => {
        // 存在错误就抛出
        if (err) throw err;
        if (result.length > 0) {
            console.log('Success...')
            res.json({
                code: 1,
                msg: result
            })
        } else {
            res.json({
                code: 0,
                msg: result
            })
            console.log('Failed...')
        }

    })
    connection.end()
})


export {router}

