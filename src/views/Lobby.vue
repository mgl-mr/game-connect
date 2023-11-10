<template>
  <div class="component">
    <div class="container">
      <div class="form">
        <div class="base-info">
          <input
            v-if="$store.state.lobby.owner.id === $store.state.user.id"
            type="text"
            placeholder="Nome do lobby"
            class="name-input"
            v-model="lobby.name"
          >
          <p v-else class="name">{{ lobby.name }}</p>

          <textarea
            v-if="$store.state.lobby.owner.id === $store.state.user.id"
            v-model="lobby.description"
            placeholder="Descrição do Lobby"
            class="description-input"
          >
          </textarea>
          <p v-else class="description">{{ lobby.description }}</p>

          <div
            class="game"
            :class="{'game-hover': $store.state.lobby.owner.id === $store.state.user.id}"
            @click="choseGame = true"
          >
            <img :src="lobby.game.imageURL" :alt="lobby.game.name">
            <p>{{ lobby.game.name }}</p>
          </div>
        </div>

        <div class="config">
          <div class="participants">
            <p>Participantes:</p>
            <div v-if="$store.state.lobby.owner.id === $store.state.user.id">
              <p>{{ lobby.numGamers }}/</p>
              <input type="number" v-model="lobby.numMaxGamers">
            </div>
            <p v-else>{{ lobby.numGamers }}/{{ lobby.numMaxGamers }}</p>
          </div>

          <div class="checkbox-container">
            <p>Privado: </p>
            <input
              v-if="$store.state.lobby.owner.id === $store.state.user.id"
              class="checkbox"
              type="checkbox"
              v-model="lobby.private"
            >
            <div v-else-if="lobby.private">&#10003;</div>
            <div v-else>X</div>
          </div>

          <div class="checkbox-container">
            <p>Convidar: </p>
            <input
              v-if="$store.state.lobby.owner.id === $store.state.user.id"
              class="checkbox"
              type="checkbox"
              v-model="lobby.invite"
            >
            <div v-else-if="lobby.invite">&#10003;</div>
            <div v-else>X</div>
          </div>

          <div v-if="$store.state.lobby.owner.id === $store.state.user.id" class="button-create">
            <div class="button-loading" :class="{'loading':saveLoading}"></div>
            <button
              type="button"
              class="create"
              @click="updateLobby"
            >
              SALVAR
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container"></div>

    <div class="div-error">
      <p
        class="auth-error"
        :class="{
          'error':error,
          'input-error':msgError
        }"
      >
        {{ msg }}
      </p>
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

export default {
  name: 'Libby',
  components: { GamePicker },

  data() {
    return {
      lobby: {},
      game: [],
      saveLoading: false,
      choseGame: false,
      error: false,
      msgError: false,
      msg: '',
    };
  },
  methods: {
    async updateLobby() {
      if (!this.loading) {
        if (this.validate()) {
          this.loading = true;
          const response = await this.$store.dispatch('saveLobby', {
            lobby: this.lobby,
            create: false,
          });
          this.loading = false;

          if (response) {
            this.informError('Lobby atualizado com sucesso.');
          } else {
            this.informError('Erro ao criar lobby.Verifique sua conexão');
          }
        }
      }
    },

    pickGame(game) {
      this.game = [game];
      this.lobby.game = game;
      this.choseGame = false;
    },

    refreshLobby() {
      this.lobby = { ...this.$store.state.lobby };
    },

    validate() {
      this.lobby.name = this.lobby.name.trim();
      this.lobby.name = this.lobby.name.replace(/\s+/g, ' ');

      this.lobby.description = this.lobby.description.trim();
      this.lobby.description = this.lobby.description.replace(/\s+/g, ' ');

      if (this.lobby.name.length < 3 || this.lobby.name.length > 30) {
        this.informError('Nome deve ter entre 3 a 30 caracteres.');
        return false;
      }

      if (this.lobby.description.length < 10 || this.lobby.description.length > 90) {
        this.informError('Descrição deve ter entre 10 a 90 caracteres.');
        return false;
      }

      if (typeof this.lobby.numMaxGamers !== 'number' || this.lobby.numMaxGamers < 2 || this.lobby.numMaxGamers > 30) {
        this.informError('Número de participantes deve ser entre 2 a 30.');
        return false;
      }
      this.lobby.numMaxGamers = parseInt(this.lobby.numMaxGamers, 10);

      if (this.lobby.numMaxGamers < this.lobby.numGamers) {
        this.informError('Número de participantes Não pode ser menor que a quantidade atual.');
        return false;
      }

      return true;
    },

    informError(message) {
      this.msg = message;
      this.error = true;
      this.msgError = true;
      setTimeout(() => {
        this.msgError = false;
      }, 500);
    },
  },

  beforeMount() {
    this.refreshLobby();
  },
};
</script>

<style scoped>
.component {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: calc(85vh - 40px);
  margin: 0 auto;
  padding: 20px 0;
}

.component > div:nth-child(1) {
  height: 35%;
}

.component > div:nth-child(2) {
  height: 60%;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  background-color: brown;
}

/*** FORM / INFO ***/
.form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60%;
  height: 100%;
  border-radius: 15px;
  background-color: var(--dark);
}

.base-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 60%;
  height: calc(100% - 40px);
  margin-left: 10px;
  border: 2px solid var(--primary);
  border-radius: 15px;
  padding: 10px;
}

.base-info p {
  font-family: var(--pressStart);
  color: var(--white);
  margin: 0;
}

.base-info .name {
  width: 100%;
  font-size: 14px;
  word-break: break-all;
  text-align: center;
}

.base-info .name-input {
  width: 100%;
  font-size: 14px;
  text-align: center;
  background-color: var(--primary);
  color: var(--white);
  outline: none;
  border: none;
  border-radius: 10px;
}

.base-info .name-input:hover,
.base-info .description-input:hover,
.config .participants div input:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
}

.base-info .name-input::placeholder,
.base-info .description-input::placeholder {
  color: var(--white);
}

.base-info .description {
  width: 100%;
  font-size: 12px;
  text-align: center;
  color: var(--white);
}

.base-info .description-input {
  width: 100%;
  font-size: 14px;
  text-align: center;
  background-color: var(--primary);
  color: var(--white);
  outline: none;
  border: none;
  border-radius: 10px;
  resize: none;
}

.base-info .game {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.game-hover:hover {
  cursor: pointer;
}

.game img {
  width: 80px;
  height: 80px;
  border-radius: 15px;
}

.game p {
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  margin: 0;
  margin-left: 5px;
  word-break: break-all;
}

.config {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: calc(40% - 80px);
  height: calc(100% - 40px);
  margin: 0 10px;
  border: 2px solid var(--primary);
  border-radius: 15px;
  padding: 10px;
}

.config .participants > p:nth-child(1) {
  margin-bottom: 5px;
}

.config .participants div {
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config .participants div p {
  height: 8px;
}

.config .participants div input {
  width: 40px;
  font-size: 14px;
  text-align: center;
  background-color: var(--primary);
  color: var(--white);
  outline: none;
  border: none;
  border-radius: 10px;
  resize: none;
}

.config .checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.config .checkbox-container div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  font-size: 12px;
  background-color: var(--primary);
  border-radius: 2px;
  color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
}

.config p {
  font-family: var(--pressStart);
  color: var(--white);
  margin: 0;
  font-size: 10px;
  text-align: center;
}

.button-create {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 1vh);
  background: transparent;
  border-radius: 15px;
  margin-bottom: 1vh;
  height: 5vh;
  border: 0.5vh solid var(--accent);
}

.button-create:hover {
  box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
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
  font-size: 14px;
}

.create:hover {
  cursor: pointer;
  font-size: 18px;
  text-shadow: 2px 4px 2px var(--white);
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

.loading{
  display: block;
  animation: loading 2s linear infinite;
}

/*** CONTAINER GAMES ***/
.container-gamer-picker {
  position: absolute;
  width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 30px 1px var(--white);
}

/*** ERROR ***/
.div-error {
  top: 31vh;
  position: absolute;
  margin: 0;
  text-align: center;
}

.auth-error {
  display: none;
  margin: 0;
  font-size: 16px;
  color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
}

.error {
  display: block;
}

.input-error {
  color: var(--accent);
  animation: shake 0.5s;
}

@keyframes loading {
  0% { left: -100px; }
  50% { left: 100%; }
  100% { left: -100px; }
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
</style>
