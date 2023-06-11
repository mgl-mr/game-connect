<template>
  <div class="container-screen">
    <Sidebar />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'Application',
  components: { Sidebar },
};
</script>

<style scoped>
.container-screen{
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, var(--dark), var(--primary));
}

p {
  color: var(--white);
  font-family: var(--pressStart), Arial, Helvetica;
}
</style>
