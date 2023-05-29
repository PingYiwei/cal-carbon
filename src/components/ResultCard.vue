<script setup>

import {useDataStore} from "../store/materialStore.ts";
import {storeToRefs} from "pinia";

const dataStore = useDataStore()
const { materialSum, machineSum, machineGroup, electricityCarbonEmission, waterCarbonEmission } = storeToRefs(dataStore)
// 接收结果数据
const props = defineProps({
    resultsMaterialGroup: Array,
})

</script>

<template>
    <div class="text-2xl mb-2 font-bold">碳排放计算结果</div>
    <div class="grid grid-cols-3 gap-3">
        <div>
            <div class="rounded-md shadow-md mb-1 p-2 bg-gray-200">
                <div><span class="font-bold">物料碳排放：</span>{{ materialSum }} <span
                        class="text-sm text-blue-400 font-bold">t</span></div>
            </div>
            <div>
                <el-table :data="resultsMaterialGroup" height="280" class="rounded-md shadow-md mt-2 h-350px">
                    <el-table-column prop="materialName" label="物料类型">

                    </el-table-column>
                    <el-table-column prop="materialCarbonEmission" label="碳排放/t">

                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div>
            <div class="rounded-md shadow-md mb-1 p-2 bg-gray-200">
                <div><span class="font-bold">机械台班：</span>{{ machineSum }}<span
                        class="text-sm text-blue-400 font-bold"> t</span></div>
            </div>
            <div>
                <el-table :data="machineGroup" height="280" class="rounded-md shadow-md mt-2 h-350px">
                    <el-table-column prop="machineName" label="机械类型">

                    </el-table-column>
                    <el-table-column prop="machineCarbonEmission" label="碳排放/t">

                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="flex flex-col space-y-2">
            <div class="rounded-md shadow-md mb-1 p-2 bg-gray-200 flex-grow text-center flex flex-col justify-center">
                <div class="font-bold text-base text-center mb-2 uppercase">
                    施工用电碳排放量
                </div>
                <div class="text-2xl font-bold">
                    {{ electricityCarbonEmission }} <span class="text-xl text-gray-900 font-bold">t</span>
                </div>
            </div>
            <div class="rounded-md shadow-md mb-1 p-2 bg-gray-200 flex-grow text-center flex flex-col justify-center">
                <div class="font-bold text-base text-center mb-2 uppercase">
                    施工用水碳排放量
                </div>
                <div class="text-2xl font-bold">
                    {{ waterCarbonEmission }} <span class="text-xl text-gray-900 font-bold">t</span>
                </div>
            </div>
            <div class="rounded-md shadow-md mb-1 p-2 bg-gradient-to-r from-blue-500 to-green-400 flex-grow text-center flex flex-col justify-center">
                <div class="font-bold text-lg text-center mb-2 uppercase">
                    总碳排放量
                </div>
                <div class="text-2xl font-bold">
                    {{ dataStore.getTotalValue }} <span class="text-xl text-gray-900 font-bold">t</span>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>

</style>