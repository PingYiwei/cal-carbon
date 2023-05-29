<script setup>
import {CaretRight, Minus, Plus} from "@element-plus/icons-vue";

import moment from 'moment';
import {computed, reactive, ref} from "vue";

const randomDate = () => {
    // 随机生成0-11的数字
    const randomMonthNum = Math.floor(Math.random() * 11);
    // 随机生成1-30数字
    const randomDateNum = Math.ceil(Math.random() * 30);
    // 随机生成1-24 数字
    const randomHourNum = Math.ceil(Math.random() * 24);
    // 随机生成1-60 数字
    const randomMinuteNum = Math.ceil(Math.random() * 60);
    return moment()
        .month(4)
        .date(randomDateNum)
        .hour(randomHourNum)
        .minutes(randomMinuteNum)
        .seconds(randomMinuteNum)
        .format('YYYY-MM-DD HH:mm:ss');
}

const tableData = [
    {
        date: '2023-04-28',
        name: '华东公司',
        childName: '公司本部',
        loginTime: randomDate(),
        tag: '一级账号',
        type: '',
    },
    {
        date: '2023-04-28',
        name: '华东公司',
        childName: '一项目部',
        loginTime: randomDate(),
        tag: '二级账号',
        type: '',
    },
    {
        date: '2023-05-01',
        name: '华东公司',
        childName: '二项目部',
        loginTime: randomDate(),
        tag: '二级账号',
        type: '',
    },
    {
        date: '2023-04-29',
        name: '华东公司',
        childName: '三项目部',
        loginTime: randomDate(),
        tag: '二级账号',
        type: '',
    },
    {
        date: '2023-05-02',
        name: '华南公司',
        childName: '公司本部',
        loginTime: randomDate(),
        tag: '一级账号',
        type: 'success',
    },
    {
        date: '2023-05-04',
        name: '华南公司',
        childName: '一项目部',
        loginTime: randomDate(),
        tag: '二级账号',
        type: 'success',
    },
    {
        date: '2023-05-03',
        name: '华南公司',
        childName: '二项目部',
        loginTime: randomDate(),
        tag: '二级账号',
        type: 'success',
    },
    {
        date: '2023-05-03',
        name: '华南公司',
        childName: '三项目部',
        loginTime: randomDate(),
        tag: '二级账号',
        type: 'success',
    },
    {
        date: '2023-05-02',
        name: '华北公司',
        childName: '公司本部',
        loginTime: randomDate(),
        tag: '一级账号',
        type: 'warning',
    },
    {
        date: '2023-05-04',
        name: '华北公司',
        childName: '一项目部',
        loginTime: randomDate(),
        tag: '二级账号',
        type: 'warning',
    },
    {
        date: '2023-05-03',
        name: '华北公司',
        childName: '二项目部',
        loginTime: randomDate(),
        tag: '二级账号',
        type: 'warning',
    },
    {
        date: '2023-05-03',
        name: '华北公司',
        childName: '三项目部',
        loginTime: randomDate(),
        tag: '二级账号',
        type: 'warning',
    },

]
const filterTag = (value, row) => {
    return row.tag === value
}
const filterName = (value, row) => {
    return row.name === value
}

const tagType = (row) => {

}

const dialogAddWindow = ref(false)
const form = reactive({
    date: '',
    name: '',
    user: '',
    password: '',
    type: '',
})
const dialogEditWindow = ref(false)
const editForm = reactive({
    date: '',
    name: '华东公司',
    user: 'hdgs01',
    password: '88908890',
    type: '一级账号',
})
const dialogLookWindow = ref(false)

function timestampToTime(times) {
    let time = times[1]
    let mdy = times[0]
    mdy = mdy.split('/')
    let month = parseInt(mdy[0]);
    let day = parseInt(mdy[1]);
    let year = parseInt(mdy[2])
    return year + '-' + month + '-' + day
}
let time = new Date()
let nowTime = timestampToTime(time.toLocaleString('en-US',{hour12: false}).split(" "))

function addAgent() {
    form.date = nowTime
    dialogAddWindow.value = true
}

function editAgent(index, row) {
    editForm.date = row.date
    dialogEditWindow.value = true
}

function lookAgent(index, row) {
    editForm.date = row.date
    dialogLookWindow.value = true
}



const search = ref('')
const filterTableData = computed(() =>
    tableData.filter(
        (data) =>
            !search.value ||
            data.childName.includes(search.value)
    )
)
const handleEdit = (index, row) => {
    console.log(index, row)
}

const dialogDeleteConfirm = ref(false)
</script>

<template>
    <div class="px-3 py-2">
        <div class="text-2xl font-bold mb-4">建造阶段碳排放速算系统用户管理</div>
        <div class="mb-4">
            <el-button type="primary" @click="addAgent">
                <el-icon class="mr-2">
                    <Plus/>
                </el-icon>
                添加用户
            </el-button>
            <el-button type="danger" @click="dialogDeleteConfirm=true">
                <el-icon class="mr-2">
                    <Minus/>
                </el-icon>
                删除用户
            </el-button>
        </div>
        <el-dialog
            v-model="dialogDeleteConfirm"
            title="提醒"
            width="30%"
        >
            <span>是否确认删除用户</span>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogDeleteConfirm = false">取消</el-button>
        <el-button type="danger" @click="dialogDeleteConfirm = false">
          确认
        </el-button>
      </span>
            </template>
        </el-dialog>
        <el-table
                ref="multipleTableRef"
                :data="filterTableData"
                style="width: 100%"
                class="rounded-md shadow-md"
                :default-sort="{ prop: 'loginTime', order: 'descending' }"
                max-height="500"
        >
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="date" label="注册日期" width="180" sortable/>

            <el-table-column
                prop="name"
                label="所属公司"
                width="180"
                :filters="[{ text: '华东公司', value: '华东公司' },{ text: '华南公司', value: '华南公司' },
                { text: '华北公司', value: '华北公司' },]"
                :filter-method="filterName"
                filter-placement="bottom-end"

            >
                <template #default="scope">
                    <el-tag
                        :type="scope.row.type"
                        disable-transitions
                    >{{ scope.row.name }}
                    </el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column prop="childName" label="部门名称"/>
            <el-table-column prop="loginTime" label="最近登录" sortable/>
            <el-table-column
                    prop="tag"
                    label="账号类型"
                    width="180"
                    :filters="[{ text: '一级账号', value: '一级账号' },{ text: '二级账号', value: '二级账号' },]"
                    :filter-method="filterTag"
                    filter-placement="bottom-end"

            >
                <template #default="scope">
                    <el-tag
                            :type="scope.row.tag === '一级账号'? '' : 'success'"
                            disable-transitions
                    >{{ scope.row.tag }}
                    </el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="scope">
                    <el-button size="small" @click="lookAgent(scope.$index, scope.row)" type="primary">查看信息</el-button>
                    <el-button size="small" @click="editAgent(scope.$index, scope.row)" type="success">修改信息</el-button>
                </template>

            </el-table-column>
        </el-table>
<!--        添加弹窗-->
        <el-dialog v-model="dialogAddWindow" title="添加用户">
            <el-form :model="form">
                <el-form-item label="注册日期">
                    <el-input v-model="form.date" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="用户账号">
                    <el-input v-model="form.user" autocomplete="off" style="width: 18rem" />
                </el-form-item>
                <el-form-item label="用户密码">
                    <el-input v-model="form.password" autocomplete="off" style="width: 18rem" show-password/>
                </el-form-item>
                <el-form-item label="账号类型">
                    <el-select v-model="form.type" placeholder="选择账号类型">
                        <el-option label="一级账号" value="一级账号" />
                        <el-option label="二级账号" value="二级账号" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogAddWindow = false">取消</el-button>
                <el-button type="primary" @click="dialogAddWindow = false">
                  确认
                </el-button>
              </span>
            </template>
        </el-dialog>
<!--        修改弹窗-->
        <el-dialog v-model="dialogEditWindow" title="修改用户信息">
            <el-form :model="editForm">
                <el-form-item label="注册日期">
                    <el-input v-model="editForm.date" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="editForm.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="用户账号">
                    <el-input v-model="editForm.user" autocomplete="off" style="width: 18rem" />
                </el-form-item>
                <el-form-item label="用户密码">
                    <el-input v-model="editForm.password" autocomplete="off" style="width: 18rem" show-password/>
                </el-form-item>
                <el-form-item label="账号类型">
                    <el-select v-model="editForm.type" placeholder="选择账号类型">
                        <el-option label="一级账号" value="一级账号" />
                        <el-option label="二级账号" value="二级账号" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogEditWindow = false">取消</el-button>
                <el-button type="primary" @click="dialogEditWindow = false">
                  确认
                </el-button>
              </span>
            </template>
        </el-dialog>
        <!--        查看弹窗-->
        <el-dialog v-model="dialogLookWindow" title="查看用户信息">
            <el-form :model="editForm">
                <el-form-item label="注册日期">
                    <el-input v-model="editForm.date" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="editForm.name" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="用户账号">
                    <el-input v-model="editForm.user" autocomplete="off" style="width: 18rem" disabled/>
                </el-form-item>
                <el-form-item label="用户密码">
                    <el-input v-model="editForm.password" autocomplete="off" style="width: 18rem" disabled/>
                </el-form-item>
                <el-form-item label="账号类型">
                    <el-select v-model="editForm.type" placeholder="选择账号类型"  disabled>
                        <el-option label="一级账号" value="一级账号" />
                        <el-option label="二级账号" value="二级账号" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogLookWindow = false">取消</el-button>
                <el-button type="primary" @click="dialogLookWindow = false">
                  确认
                </el-button>
              </span>
            </template>
        </el-dialog>
    </div>

</template>

<style scoped>

</style>