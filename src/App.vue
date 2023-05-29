<script setup>
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount} from "vue";

const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
    if (route.path !== "/") {
        router.push("/")
    }
})

</script>

<template>
        <router-view/>
</template>

<style scoped>

</style>
