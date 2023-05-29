<template>
  <div class="form-auth">
    <div class="container-games">
      <p>Selecione seu jogos favoritos(opcional):</p>
      <div class="games">
        <div v-for="(game, id) in $store.state.userSignup.games" :key="id">
          <img :src="game.urlFoto" @click="removeGame(game)" :alt="game.nome">
        </div>
        <div v-for="index in numberOfDivs" :key="index"></div>
      </div>
    </div>
    <GamePicker
      :list="$store.state.userSignup.games"
      :pick="pickGame"
      :max=5
    />

    <div class="div-error">
      <p class="auth-error" :class="{'error':error}">{{ msg }}</p>
    </div>

    <div class="buttons">
      <div class="button-overflow">
        <button type="button" class="auth-button" @click="back">BACK</button>
      </div>
      <div class="button-overflow">
        <div class="button-loading" :class="{'loading':loading}"></div>
        <button type="button" @click="signUp" class="auth-button">Criar</button>
      </div>
    </div>
  </div>
</template>

<script>
import GamePicker from './GamePicker.vue';

export default {
  name: 'SignUp4',
  components: { GamePicker },

  data() {
    return {
      msg: 'çiausdfhpifuasdh',
      error: false,
      loading: false,
    };
  },

  computed: {
    numberOfDivs() {
      const arrayLength = this.$store.state.userSignup.games.length;
      const numberOfExtraDivs = Math.max(0, 5 - arrayLength);
      return numberOfExtraDivs;
    },
  },

  methods: {
    back() {
      this.$router.push('/sign-up/sign-up3');
    },

    pickGame(game) {
      if (
        this.$store.state.userSignup.games.length === 5
        || this.$store.state.userSignup.games.some((g) => g.id === game.id)
      ) {
        return;
      }

      const { games } = this.$store.state.userSignup;
      games.push(game);
      this.$store.commit('setUserSignup', {
        games,
      });
    },

    removeGame(game) {
      const { games } = this.$store.state.userSignup;
      const index = games.findIndex((g) => g.id === game.id);
      if (index !== -1) {
        games.splice(index, 1);
      }
    },

    async signUp() {
      if (this.validate()) {
        return;
      }

      this.loading = true;
      const createUser = await this.$store.dispatch('signUp', this.$store.state.userSignup);
      this.loading = false;
      if (createUser === true) {
        this.$router.push({
          path: '/sign-in',
          query: {
            verify: true,
          },
        });
      } else {
        this.msg = createUser;
        this.error = true;
      }
    },

    validate() {
      const credentials = this.$store.state.userSignup;

      let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        credentials.name === ''
        || credentials.email === ''
        || credentials.password === ''
        || credentials.confirm === ''
        || (credentials.name.length < 3 || credentials.password.length > 30)
        || !regex.test(credentials.email)
        || credentials.password.length < 6 || credentials.password.length > 15
        || credentials.password !== credentials.confirm
      ) {
        this.$router.push({
          path: '/sign-up/sign-up1',
          query: {
            toValidate: true,
          },
        });
        return false;
      }

      regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
      if (
        credentials.birthdate === ''
        || !regex.test(credentials.birthdate)
      ) {
        this.$router.push({
          path: '/sign-up/sign-up2',
          query: {
            toValidate: true,
          },
        });
        return false;
      }

      regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      if (
        credentials.start === ''
        || credentials.end === ''
        || !regex.test(credentials.start)
        || !regex.test(credentials.end)
      ) {
        this.$router.push({
          path: '/sign-up/sign-up3',
          query: {
            toValidate: true,
          },
        });
        return false;
      }
    },
  },
};
</script>

<style scoped>
.form-auth {
  height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container-games {
  width: 60%;
}

.container-games > p {
  font-size: 0.7rem;
  color: var(--white);
  font-family: var(--pressStart), Arial, Helvetica;
}

.games {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.games div {
  width: 15%;
  height: 10vh;
  background-color: var(--dark);
  border-radius: 15px;
}

.games img {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}

.games img:hover {
  cursor: pointer;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 60%;
}

.button-overflow {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48%;
  height: 9vh;
  background: transparent;
  border: 0.5vh solid var(--accent);
  border-radius: 15px;
}

.button-overflow:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.auth-button {
  position: absolute;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  background-color: var(--accent);
  color: var(--primary);
  border: 0;
  border-radius: 10px;
  font-family: var(--pressStart);
  font-size: 1.8vw;
  transition: font-size 0.2s ease-in-out;
}

.auth-button:hover {
  text-shadow: 2px 4px 2px var(--white);
  font-size: 2vw;
  cursor: pointer;
}

.div-error {
  height: 4vh;
  margin: 0;
  text-align: center;
}

.auth-error {
  display: none;
  margin: 0;
  font-size: 1.5vw;
  color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
}

.button-loading {
  display: none;
  position: absolute;
  left: 0;
  width: 30%;
  height: 9vh;
  background: linear-gradient(to right, var(--primary), var(--white));
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.loading{
  display: block;
  animation: loading 2s linear infinite;
}

.error {
  display: block;
}

@keyframes loading {
  0% { left: -15%; }
  50% { left: 85%; }
  100% { left: -15%; }
}
</style>
