<script setup>
import { ref } from 'vue'
import {Minus, Plus} from "@element-plus/icons-vue";
import {useDataStore} from "../store/materialStore.ts";
import {storeToRefs} from "pinia";


// 导入pinia
const dataStore = useDataStore()
const {machineSum, machineGroup} = storeToRefs(dataStore)

// 暴露calMachineResults方法
defineExpose({
    calMachineResults,
})

// 表格绑定数据
const tableData = ref([
    {
        machineType: '',
        energyType: '',
        consumption: 0,
        shiftNumber: 0,
    },
])

// 能源选择
const energyOptions = [
    {
        label: '汽油',
        value: 3.12,
    },
    {
        label: '柴油',
        value: 3.09,
    },
    {
        label: '电',
        value: 0.7035,
    },
]

// 添加数据
const onAddItem = () => {
    tableData.value.push({
        machineType: '',
        energyType: '',
        consumption: 0,
        shiftNumber: 0,
    },)
}

// 删除最后的数据
const onDelItem = () => {
    tableData.value.pop()
}

// 计算结果
const resultsMachineGroup = ref([])

function calMachineResults() {
    if (tableData.value.length === 1 && tableData.value[0].machineType === "") {
        return
    }
    // 清空数据
    resultsMachineGroup.value = []
    // 临时参数
    let tempSum = 0
    let tempMachineGroup = []

    for (let m = 0; m < tableData.value.length; m++) {
        // 获取能源碳排放子因子
        const tempEnergyFactor = energyOptions.find(item => item.label === tableData.value[m].energyType).value
        let tempMachine = tempEnergyFactor * tableData.value[m].shiftNumber * tableData.value[m].consumption
        tempMachineGroup.push({
            machineName: tableData.value[m].machineType,
            machineCarbonEmission: (tempMachine/1000).toFixed(2),
        })
        tempSum += tempMachine/1000
    }

    // 向pinia赋值
    dataStore.machineSum = tempSum.toFixed(2)
    dataStore.machineGroup = tempMachineGroup

}

</script>

<template>
    <el-button-group class="mb-2">
        <el-button type="primary" @click="onAddItem">
            <el-icon class="mr-2"><Plus /></el-icon>添加
        </el-button>
        <el-button type="danger" @click="onDelItem">
            删除<el-icon class="ml-2"><Minus /></el-icon>
        </el-button>
    </el-button-group>
    <el-table :data="tableData" height="250" class="rounded-md shadow-md mt-2 h-350px">
<!--        机械类型-->
        <el-table-column fixed label="机械类型">
            <template #default="scope">
                <el-input v-model="tableData[scope.$index].machineType" placeholder="输入机械名称" size="small" clearable />
            </template>
        </el-table-column>
<!--        选择能源类型-->
        <el-table-column label="能源类型">
            <template #default="scope">
                <el-select v-model="tableData[scope.$index].energyType" class="" placeholder="选择能源" size="small">
                    <el-option
                        v-for="item in energyOptions"
                        :key="item.value"
                        :value="item.label"
                    />
                </el-select>
            </template>
        </el-table-column>
<!--        每台班的能源消耗-->
        <el-table-column>
            <template #header>
                每台班能源消耗 <span class="text-xs text-blue-400 font-bold">kg</span>
            </template>
            <template #default="scope">
                <el-input v-model="tableData[scope.$index].consumption" placeholder="Please input" size="small" clearable />
            </template>
        </el-table-column>
<!--        台班数量-->
        <el-table-column label="台班数量">
            <template #default="scope">
                <el-input v-model="tableData[scope.$index].shiftNumber" placeholder="Please input" size="small" clearable />
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped>

</style>