<template>
  <div class="container">
    <ProgressBar />
    <router-view />
  </div>
</template>

<script>
import ProgressBar from './ProgressBar.vue';

export default {
  components: { ProgressBar },
  name: 'SignUp',
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
</style>
