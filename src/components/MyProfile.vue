<template>
  <div class="component">
    <div class="container-left">
      <div class="container-input user">
        <label for="image">
          <input
            v-show="false"
            type="file"
            id="image"
          >
          <img :src="user.imageURL" alt="imagem de perfil">
          <img
            src="@/assets/images/pick_image.png"
            alt="imagem de perfil"
            class="image-button"
          >
        </label>
        <div>
          <input
            class="input name"
            type="text"
            placeholder="Digite o seu nome"
            v-model="user.name"
          >
          <textarea
            class="input bio"
            type="text"
            placeholder="Digite o seu nome"
            v-model="user.bio"
          > </textarea>
        </div>
      </div>

      <div class="games-container">
        <p>Selecione seu jogos favoritos:</p>
        <div class="games">
          <div v-for="(game, id) in user.games" :key="id">
            <img :src="game.imageURL" @click="removeGame(game)" :alt="game.name">
          </div>
          <div v-for="index in numberOfDivs" :key="index"></div>
        </div>
      </div>
      <GamePicker
        :list="user.games"
        :pick="pickGame"
        :max=5
      />
    </div>
    <div class="container-right">
    </div>
  </div>
</template>

<script>
import GamePicker from './GamePicker.vue';

export default {
  name: 'MyProfile',
  components: { GamePicker },

  data() {
    return {
      user: null,
    };
  },

  computed: {
    numberOfDivs() {
      const arrayLength = this.user.games.length;
      const numberOfExtraDivs = Math.max(0, 5 - arrayLength);
      return numberOfExtraDivs;
    },
  },

  methods: {
    pickGame(game) {
      if (
        this.user.games.length === 5
        || this.user.games.some((g) => g.id === game.id)
      ) {
        return;
      }

      this.user.games.push(game);
    },

    removeGame(game) {
      const index = this.user.games.findIndex((g) => g.id === game.id);
      if (index !== -1) {
        this.user.games.splice(index, 1);
      }
    },
  },

  beforeMount() {
    this.user = { ...this.$store.state.user };
  },
};

</script>

<style>
.component {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.container-left,
.container-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 83vh;
}

.container-left {
  width: 50%;
}

.container-right {
  width: 40%;
  background-color: brown;
}

.container-input {
  width: calc(100% - 2px);
  border: 1px solid var(--accent);
  border-radius: 10px;
  background: linear-gradient(99.83deg, #B946FF 0%, #000000 100%);
}

.input {
  outline: 0;
  padding: 0;
  margin: 0;
  border: 0;
  background: none;
  color: var(--white);
}

.input::placeholder {
  color: var(--white);
}

/*** USER ***/
.user {
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.user label {
  width: 30%;
  height: 90%;
  position: relative;
}

.user label:hover {
  cursor: pointer;
  text-shadow: 0px 4px 4px var(--primary);
}

.user label:hover .image-button{
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;;
}

.user img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user .image-button{
  width: 30px;
  height: 30px;
  border-radius: 5x;
  position: absolute;
  bottom: 0;
  right: 0;
}

.user div {
  width: 60%;
  height: 90%;
  display: flex;
  flex-direction: column;
}

.name {
  width: 100%;
  height: 10%;
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--white);
}

.name:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.bio {
  width: 100%;
  height: calc(90% - 16px);
  overflow-x: hidden;
  overflow-y: hidden;
  resize: none;
}

.bio:hover {
  color: var(--accent);
}

/*** GAMES  ***/
.games-container {
  width: 100%;
  margin-top: 10px;
}

.games-container > p {
  font-size: 0.5rem;
  color: var(--white);
  font-family: var(--pressStart), Arial, Helvetica;
}

.games {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
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
</style>
