<script setup>
import {
    CaretRight,
    Menu as IconMenu,
    Setting, StarFilled,
} from '@element-plus/icons-vue'
import {ref} from "vue";
import {useRouter} from "vue-router";

const isCollapse = ref(true)
function changeCollapse() {
    isCollapse.value = !isCollapse.value
}
const router = useRouter()
function toLceca() {
    router.push('/lceca')
}

function toCceqc() {
    router.push('/cceqc')
}


</script>

<template>
    <div class="flex flex-col">
        <el-icon class="self-center mt-2 cursor-pointer hover:text-orange-400 hover:text-3xl transition-all"
                 :class="isCollapse ? 'rotate-0':'rotate-180'"
                 @click="changeCollapse"><CaretRight /></el-icon>
        <el-menu
            class="el-menu-vertical-demo h-full font-bold pt-2 pr-2 max-w-2xl"
            :collapse="isCollapse"
            mode="vertical"
        >
            <el-menu-item index="lceca" @click="toLceca">
                <el-icon><StarFilled /></el-icon>
                <span class="text-lg">LC-ECA</span>
            </el-menu-item>
            <el-menu-item index="cceqc" @click="toCceqc">
                <el-icon><IconMenu /></el-icon>
                <span class="text-lg">CCE-QC</span>
            </el-menu-item>
            <div class="space-div"></div>

        </el-menu>
    </div>
</template>

<style scoped>
.space-div {
    flex-grow: 1;
}
</style>