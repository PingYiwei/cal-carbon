import { defineStore } from "pinia";

export const useDataStore = defineStore('material', {
    state: () => ({
        materialSum: 0,
        machineSum: 0,
        machineGroup: [],
        electricityCarbonEmission: 0,
        waterCarbonEmission: 0
    }),
    getters: {
        getTotalValue: (state) => {
            return (state.materialSum*1.0 + state.machineSum*1.0 +
                state.electricityCarbonEmission*1.0 + state.waterCarbonEmission*1.0).toFixed(2)
        },
        getMachineName: (state) => {
            let tempArray = []
            for (let i = 0; i < state.machineGroup.length; i++) {
                // @ts-ignore
                tempArray.push(state.machineGroup[i].machineName)
            }
            return tempArray
        },
        getMachineCarbonEmission: (state) => {
            let tempArray = []
            for (let i = 0; i < state.machineGroup.length; i++) {
                // @ts-ignore
                tempArray.push(state.machineGroup[i].machineCarbonEmission)
            }
            return tempArray
        }
    }
})