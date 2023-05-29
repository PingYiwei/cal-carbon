<script setup>

import {ref} from "vue";
import {Lock, User} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";

const router = useRouter()

const loginName = ref('')
const password = ref('')

function goToMainPage() {
    router.push('/agent')
}

</script>

<template>
  <div class="flex justify-center items-center h-full w-full">
      <div class="flex-row flex rounded-lg self-center w-fit my-auto" id="container" style="height: 400px">
          <div class="w-80 h-full bg-center rounded-lg opacity-20" style="background-image: url(https://img1.baidu.com/it/u=3072105148,3915481765&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=565)">
          </div>
          <div class="flex-col flex p-4 w-80 justify-evenly">
              <div class="m-2 mb-4 font-bold text-2xl whitespace-nowrap leading-10">欢迎使用<br>建造碳排放速算系统</div>
              <el-input v-model="loginName" class="w-50 m-2 " placeholder="请输入用户名">
                  <template #prefix>
                      <el-icon class="el-input__icon"><User /></el-icon>
                  </template>
              </el-input>
              <el-input v-model="password" class="w-50 m-2" placeholder="请输入密码">
                  <template #prefix>
                      <el-icon class="el-input__icon"><Lock /></el-icon>
                  </template>
              </el-input>
              <div class="m-2 flex flex-row justify-between">
                  <el-checkbox class="" label="记住密码" style="font-weight: bold"></el-checkbox>
                  <div style="font-size: 14px" class="my-auto font-bold text-primary cursor-pointer">
                      忘记密码
                  </div>
              </div>
              <el-button class="m-2" type="primary" @click="goToMainPage">登录</el-button>
              <el-button class="m-2" type="success" @click="goToMainPage">登录后台</el-button>
          </div>
      </div>
  </div>
</template>

<style scoped>
#container {
    box-shadow: 0 0 30px rgba(0,0,0,.2);
}
</style>