<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',

  async mounted() {
    if (this.$store.state.games.length === 0) {
      await this.$store.dispatch('fetchGames');
    }
  },
};
</script>

<style>
@font-face {
  font-family: 'Press Start 2P';
  src: url('@/assets/fonts/PressStart2P-Regular.ttf');
}

:root {
  --primary: #B946FF;
  --accent: #2BFF8B;
  --dark: #1C1C1E;
  --white: #FFFFFF;
  --pressStart: 'Press Start 2P', sans-serif;
}

body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;

  width: 100%;
  height: 100vh;
}

.container-screen {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
