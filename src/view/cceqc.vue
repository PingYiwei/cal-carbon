<script setup>
import MaterialCard from '../components/MaterialCard.vue'
import SideMenu from "../components/SideMenu.vue";
import ConstructionTable from "../components/ConstructionTable.vue";
import OtherEnergyConsumption from "../components/OtherEnergyConsumption.vue";
import ResultCard from "../components/ResultCard.vue";
import axios from 'axios'

import {
    Plus,
    Minus,
    CaretRight,
    Refresh, PieChart
} from '@element-plus/icons-vue'
import {onMounted, ref, reactive} from "vue";
import {useDataStore} from "../store/materialStore.ts";
import {storeToRefs} from "pinia";
import ResultCharts from "../components/ResultCharts.vue";

// pinia仓库导入
const dataStore = useDataStore()
const {materialSum} = storeToRefs(dataStore)

// 定义响应数据
let primaryCategory = ref([])
let materialData = reactive({
    data: {}
})

// 从表格\其余资源组件中获取计算方法
const exposeCalMachineResults = ref()
const exposeCalResourcesResults = ref()

// 挂载完成时获取数据
onMounted(() => {
    // 从数据库获取一级分类
    axios.post('http://localhost:3000/api/carbondata/primary',
        {},
        {}
    )
        .then((res) => {
            primaryCategory.value = res.data.msg
        })

    // 从数据库获取具体材料列
    axios.post('http://localhost:3000/api/carbondata/material',
        {},
        {},
    )
        .then((res) => {

            const res_materialList = res.data.msg
            let materialGroups = {}
            res_materialList.forEach(m => {
                materialGroups[String(m.m_primary_category)] = materialGroups[String(m.m_primary_category)] || []
                materialGroups[String(m.m_primary_category)].push(m)
            })
            materialData.data = materialGroups
        })
})

// 交通工具数据
const transType = [
    "轻型汽油货车(载重2t)",
    "中型汽油货车(载重8t)",
    "重型汽油货车(载重10t)",
    "重型汽油货车(载重18t)",
    "轻型柴油货车(载重2t)",
    "中型柴油货车(载重8t)",
    "重型柴油货车(载重10t)",
    "重型柴油货车(载重18t)",
    "重型柴油货车(载重30t)",
    "重型柴油货车(载重46t)",
]

const transCarbonEmission = [
    0.334,
    0.115,
    0.104,
    0.104,
    0.286,
    0.179,
    0.162,
    0.129,
    0.078,
    0.057,
]

// Material的各类参数
// Props
let materialPropsGroup = ref([
    {
        mid: 1,
        materialFactor: 0,
        materialFactorUnit: '',
        materialDensity: 0,
        materialName: ''
    },
])

// Transportation
let materialTransTypeGroup = ref([''])

// Eng quantity
let engQuantityGroup = ref([0])

// trans Distance
let transDistanceGroup = ref([0])

// 材料数量
const materialNum = ref([1])

// 添加材料
function onAddMaterial() {
    materialNum.value.push(materialNum.value.length + 1)
    // 每新增一个材料需要添加绑定数据的个数
    materialPropsGroup.value.push({
        mid: materialNum.value.length,
        materialFactor: 0,
        materialFactorUnit: '',
        materialDensity: 0,
        materialName: ''
    })
    materialTransTypeGroup.value.push('')
    engQuantityGroup.value.push(0)
    transDistanceGroup.value.push(0)
}

// 删除材料
function onDelMaterial() {
    if (materialNum.value.length === 1) {
        return
    }
    materialNum.value.pop()
    materialPropsGroup.value.pop()
    materialTransTypeGroup.value.pop()
    engQuantityGroup.value.pop()
    transDistanceGroup.value.pop()
}

// 计算
let resultsMaterialGroup = ref([])

function calMaterialResults() {
    console.log(materialPropsGroup.value)
    if (materialPropsGroup.value.length === 1 && materialPropsGroup.value[0].materialFactor === 0) {
        return
    }
    // 生成交通类型的碳排放因子列表
    let materialTransCarbonEmission = []
    for (let t = 0; t < materialTransTypeGroup.value.length; t++) {
        materialTransCarbonEmission.push(transCarbonEmission[transType.findIndex(item => item === materialTransTypeGroup.value[t])])
    }
    // 清空原有的数据
    resultsMaterialGroup.value = []
    // 定义临时取值
    let tempMaterialGroup = []
    let tempMaterialSum = 0
    // 计算材料部分
    for (let i = 0; i < materialPropsGroup.value.length; i++) {
        let tempMaterial = 0
        tempMaterial += materialPropsGroup.value[i].materialFactor * engQuantityGroup.value[i]
        if (materialPropsGroup.value[i].materialFactorUnit.slice(6) !== 't') {
            tempMaterial += engQuantityGroup.value[i] * materialPropsGroup.value[i].materialDensity *
                transDistanceGroup.value[i] * materialTransCarbonEmission[i]
        } else {
            tempMaterial += engQuantityGroup.value[i] *
                transDistanceGroup.value[i] * transCarbonEmission[i]
        }
        tempMaterialGroup.push({
            materialName: materialPropsGroup.value[i].materialName,
            materialCarbonEmission: (tempMaterial / 1000).toFixed(2),
        })
        tempMaterialSum += tempMaterial / 1000
    }
    resultsMaterialGroup.value = tempMaterialGroup
    // 材料碳排放总值全局存储
    dataStore.materialSum = tempMaterialSum.toFixed(2)
}


// 执行各模块的计算
function conductCalculation() {
    calMaterialResults()
    exposeCalMachineResults.value.calMachineResults()
    exposeCalResourcesResults.value.calResourcesResults()
}

// 清空输入
function resetAll() {
    location.reload()
}

// 弹出图表
const dialogCharts = ref(false)

</script>

<template>
    <div class="flex w-full">
        <SideMenu></SideMenu>
        <div class="flex-none ml-2 mt-4">
            <div class="text-2xl font-bold mb-2 mx-2 max-w-md">物料列表</div>
            <div class="m-2 max-w-md">
                <el-button-group class="">
                    <el-button type="primary" @click="onAddMaterial">
                        <el-icon class="mr-2">
                            <Plus/>
                        </el-icon>
                        添加
                    </el-button>
                    <el-button type="danger" @click="onDelMaterial">
                        删除
                        <el-icon class="ml-2">
                            <Minus/>
                        </el-icon>
                    </el-button>
                </el-button-group>
            </div>
            <el-scrollbar max-height="800px" always>
                <MaterialCard v-for="m in materialNum"
                              :primary-category="primaryCategory"
                              :material-data="materialData.data"
                              :transportation-type="transType"
                              v-model:material-props="materialPropsGroup[m-1]"
                              v-model:material-trans-type="materialTransTypeGroup[m-1]"
                              v-model:eng-quantity="engQuantityGroup[m-1]"
                              v-model:trans-distance="transDistanceGroup[m-1]"
                ></MaterialCard>
            </el-scrollbar>
        </div>
        <div class="flex flex-col flex-grow mt-4 mx-2" id="right-content">
            <div class="text-2xl font-bold mb-2 max-w-md">机械台班列表</div>
            <ConstructionTable ref="exposeCalMachineResults"></ConstructionTable>
            <div class="text-2xl font-bold my-2 max-w-md">施工水电消耗</div>
            <OtherEnergyConsumption ref="exposeCalResourcesResults"></OtherEnergyConsumption>
            <!--                结果展示区-->
            <div class="mt-2">
                <ResultCard :results-material-group="resultsMaterialGroup">
                </ResultCard>
            </div>
            <!--                计算按钮-->
            <div class="flex flex-row mt-4 mb-4 justify-between">
                <el-button type="success" @click="dialogCharts = true">
                    <el-icon class="mr-2">
                        <PieChart/>
                    </el-icon>
                    结果图形
                </el-button>
                <div>
                    <el-button type="primary" @click="conductCalculation">
                        <el-icon class="mr-2">
                            <CaretRight/>
                        </el-icon>
                        计算
                    </el-button>
                    <el-button type="danger" @click="resetAll">
                        <el-icon class="mr-2">
                            <Refresh/>
                        </el-icon>
                        重置
                    </el-button>
                </div>
            </div>
        </div>
    </div>
    <el-dialog v-model="dialogCharts" title="碳排放计算结果" style="width: 1100px;height:500px;">
        <ResultCharts :results-material-group="resultsMaterialGroup"></ResultCharts>
    </el-dialog>
</template>

<style scoped>
.el-button-group {
    display: flex;
}

.el-scrollbar {
    height: auto;
}

</style>
