<template>
  <div class="container-nav">
    <router-link
      to="/my-profile"
      :class="{
        'auth-link-selected':checkRoute('/my-profile'),
        'auth-link':!checkRoute('/my-profile')}"
    >
      Meu perfil
    </router-link>
    <router-link
      to="/suggestions"
      :class="{
        'auth-link-selected':checkRoute('/suggestions'),
        'auth-link':!checkRoute('/suggestions')}"
    >
      Sugestões
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Navbar',

  methods: {
    checkRoute(route) {
      return this.$route.path === route;
    },
  },
};
</script>

<style scoped>
.container-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: calc(15vh - 5px);

  border-bottom: 5px solid var(--primary);
}

.auth-link {
  text-decoration: none;
  font-family: var(--pressStart);
  font-size:  calc(1vw + 0.5vh);
  color: var(--accent);
  transition: transform 0.2s ease-in-out;
}

.auth-link:hover {
  transform: scale(1.1);
  background-image: linear-gradient(45deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-link-selected {
  text-decoration: none;
  height: 6vh;
  align-self: flex-end;
  padding: calc(1vw + 0.5vh);

  font-family: var(--pressStart);
  font-size: calc(1vw + 0.5vh + 4px);
  color: var(--accent);
  text-shadow: 0px 4px 4px var(--primary);
  background: rgba(185, 70, 255, 0.1);
  box-shadow: inset 0px 4px 4px #B946FF;
  border-radius: 15px 15px 0px 0px;
}
</style>
