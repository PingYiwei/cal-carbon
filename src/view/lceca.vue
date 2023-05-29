<script setup>
import {ref, watch, onMounted} from "vue";
import {CirclePlusFilled, Plus, Minus, RemoveFilled} from "@element-plus/icons-vue";
import * as echarts from 'echarts';
import {CountTo} from 'vue3-count-to';
import SideMenu from "../components/SideMenu.vue";

// 数字滚动效果
const npCarbon = ref(true)
const oldNum1 = ref(0)
const currentNum1 = ref(0)
const oldNum2 = ref(0)
const currentNum2 = ref(0)
const oldNum3 = ref(0)
const currentNum3 = ref(0)
const oldNum4 = ref(0)
const currentNum4 = ref(0)
watch(currentNum1, (newValue, oldValue) => {
    oldNum1.value = oldValue
})
watch(currentNum2, (newValue, oldValue) => {
    oldNum2.value = oldValue
})
watch(currentNum3, (newValue, oldValue) => {
    oldNum3.value = oldValue
})
watch(currentNum4, (newValue, oldValue) => {
    oldNum4.value = oldValue
})

// 建筑面积
const area = ref(1000)
// 三个阶段的说明
const info = [
    {
        param_name: "建材阶段碳排放",
        time_name: "持续时间",
        note_content: "包括建材生产和运输所产生的碳排放",
    },
    {
        param_name: "施工阶段碳排放",
        time_name: "持续时间",
        note_content: "包括施工阶段能源消耗和机械设备台班所产生的碳排放",
    },
    {
        param_name: "运维阶段碳排放",
        time_name: "持续时间",
        note_content: "包括运维阶段所产生的碳排放",
    },
]
// 三个阶段的碳排放和时间数据
const basic_data = ref([
    // 方案-1的基础参数
    {
        data_n1: 100,
        data_t1: 1,
        data_n2: 25,
        data_t2: 2,
        data_n3: -10,
        data_t3: 50,
    },
])

// 修复阶段碳排放和时间数据
const repair_data = ref([
    // 方案-1的修复点参数数组
    [{
        index: 0,
        data_n: 100,
        data_t: 30,
    }],
])

// 拆除阶段碳排放和时间数据
const del_data = ref([
    // 方案-1的拆除参数
    {
        data_n: 150,
        data_t: 1,
        data_dt: 70,
    }
])

// 增加修复时间点的输入框
function addRepairPoint(planNum) {
    repair_data.value[planNum - 1].push(
        {
            index: repair_data.value[planNum - 1].length,
            data_n: 0,
            data_t: 0,
        }
    )
}

// 删除修复时间点的输入框
function removeRepairPoint(planNum) {
    repair_data.value[planNum - 1].pop()
}


// 重置所有输入框
function resetAll(planNum) {
    basic_data.value[planNum - 1] = {
        data_n1: 0,
        data_t1: 0,
        data_n2: 0,
        data_t2: 0,
        data_n3: 0,
        data_t3: 0,
    }
    repair_data.value[planNum - 1] = [
        {
            index: 0,
            data_n: 0,
            data_t: 0,
        }
    ]
    del_data.value[planNum - 1] = {
        data_n: 0,
        data_t: 0,
        data_dt: 0,
    }

    refresh(planNum)
}

// 计算碳排放
function carbon_cal(planNum) {
    // 基础参数定义
    let carbon = 0  // 累计碳排放
    let time = 0  // 累计时间
    let xData = [0]  // 每个时点的时间
    let yData = [0]  // 每个时点的碳排放

    // 前期阶段
    // 建造阶段
    carbon += basic_data.value[planNum - 1].data_n1 * basic_data.value[planNum - 1].data_t1
    time += basic_data.value[planNum - 1].data_t1 * 1.0
    xData.push(time)
    yData.push(Math.round(carbon * 100) / 100)
    // 施工阶段
    carbon += basic_data.value[planNum - 1].data_n2 * basic_data.value[planNum - 1].data_t2
    time += basic_data.value[planNum - 1].data_t2 * 1.0
    xData.push(time)
    yData.push(Math.round(carbon * 100) / 100)

    // 插入修复阶段的碳排放增长
    for (let j = 0; j < repair_data.value[planNum - 1].length; j++) {
        // 修复点的原始碳排放
        // 判断是否有有效的修复点
        if (repair_data.value[planNum - 1][j].data_t * 1.0 < time && repair_data.value[planNum - 1][j].data_t * 1.0 !== 0) {
            alert('你丫的没造好就开始修复是吧？')
            return
        } else if (repair_data.value[planNum - 1][j].data_t * 1.0 === 0) {
            break
        } else {
            const current_time = repair_data.value[planNum - 1][j].data_t * 1.0
            carbon += (current_time - time) * basic_data.value[planNum - 1].data_n3
            xData.push(current_time)
            yData.push(Math.round(carbon * 100) / 100)
            // 修复点碳排放增长
            carbon += repair_data.value[planNum - 1][j].data_n * 1.0
            xData.push(current_time)
            yData.push(Math.round(carbon * 100) / 100)
            // 时间定位至当前时间点
            time = current_time
        }
    }

    // 剩余的运维阶段
    const operation_over_time = basic_data.value[planNum - 1].data_t1 * 1.0 + basic_data.value[planNum - 1].data_t2 * 1.0
        + basic_data.value[planNum - 1].data_t3 * 1.0
    carbon += basic_data.value[planNum - 1].data_n3 * (operation_over_time - time)
    time = operation_over_time
    xData.push(time)
    yData.push(Math.round(carbon * 100) / 100)

    // 是否有水平阶段
    if (del_data.value[planNum - 1].data_dt > time) {
        // 增加水平阶段
        xData.push(del_data.value[planNum - 1].data_dt * 1.0)
        yData.push(Math.round(carbon * 100) / 100)
        // 时间定位至当前时间点
        time = del_data.value[planNum - 1].data_dt * 1.0
    }
    // 拆除增长
    carbon += del_data.value[planNum - 1].data_n * del_data.value[planNum - 1].data_t
    xData.push(del_data.value[planNum - 1].data_t * 1.0 + time)
    yData.push(Math.round(carbon * 100) / 100)

    return [xData, yData]
}

// 优化碳排放
const is_opti = ref([false])
const opti_time = ref([0])

function opti_carbon(planNum) {
    let mod_carbon = (basic_data.value[planNum - 1].data_n1 * basic_data.value[planNum - 1].data_t1 +
            basic_data.value[planNum - 1].data_n2 * basic_data.value[planNum - 1].data_t2)
        / (opti_time.value[planNum - 1] * 1.0 - (basic_data.value[planNum - 1].data_t1 * 1.0 + basic_data.value[planNum - 1].data_t2 * 1.0))
    basic_data.value[planNum - 1].data_n3 = Math.round(-mod_carbon * 100) / 100

    refresh(planNum)
}

// 刷新结果
function refresh(planNum) {
    if (area.value === 0) {
        alert('请输入建筑面积')
        return
    }
    // for (let i = 1; i < planBox.value.length+2; i++) {
    //     const result = carbon_cal(i)
    //     let data = []
    //     for (let j = 0; j < result[0].length; j++) {
    //         data.push([result[0][j], result[1][j]])
    //     }
    //     seriesData[i-1].data = data
    //     console.log(data)
    // }
    const result = carbon_cal(planNum)
    let data = []
    for (let k = 0; k < result[0].length; k++) {
        data.push([result[0][k], result[1][k]])
    }
    seriesData[planNum - 1].data = data
    const optionData = returnOption(seriesData)
    console.log(optionData)
    drawChart(optionData)
    npCarbon.value = data[data.length - 1][1] < 0
    currentNum1.value = Math.abs(Math.ceil(area.value * data[data.length - 1][1] / 0.785))
    currentNum2.value = Math.abs(Math.ceil(area.value * data[data.length - 1][1] / 18))
    currentNum3.value = Math.abs(Math.ceil(area.value * data[data.length - 1][1] / 2700))
    currentNum4.value = Math.abs(Math.ceil(area.value * data[data.length - 1][1] / 5740))
}

// 绘图默认参数
const seriesData = [
    {
        name: 'Plan-1',
        type: 'line',
        smooth: false,
        lineStyle: {
            width: 2,
            color: 'black',
        },
        label: {
            show: false,
            position: 'top',
            textStyle: {
                color: 'black',
                fontSize: 12,
            }
        },
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
            normal: {
                color: 'black',
            }
        },
        showSymbol: true,
        emphasis: {
            focus: 'series'
        },
        data: [],
    },
]

function returnOption(seriesData) {
    return {
        grid: {
            left: '1%',
            containLabel: true
        },
        legend: {
            type: 'plain',
            textStyle: {
                color: 'black',
                fontSize: 12,
            }
        },
        xAxis: {
            name: 'Time',
            type: 'value',
            boundaryGap: false,
            nameTextStyle: {
                color: 'black',
                fontSize: 15,
                align: 'left',
                fontWeight: 'bold',
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                color: 'black',
                fontSize: 12,
                fontWeight: 'bold',
            },
            splitLine: {
                show: false,
            },
        },
        yAxis: {
            splitLine: {
                show: false,
            },
            axisLine: {
                show: true,
            },
            axisTick: {
                show: false,
            },
            name: 'Carbon Emission kg/m²',
            type: 'value',
            nameTextStyle: {
                color: 'black',
                fontSize: 15,
                align: 'left',
                padding: [0, 0, 10, 0],
                fontWeight: 'bold',
            },
            axisLabel: {
                show: false
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        series: seriesData,
    }
}

// 绘制图
function drawChart(optionData = {
    grid: {
        left: '0.5%',
        containLabel: true
    },
    legend: {
        type: 'plain',
        textStyle: {
            color: 'black',
            fontSize: 12,
        }
    },
    xAxis: {
        name: 'Time',
        type: 'value',
        boundaryGap: false,
        nameTextStyle: {
            color: 'black',
            fontSize: 15,
            align: 'left',
            fontWeight: 'bold',
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            color: 'black',
            fontSize: 12,
            fontWeight: 'bold',
        },
        splitLine: {
            show: false,
        },
    },
    yAxis: {
        splitLine: {
            show: false,
        },
        axisLine: {
            show: true,
        },
        axisTick: {
            show: false,
        },
        name: 'Carbon Emission kg/m²',
        type: 'value',
        nameTextStyle: {
            color: 'black',
            fontSize: 15,
            align: 'left',
            padding: [0, 0, 10, 0],
            fontWeight: 'bold',
        },
        axisLabel: {
            show: false
        },
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    series: [
        {
            name: 'Plan-1',
            type: 'line',
            smooth: false,
            lineStyle: {
                width: 2,
                color: 'black',
            },
            label: {
                show: false,
                position: 'top',
                textStyle: {
                    color: 'black',
                    fontSize: 12,
                }
            },
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: {
                normal: {
                    color: 'black',
                }
            },
            showSymbol: true,
            emphasis: {
                focus: 'series'
            },
            data: [[0, 0], [1, 232], [2, 101], [3, -264], [4, -90], [5, -340], [6, 250]],
        },
    ],
}) {
    const myChart = echarts.init(document.getElementById('main-chart'));
    myChart.setOption(optionData, true);
}

// 挂载drawChart函数
onMounted(() => {
    drawChart()
})

// 设置活动的方案和方案数组
const activeName = ref('1')
const planBox = ref([])

// 颜色组合
const color1 = ['rgb(0, 221, 255)', 'rgb(55, 162, 255)', 'rgb(255, 0, 135)', 'rgb(255, 191, 0)']
const color2 = ['rgb(77, 119, 255)', 'rgb(116, 21, 219)', 'rgb(135, 0, 157)', 'rgb(224, 62, 76)']

// 增加方案
function addPlan() {
    planBox.value.push(`方案-${planBox.value.length + 2}`)
    activeName.value = String(planBox.value.length + 1)
    // 增加basic_data的数据
    basic_data.value.push({
        data_n1: 0,
        data_t1: 0,
        data_n2: 0,
        data_t2: 0,
        data_n3: 0,
        data_t3: 0,
    })
    // 增加repair_data的数据
    repair_data.value.push(
        [{
            index: 0,
            data_n: 0,
            data_t: 0,
        }]
    )
    // 增加del_data的数据
    del_data.value.push(
        {
            data_n: 0,
            data_t: 0,
            data_dt: 0,
        }
    )
    // 增加优化的参数
    is_opti.value.push(false)
    opti_time.value.push(0)

    // 增加绘图参数
    seriesData.push({
        name: `Plan-${planBox.value.length + 1}`,
        type: 'line',
        smooth: false,
        lineStyle: {
            width: 2,
            color: color1[planBox.value.length - 1],
        },
        label: {
            show: false,
            position: 'top',
            textStyle: {
                color: 'black',
                fontSize: 12,
            }
        },
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
            normal: {
                color: color1[planBox.value.length - 1],
            }
        },
        showSymbol: true,
        // areaStyle: {
        //     opacity: 0.5,
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //         {
        //             offset: 0,
        //             color: color1[planBox.value.length-1]
        //         },
        //         {
        //             offset: 1,
        //             color: color2[planBox.value.length-1]
        //         }
        //     ])
        // },
        emphasis: {
            focus: 'series'
        },
        data: [],
    })
}

// 删除方案
function removePlan() {
    planBox.value.pop()
    activeName.value = String(1)
    // 删除参数的数据
    // 删除basic_data的数据
    basic_data.value.pop()
    // 删除repair_data的数据
    repair_data.value.pop()
    // 删除del_data的数据
    del_data.value.pop()
    // 删除优化的数据
    is_opti.value.pop()
    opti_time.value.pop()
    // 删除系列数据
    seriesData.pop()
    // 刷新
    drawChart(returnOption(seriesData))

}

</script>

<template>
    <div class="flex flex-row">
        <SideMenu></SideMenu>
        <div class="flex flex-col m-2 w-full">
            <div class="flex flex-row">
                <div class="rounded-md shadow-md p-2">
                    <div class="text-lg font-bold mb-2 w-48">建筑面积 m²</div>
                    <el-input v-model="area" placeholder="Number"/>
                </div>
                <div class="ml-4 mt-auto">
                    <el-button-group>
                        <el-button type="primary" @click="addPlan">
                            <el-icon class="mr-2">
                                <Plus/>
                            </el-icon>
                            Add
                        </el-button>
                        <el-button type="danger" :class="planBox.length===0?'no-remove':'is-remove'" @click="removePlan"
                                   :disabled="planBox.length===0">
                            delete
                            <el-icon class="ml-2">
                                <Minus/>
                            </el-icon>
                        </el-button>
                    </el-button-group>
                </div>
            </div>
            <el-tabs v-model="activeName" class="mt-2 p-2 rounded-md shadow-md">
                <!--        方案-1-->
                <el-tab-pane label="方案-1" name="1">
                    <div class="grid grid-cols-3 gap-8">
                        <div class="flex flex-col mt-2 ">
                            <!--                    基础参数-1-->
                            <div class="flex flex-row space-x-2">
                                <div class="flex flex-col flex-grow">
                                    <div class="font-bold mb-2">{{ info[0].param_name }}</div>
                                    <el-input v-model="basic_data[0].data_n1" input-style="font-size: 14px" clearable/>
                                </div>
                                <div class="flex flex-col flex-grow">
                                    <div class="font-bold mb-2">{{ info[0].time_name }}</div>
                                    <el-input v-model="basic_data[0].data_t1" input-style="font-size: 14px"/>
                                </div>
                            </div>
                            <div class="text-sm text-orange-400 font-bold mt-1 mb-2">注：{{ info[0].note_content }}</div>
                            <!--                    基础参数-2-->
                            <div class="flex flex-row space-x-2">
                                <div class="flex flex-col  flex-grow">
                                    <div class="font-bold mb-2">{{ info[1].param_name }}</div>
                                    <el-input v-model="basic_data[0].data_n2" input-style="font-size: 14px"/>
                                </div>
                                <div class="flex flex-col  flex-grow">
                                    <div class="font-bold mb-2">{{ info[1].time_name }}</div>
                                    <el-input v-model="basic_data[0].data_t2" input-style="font-size: 14px"/>
                                </div>
                            </div>
                            <div class="text-sm text-orange-400 font-bold mt-1 mb-2">注：{{ info[1].note_content }}</div>
                            <!--                    基础参数-3-->
                            <div class="flex flex-row space-x-2">
                                <div class="flex flex-col flex-grow">
                                    <div class="font-bold mb-2">{{ info[2].param_name }}</div>
                                    <el-input v-model="basic_data[0].data_n3" input-style="font-size: 14px"/>
                                </div>
                                <div class="flex flex-col flex-grow">
                                    <div class="font-bold mb-2">{{ info[2].time_name }}</div>
                                    <el-input v-model="basic_data[0].data_t3" input-style="font-size: 14px"/>
                                </div>
                            </div>
                            <div class="text-sm text-orange-400 font-bold mt-1">注：{{ info[2].note_content }}</div>
                        </div>
                        <!--                修复的参数-->
                        <div class="">
                            <el-scrollbar height="300px">
                                <div class="flex flex-row space-x-2 mt-2" v-for="r in repair_data[0]" :key="r">
                                    <div class="flex flex-col flex-grow">
                                        <div class="font-bold mb-2">第{{ r.index + 1 }}次修复产生碳排放</div>
                                        <el-input v-model="r.data_n" input-style="font-size: 14px"/>
                                    </div>
                                    <div class="flex flex-col flex-grow">
                                        <div class="font-bold mb-2">第{{ r.index + 1 }}次修复时间点</div>
                                        <el-input v-model="r.data_t" input-style="font-size: 14px"/>
                                    </div>
                                    <el-icon class="mt-auto" id="add-icon" @click="addRepairPoint(1)"
                                             :style="{visibility: (r.index+1 === repair_data[0].length)?'visible':'hidden'}">
                                        <CirclePlusFilled/>
                                    </el-icon>
                                    <el-icon class="mt-auto" id="remove-icon" @click="removeRepairPoint(1)"
                                             :style="{visibility: (r.index+1 === repair_data[0].length && r.index!==0)?'visible':'hidden'}">
                                        <RemoveFilled/>
                                    </el-icon>
                                </div>
                            </el-scrollbar>
                        </div>

                        <div class="del-container mt-2">
                            <div class="grid grid-cols-2 gap-2">
                                <div class="flex flex-col">
                                    <div class="font-bold mb-2">拆除阶段碳排放</div>
                                    <el-input v-model="del_data[0].data_n" input-style="font-size: 14px"/>
                                </div>
                                <div class="flex flex-col">
                                    <div class="font-bold mb-2">持续时间</div>
                                    <el-input v-model="del_data[0].data_t" input-style="font-size: 14px"/>
                                </div>
                                <div class="t-input">
                                    <div class="font-bold mb-2">拆除时间</div>
                                    <el-input v-model="del_data[0].data_dt" input-style="font-size: 14px"/>
                                </div>
                            </div>
                            <div class="w-full">
                                <div class="text-sm text-orange-400 font-bold mt-1">注：包括拆除阶段消耗的能源与机械台班所产生碳排放，也可以通过回收材料降低碳排放
                                </div>
                            </div>
                            <div class="flex flex-row justify-between">
                                <el-checkbox v-model="is_opti[0]" class="mt-auto" label="是否需要优化"/>
                                <div>
                                    <div class="font-bold mb-2">碳排放平衡时间节点</div>
                                    <el-input v-model="opti_time[0]" input-style="font-size: 14px" :disabled="!is_opti[0]"/>
                                </div>
                            </div>
                            <div class="flex flex-row justify-end space-x-2 mt-4">
                                <el-button type="primary" class="w-24" @click="refresh(1)">计算</el-button>
                                <el-button type="danger" class="w-24" @click="resetAll(1)">清空</el-button>
                                <el-button type="success" :class="is_opti[0] ? 'opti-button':'opti-button-disabled'"
                                           :disabled="!is_opti[0]" class="w-24"
                                           @click="opti_carbon(1)"
                                >优化
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <!--        方案-2及后续方案-->
                <el-tab-pane v-for="p in planBox" :key="p" :label="p" :name="String(planBox.indexOf(p)+2)">
                    <div class="grid grid-cols-3 gap-8">
                        <div class="flex flex-col mt-2">
                            <!--                    基础参数-1-->
                            <div class="flex flex-row space-x-2">
                                <div class="flex flex-col flex-grow">
                                    <div class="font-bold mb-2">{{ info[0].param_name }}</div>
                                    <el-input v-model="basic_data[planBox.indexOf(p)+1].data_n1"
                                              input-style="font-size: 14px"/>
                                </div>
                                <div class="flex flex-col flex-grow">
                                    <div class="font-bold mb-2">{{ info[0].time_name }}</div>
                                    <el-input v-model="basic_data[planBox.indexOf(p)+1].data_t1"
                                              input-style="font-size: 14px"/>
                                </div>
                            </div>
                            <div class="text-sm text-orange-400 font-bold mt-1 mb-2">注：{{ info[0].note_content }}</div>
                            <!--                    基础参数-2-->
                            <div class="flex flex-row space-x-2">
                                <div class="flex flex-col  flex-grow">
                                    <div class="font-bold mb-2">{{ info[1].param_name }}</div>
                                    <el-input v-model="basic_data[planBox.indexOf(p)+1].data_n2"
                                              input-style="font-size: 14px"/>
                                </div>
                                <div class="flex flex-col  flex-grow">
                                    <div class="font-bold mb-2">{{ info[1].time_name }}</div>
                                    <el-input v-model="basic_data[planBox.indexOf(p)+1].data_t2"
                                              input-style="font-size: 14px"/>
                                </div>
                            </div>
                            <div class="text-sm text-orange-400 font-bold mt-1 mb-2">注：{{ info[1].note_content }}</div>
                            <!--                    基础参数-3-->
                            <div class="flex flex-row space-x-2">
                                <div class="flex flex-col  flex-grow">
                                    <div class="font-bold mb-2">{{ info[2].param_name }}</div>
                                    <el-input v-model="basic_data[planBox.indexOf(p)+1].data_n3"
                                              input-style="font-size: 14px"/>
                                </div>
                                <div class="flex flex-col flex-grow">
                                    <div class="font-bold mb-2">{{ info[2].time_name }}</div>
                                    <el-input v-model="basic_data[planBox.indexOf(p)+1].data_t3"
                                              input-style="font-size: 14px"/>
                                </div>
                            </div>
                            <div  class="text-sm text-orange-400 font-bold mt-1">注：{{ info[2].note_content }}</div>
                        </div>
                        <!--                修复的参数-->
                        <div class="">
                            <el-scrollbar height="300px">
                                <div class="flex flex-row space-x-2 mt-2"  v-for="r in repair_data[planBox.indexOf(p)+1]" :key="r">
                                    <div class="flex flex-col flex-grow">
                                        <div class="font-bold mb-2">第{{ r.index + 1 }}次修复产生碳排放</div>
                                        <el-input v-model="r.data_n" input-style="font-size: 14px"/>
                                    </div>
                                    <div class="flex flex-col flex-grow">
                                        <div class="font-bold mb-2">第{{ r.index + 1 }}次修复时间点</div>
                                        <el-input v-model="r.data_t" input-style="font-size: 14px"/>
                                    </div>
                                    <el-icon class="mt-auto" id="add-icon" @click="addRepairPoint(planBox.indexOf(p)+2)"
                                             :style="{visibility: (r.index+1 === repair_data[planBox.indexOf(p)+1].length)?'visible':'hidden'}">
                                        <CirclePlusFilled/>
                                    </el-icon>
                                    <el-icon class="mt-auto" id="remove-icon" @click="removeRepairPoint(planBox.indexOf(p)+2)"
                                             :style="{visibility: (r.index+1 === repair_data[planBox.indexOf(p)+1].length && r.index!==0)?'visible':'hidden'}">
                                        <RemoveFilled/>
                                    </el-icon>
                                </div>
                            </el-scrollbar>
                        </div>
                        <!--                拆除阶段参数-->
                        <div class="del-container mt-2">
                            <div class="grid grid-cols-2 gap-2">
                                <div class="flex flex-col">
                                    <div class="font-bold mb-2">拆除阶段碳排放</div>
                                    <el-input v-model="del_data[planBox.indexOf(p)+1].data_n"
                                              input-style="font-size: 14px"/>
                                </div>
                                <div class="flex flex-col">
                                    <div class="font-bold mb-2">持续时间</div>
                                    <el-input v-model="del_data[planBox.indexOf(p)+1].data_t"
                                              input-style="font-size: 14px"/>
                                </div>
                                <div class="flex flex-col">
                                    <div class="font-bold mb-2">拆除时间</div>
                                    <el-input v-model="del_data[planBox.indexOf(p)+1].data_dt"
                                              input-style="font-size: 14px"/>
                                </div>
                            </div>
                            <div style="width: 100%">
                                <div class="text-sm text-orange-400 font-bold mt-1">注：包括拆除阶段消耗的能源与机械台班所产生碳排放，也可以通过回收材料降低碳排放
                                </div>
                            </div>
                            <div class="flex flex-row justify-between">
                                <el-checkbox v-model="is_opti[planBox.indexOf(p)+1]" class="mt-auto" label="是否需要优化"/>
                                <div class="t-input bal-input">
                                    <div class="font-bold mb-2">碳排放平衡时间节点</div>
                                    <el-input v-model="opti_time[planBox.indexOf(p)+1]" input-style="font-size: 14px"
                                              :disabled="!is_opti[planBox.indexOf(p)+1]"/>
                                </div>
                            </div>
                            <div class="flex flex-row justify-end space-x-2 mt-4">
                                <el-button type="primary" class="w-24" @click="refresh(planBox.indexOf(p)+2)">计算</el-button>
                                <el-button type="danger" class="w-24" @click="resetAll(planBox.indexOf(p)+2)">清空</el-button>
                                <el-button type="success" :class="is_opti[planBox.indexOf(p)+1] ? 'opti-button':'opti-button-disabled'"
                                           :disabled="!is_opti[planBox.indexOf(p)+1]"
                                           class="w-24"
                                           @click="opti_carbon(planBox.indexOf(p)+2)">优化
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div class="flex flex-row mt-4 space-x-4">
                <div class="flex flex-col rounded-md shadow-md p-2">
                    <div class="font-bold text-xl">计算曲线</div>
                    <div id="main-chart" style="width: 1000px;height:360px;"></div>
                </div>
                <div class="ml-auto flex flex-col rounded-md shadow-md flex-grow p-2">
                    <div class="mb-2 font-bold text-xl">碳排放等效对比</div>
                    <div class="flex flex-col justify-around text-xl mb-2 h-full">
                        <div class="equal-sentence">
                            相当于<span class="text-3xl font-bold" :style="{color: npCarbon ? '#2cb277':'#ab2222'}"><count-to :startVal="oldNum1"
                                                                                                                              :endVal="currentNum1"
                                                                                                                              :duration="2000"></count-to></span>度电所需要CO2
                        </div>
                        <div class="equal-sentence">
                            相当于<span class="text-3xl font-bold" :style="{color: npCarbon ? '#2cb277':'#ab2222'}"><count-to :startVal="oldNum2"
                                                                                                                              :endVal="currentNum2"
                                                                                                                              :duration="2000"></count-to></span>棵树一年吸收的CO2
                        </div>
                        <div class="equal-sentence">
                            相当于<span class="text-3xl font-bold" :style="{color: npCarbon ? '#2cb277':'#ab2222'}"><count-to :startVal="oldNum3"
                                                                                                                              :endVal="currentNum3"
                                                                                                                              :duration="2000"></count-to></span>辆汽车一年的CO2排放
                        </div>
                        <div class="equal-sentence">
                            相当于<span class="text-3xl font-bold" :style="{color: npCarbon ? '#2cb277':'#ab2222'}"><count-to :startVal="oldNum4"
                                                                                                                              :endVal="currentNum4"
                                                                                                                              :duration="2000"></count-to></span>个家庭一年的CO2排放
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
#add-icon {
    font-size: 2rem;
    cursor: pointer;
    color: #5a9cf8;
}
#remove-icon {
    font-size: 2rem;
    cursor: pointer;
    color: #e47470;
}
</style>
