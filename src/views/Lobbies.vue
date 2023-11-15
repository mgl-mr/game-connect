<template>
  <div class="component">
    <div class="button-create">
      <button
        type="button"
        class="create"
        @click="$router.push('/application/create-lobby')"
        >
        CRIAR LOBBY
      </button>
    </div>

    <div class="search-container">
      <div v-if="game.length === 0"></div>
      <img
        v-else
        :src="game[0].imageURL"
        :alt="game[0].name"
      >
      <p @click="choseGame = true">{{ gameName }}</p>
    </div>

    <div class="lobbies-container">
      <p v-if="lobbies.length === 0" class="info">{{ info }}</p>

      <div
        v-else
        v-for="lobby in lobbies" :key="lobby.id"
        class="lobby"
      >
        <img :src="lobby.game.imageURL" :alt="lobby.game.name">

        <div class="column"></div>

        <div class="name">
          <p>{{ lobby.name }}</p>
          <p>{{ lobby.description }}</p>
        </div>

        <div class="column"></div>

        <div class="enter-container">
          <p class="particiants">Participantes:  {{ lobby.numGamers }}/{{ lobby.numMaxGamers }}</p>

          <div class="div-error">
            <p
              class="error"
              :class="{'error-shake':error === lobby.id}"
            >
              Erro ao entrar no lobby
            </p>
          </div>

          <div class="button-enter">
            <div class="button-loading" :class="{'loading':entering === lobby.id}"></div>
            <button
              type="button"
              class="enter"
              @click="enterLobby"
            >
              ENTRAR
            </button>
          </div>
        </div>
      </div>

      <Loading v-show="loading" />
    </div>

    <GamePicker
      v-show="choseGame"
      :list="game"
      :pick="pickGame"
      :max=1
      :full=true
      :initialGamesNumber=40
      class="container-gamer-picker"
    />
  </div>
</template>

<script>
import GamePicker from '@/components/GamePicker.vue';
import Loading from '@/components/Loading.vue';

export default {
  name: 'Lobbies',
  components: { GamePicker, Loading },

  computed: {
    gameName() {
      if (this.game.length === 0) {
        return 'selecione um jogo';
      }

      return this.game[0].name;
    },
  },

  data() {
    return {
      game: [],
      lobbies: [],
      info: '',
      choseGame: false,
      loading: true,
      entering: '',
      error: '',
    };
  },

  methods: {
    async enterLobby() {
      // TODO: entrar loobby
    },

    pickGame(game) {
      this.game = [game];
      this.choseGame = false;
    },

    async loadLobbiesSuggestions() {
      const response = await this.$store.dispatch('loadLobbiesSuggestions');

      this.loading = false;

      if (response) {
        this.lobbies = response;

        response.length === 0 && (this.info = 'Nenhuma sugestão de Lobby.');
      } else {
        this.info = 'Erro ao carregar sugestões de lobbies';
      }
    },
  },

  beforeMount() {
    this.loadLobbiesSuggestions();
  },
};
</script>

<style scoped>
/*** COMPONENT ***/
.component {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 85vh;
  margin: 0 auto;
}

/*** CREATE BUTTON ***/
.button-create {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95%;
  background: transparent;
  border-radius: 15px;
  height: 4vh;
  border: 0.5vh solid var(--accent);
  margin-top: 10px;
}

.create {
  position: absolute;
  border: 0;
  border-radius: 10px;
  font-family: var(--pressStart);
  transition: font-size 0.2s ease-in-out;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  background-color: var(--accent);
  color: var(--primary);
  font-size: .8vw;
}

.create:hover {
  cursor: pointer;
  font-size: .9vw;
  text-shadow: 2px 4px 2px var(--white);
}

/*** SEARCH ***/
.search-container {
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 15px;
  background-color: var(--dark);
}

.search-container div,
.search-container img {
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin: 10px 0;
}

.search-container img {
  border: 1px solid var(--white);
}

.search-container p {
  width: calc(100% - 15%);
  font-family: var(--pressStart);
  font-size: 16px;
  background-color: var(--primary);
  color: var(--white);
  padding: 5px 0;
  text-align: center;
  border-radius: 15px;
  transition: font-size 0.2s ease-in-out;
}

.search-container p:hover {
  cursor: pointer;
  font-size: 18px;
  text-shadow: 0px 0px 2px var(--accent);
}

/*** GAMER PICKER ***/
.container-gamer-picker {
  position: absolute;
  width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 30px 1px var(--white);
}

/*** LOBBIES ***/
.lobbies-container {
  position: relative;
  width: 95%;
  height: calc(100% - 4vh - 130px);
  border-radius: 15px 15px 0 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.lobbies-container::-webkit-scrollbar {
  width: 0px;
}

.lobbies-container .info {
  width: 100%;
  font-family: var(--pressStart);
  font-size: 16px;
  color: var(--white);
  text-align: center;
}

.lobby {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: calc(100% - 2px);
  height: 140px;
  border: 1px solid var(--accent);
  border-radius: 15px;
  background-color: var(--dark);
  margin-bottom: 10px;
}

.lobby .column {
  width: 1px;
  height: 120px;
  background-color: var(--accent);
}

.lobby img {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  border: 1px solid var(--white);
}

.lobby .name,
.lobby .enter-container {
  width: 40%;
  height: 120px;
}

.lobby .name p {
  font-family: var(--pressStart);
  font-size: 16px;
  color: var(--white);
  margin: 0;
  text-align: center;
}

.lobby .name p:nth-child(2) {
  margin-top: 5px;
  font-size: 12px;
  word-break: break-word;
}

.enter-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}

.enter-container .particiants {
  width: 100%;
  font-family: var(--pressStart);
  font-size: 16px;
  color: var(--white);
  padding: 10px 0;
  text-align: center;
  background-color: var(--primary);
  border-radius: 15px;
  margin: 0;
}

.button-enter {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  border: 0.5vh solid var(--accent);
  background: transparent;
  border-radius: 15px;
}

.button-loading {
  display: none;
  position: absolute;
  left: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(to right, var(--primary), var(--white));
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.enter {
  position: absolute;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  background-color: var(--accent);
  color: var(--primary);
  font-size: 16px;
  border: 0;
  border-radius: 10px;
  font-family: var(--pressStart);
  transition: font-size 0.2s ease-in-out;
}

.enter:hover {
  cursor: pointer;
  font-size: 20px;
  text-shadow: 2px 4px 2px var(--white);
}

.loading{
  display: block;
  animation: loading 2s linear infinite;
}

@keyframes loading {
  0% { left: -15%; }
  50% { left: 85%; }
  100% { left: -15%; }
}

/*** ERROR ***/
.div-error {
  height: 14px;
  margin: 0;
  text-align: center;
}

.error {
  display: none;
  margin: 0;
  font-size: 14px;
  font-family: var(--pressStart);
  color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
}

.error-shake {
  display: block;
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
</style>
