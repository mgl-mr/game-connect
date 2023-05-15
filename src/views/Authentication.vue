<template>
  <div class="container-screen">
    <div class="container-logo">
      <img src="@/assets/images/logo.png" class="logo" alt="Logo Game Connect">
    </div>
    <div class="container-auth">
      <NavbarAuth />
      <router-view class="component" />
    </div>
  </div>
</template>

<script>
import NavbarAuth from '@/components/NavbarAuth.vue';

export default {
  components: { NavbarAuth },
  name: 'Authentication',
};
</script>

<style scoped>
/***  Logo ***/
.container-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 40%;

  background: linear-gradient(20deg, var(--accent) 0%, var(--primary) 100%);
}

.logo {
  width: calc(15vw + 10vh);
  height: calc(15vw + 10vh);
  animation: logo 2s linear infinite;
}

.component {
  width: 100%;
  height: 80vh;
}

/***  AUTH ***/
.container-auth{
  height: 100vh;
  width: 60%;

  background: linear-gradient(180deg, var(--dark) 15%, var(--primary) 220%);
}

@keyframes logo {
  0% {
    transform: scale(1);
  }
  50% {
    /* transform: rotate(360deg); */
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
