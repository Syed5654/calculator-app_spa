<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const logout = () => {
  localStorage.removeItem('id')
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
<template>
  <div class="navbar">
    <div class="container">
      <div class="navbar-content">
        <h1 class="logo"><span class="text-primary">Calculator App</span>.</h1>
        <button class="btn btn-logout" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  background-color: white;
  padding: 1.3rem 0;
  box-shadow: 0px 0px 6px 0px rgb(77, 77, 77);

  &-content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
      font-style: italic;
      font-weight: 900;
    }

    .btn-logout {
      font-weight: 600;
      background-color: rgba(185, 185, 185, 0.233);
      border-radius: 3px;

      &:hover {
        background-color: rgba(207, 207, 207, 0.233);
      }
    }
  }
}
</style>