<script setup>
import {ref} from "vue";
import {useDataStore} from "../store/materialStore.ts";
import {storeToRefs} from "pinia";

// 导入pinia
const dataStore = useDataStore()
const { electricityCarbonEmission, waterCarbonEmission } = storeToRefs(dataStore)

// 电力区域选项
const electricityOptions = [
    {
        label: '华北电网',
        value: 0.8843,
    },
    {
        label: '东北电网',
        value: 0.7769,
    },
    {
        label: '华东电网',
        value: 0.7035,
    },
    {
        label: '华中电网',
        value: 0.5257,
    },
    {
        label: '西北电网',
        value: 0.6671,
    },
    {
        label: '南方电网',
        value: 0.5271,
    },
]

// 选择区域
const electricityArea = ref('')
// 区域电网碳排放因子
const electricityFactor = ref(0)

// 改变选择时更新碳排放子因子
function onChangeSelected(e) {
    const tempOption = electricityOptions.find(item => item.label === e)
    electricityFactor.value = tempOption.value
}

// 计算资源消耗的碳排放
const electricityConsumption = ref(0)
const waterConsumption = ref(0)

function calResourcesResults() {
    if (electricityConsumption.value === 0 && waterConsumption.value === 0) {
        return
    }
    dataStore.electricityCarbonEmission = (electricityFactor.value * electricityConsumption.value/1000).toFixed(2)
    dataStore.waterCarbonEmission = (waterConsumption.value * 0.168 / 1000).toFixed(2)
}

// 暴露calResourcesResults方法
defineExpose({
    calResourcesResults,
})

</script>

<template>
  <div class="grid grid-cols-2 gap-2">
      <div class="">
          <div class="my-2">
              施工用电 <span class="text-xs text-blue-400 font-bold">kWh</span>
          </div>
          <div class="flex space-x-2">
              <el-select v-model="electricityArea" class="" placeholder="Select" @change="onChangeSelected">
                  <el-option
                      v-for="item in electricityOptions"
                      :key="item.label"
                      :value="item.label"
                  />
              </el-select>
              <el-input v-model="electricityConsumption" placeholder="Please input" clearable/>
          </div>

      </div>
      <div class="">
          <div class="my-2">
              施工用水 <span class="text-xs text-blue-400 font-bold">t</span>
          </div>
          <el-input v-model="waterConsumption" placeholder="Please input" clearable/>
      </div>
  </div>
</template>

<style scoped>

</style>