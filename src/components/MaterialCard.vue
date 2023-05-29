<script setup>
import {computed, reactive, ref, watch, watchEffect} from 'vue'


// 接收材料数据
const props = defineProps({
    // 固定数据
    primaryCategory: Array,
    materialData: Object,
    transportationType: Array,
    // 绑定的数据参数
    materialProps: Object,
    materialTransType: String,
    engQuantity: Number,
    transDistance: Number,
})


// 材料选择数据
const materialSelected = ref('')
// 计算数据
const materialList = computed(()=>{
    let tempList = []
    for (let c in props.materialData) {
        for (let i=0;i < props.materialData[c].length;i++) {

            tempList.push(props.materialData[c][i])
        }
    }
    return tempList
})

// 选择材料后查找对应的属性并保留
let materialProps = reactive({
    data: {
        mid: props.materialProps.mid,
        materialFactor: 0,
        materialFactorUnit: '',
        materialDensity: 0,
        materialName: '',
    }
})
// 材料选择后赋值
function onChangeMaterial(e) {
    const material = materialList.value.find(item => item.m_name === e)
    materialProps.data.materialFactor = material.m_factor
    materialProps.data.materialFactorUnit = material.m_factor_unit
    materialProps.data.materialDensity = material.m_mass
    materialProps.data.materialName = material.m_name
}
// 交通工具选择数据
const transType = ref('')

// 输入的工程量和距离
const engQuantity = ref()
const transDistance = ref()

// 监测参数的变化，发生变化则向父组件进行提交
const emit = defineEmits(["update:materialProps", "update:materialTransType", "update:engQuantity", "update:transDistance"])

const commitChangedValue = () => {
    emit("update:materialProps", materialProps.data)
    emit("update:materialTransType", transType.value)
    emit("update:engQuantity", Number(engQuantity.value))
    emit("update:transDistance", Number(transDistance.value))
}

watchEffect(() => {
    commitChangedValue()
})

</script>

<template>
    <div class="rounded-md shadow-md m-2">
        <div class="p-2 grid grid-cols-2 gap-y-0.5 gap-x-2">
            <div class="">
                <div class=" mb-2">
                    物料类型 <span class="text-xs text-blue-400 font-bold">{{materialProps.data.materialFactorUnit}}</span>
                </div>
                <el-select v-model="materialSelected" placeholder="选择物料" @change="onChangeMaterial">
                    <el-option-group
                            v-for="category in props.primaryCategory"
                            :key="category.id"
                            :label="category.name"
                    >
                        <el-option
                                v-for="item in materialData[category.id]"
                                :key="item.id"
                                :label="item.m_name"
                                :value="item.m_name"
                        />
                    </el-option-group>
                </el-select>
            </div>
            <div class="">
                <div class="mb-2">
                    运输工具类型
                </div>
                <el-select v-model="transType" placeholder="选择运输工具">
                        <el-option
                                v-for="item in transportationType"
                                :key="item"
                                :label="item"
                                :value="item"
                        />
                </el-select>
            </div>
            <div class="">
                <div class="my-2">
                    工程量 <span class="text-xs text-blue-400 font-bold">{{materialProps.data.materialFactorUnit.slice(6)}}</span>
                </div>
                <el-input v-model="engQuantity" placeholder="请输入工程量" clearable/>
            </div>
            <div class="">
                <div class="my-2">
                    运输距离  <span class="text-xs text-blue-400 font-bold">km</span>
                </div>
                <el-input v-model="transDistance" placeholder="请输入运输距离" clearable/>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
