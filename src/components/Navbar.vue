<template>
  <div class="container-nav">
    <router-link
      to="/application/suggestions"
      :class="{
        'auth-link-selected':checkRoute('/application/suggestions'),
        'auth-link':!checkRoute('/application/suggestions')
      }"
    >
      Sugestões
    </router-link>

    <router-link
      to="/application/match"
      :class="{
         'auth-link-selected':checkRoute('/application/match'),
         'auth-link':!checkRoute('/application/match'),
         'animation': !checkRoute('/application/match') && $store.state.user.inMatch
      }"
    >
      Match
    </router-link>

    <router-link
      to="/application/lobbies"
      :class="{
        'auth-link-selected':checkRoute('/application/lobbies') || checkRoute('/application/create-lobby') || checkRoute('/application/lobby'),
        'auth-link':!checkRoute('/application/lobbies') && !checkRoute('/application/create-lobby') && !checkRoute('/application/lobby')
      }"
    >
      Lobby
    </router-link>

    <router-link
      to="/application/my-profile"
      :class="{
        'auth-link-selected':checkRoute('/application/my-profile'),
        'auth-link':!checkRoute('/application/my-profile')
      }"
    >
      Meu perfil
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

@keyframes rainbow-swing {
  0% {
    color: var(--accent);
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  50% {
    color: var(--white);
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(3deg);
  }
  100% {
    color: var(--accent);
    transform: rotate(0deg);
  }
}

.animation {
  animation: rainbow-swing 1s ease-in-out infinite ;
}
</style>
