<script setup>
import { useRoute } from "vue-router";
import Navbar from "@/components/layouts/Navbar.vue";
const route = useRoute();
</script>
<template>
  <Navbar v-if="route.name && route.name !== 'login' && route.name !== 'signup'" />
  <RouterView />
</template>
