<script setup>
import {useDataStore} from "../store/materialStore.ts";
import {storeToRefs} from "pinia";
import * as echarts from 'echarts';
import {computed, onMounted, onUpdated} from "vue";

const dataStore = useDataStore()
const { machineGroup } = storeToRefs(dataStore)

// 接收结果数据
const props = defineProps({
    resultsMaterialGroup: Array,
})

const materialName = computed(() => {
    let tempArray = []
    for (let i = 0; i < props.resultsMaterialGroup.length; i++) {
        tempArray.push(props.resultsMaterialGroup[i].materialName)
    }
    return tempArray
})

const materialCarbonEmission = computed(() => {
    let tempArray = []
    for (let i = 0; i < props.resultsMaterialGroup.length; i++) {
        tempArray.push(props.resultsMaterialGroup[i].materialCarbonEmission)
    }
    return tempArray
})


function drawCharts() {
    let chartDom = document.getElementById('chart-1');
    let myChart = echarts.init(chartDom);
    let option;

    option = {
        title: {
            text: "物料碳排放计算",
            subtext: '单位：t',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: materialName.value,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Direct',
                type: 'bar',
                data: materialCarbonEmission.value,
                itemStyle: {
                    normal: {
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function (params) {
                            let colorList = ['#c23531',
                                '#2f4554',
                                '#61a0a8',
                                '#d48265',
                                '#91c7ae',
                                '#749f83',
                                '#ca8622',
                                '#bda29a',
                                '#6e7074',
                                '#546570',
                                '#c4ccd3'];
                            return colorList[params.dataIndex];
                        }
                    },
                }
            }
        ]
    };

    option && myChart.setOption(option);
}

function drawMachineCharts() {
    let chartDom = document.getElementById('chart-2');
    let myChart = echarts.init(chartDom);
    let option;

    option = {
        title: {
            text: "机械台班碳排放计算",
            subtext: '单位：t',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: dataStore.getMachineName,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Direct',
                type: 'bar',
                data: dataStore.getMachineCarbonEmission,
                itemStyle: {
                    normal:{
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function (params){
                            let colorList = ['#c23531',
                                '#2f4554',
                                '#61a0a8',
                                '#d48265',
                                '#91c7ae',
                                '#749f83',
                                '#ca8622',
                                '#bda29a',
                                '#6e7074',
                                '#546570',
                                '#c4ccd3'];
                            return colorList[params.dataIndex];
                        }
                    },
                },
            }
        ]
    };

    option && myChart.setOption(option);
}

onMounted(() => {
    drawCharts()
    drawMachineCharts()
})

onUpdated(() => {
    drawCharts()
    drawMachineCharts()
})

</script>

<template>
  <div class="flex flex-row space-x-4 justify-center">
      <div id="chart-1" style="width: 500px;height:360px;"></div>
      <div id="chart-2" style="width: 500px;height:360px;"></div>
  </div>
</template>

<style scoped>

</style>