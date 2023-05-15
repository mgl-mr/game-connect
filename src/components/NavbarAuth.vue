<template>
  <div class="container-nav">
    <router-link
      to="/sign-in"
      :class="{'auth-link-selected':isSignInRoute, 'auth-link':!isSignInRoute}"
    >
      Login
    </router-link>

    <router-link
      to="/sign-up"
      :class="{'auth-link-selected':isSignUpRoute, 'auth-link':!isSignUpRoute}"
    >
      Registrar
    </router-link>

    <router-link
      to="/forgot-pass"
      :class="{'auth-link-selected':isForgotPassRoute, 'auth-link':!isForgotPassRoute}"
    >
      Recuperar Senha
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NavbarAuth',

  computed: {
    isSignInRoute() {
      return this.$route.path === '/sign-in';
    },
    isSignUpRoute() {
      return (
        this.$route.path === '/sign-up/sign-up1'
        || this.$route.path === '/sign-up/sign-up2'
        || this.$route.path === '/sign-up/sign-up3'
        || this.$route.path === '/sign-up/sign-up4'
      );
    },
    isForgotPassRoute() {
      return this.$route.path === '/forgot-pass';
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
  height: 15vh;

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
