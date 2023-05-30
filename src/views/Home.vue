<template>
  <div class="container-screen">
    <p>Novas features em breve!!!!</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
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
