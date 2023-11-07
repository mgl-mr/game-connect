<template>
  <div class="component">
    <div class="pick-game">
      <div class="chosen-game">
        <p>Jogo selecionado</p>

        <div>
          <div v-if="game.length === 0" class="no-game"></div>
          <img
            v-else
            :src="game[0].imageURL"
            :alt="game[0].name"
            class="game-image"
          >
          <p v-if="game.length !== 0">{{ game[0].name }}</p>
          <p v-else>Nenhum jogo selecionado</p>
        </div>
      </div>
      <GamePicker
        :list="game"
        :pick="pickGame"
        :max=1
        :full=true
        :initialGamesNumber=40
        class="container-gamer-picker"
      />
    </div>

    <div class="form">
      <div class="input-container">
        <p>Dê um nome para o Lobby:</p>
        <input
          class="input"
          type="text"
          placeholder="Digite o nome"
          v-model="lobby.name"
        >
      </div>

      <div class="input-container">
        <p>Descrição do Lobby:</p>
        <textarea
          class="input"
          placeholder="Descrição"
          v-model="lobby.description"
        ></textarea>
      </div>

      <div class="input-container">
        <p>Número de jogadores(min. 2 max. 30):</p>
        <input
          class="input"
          type="number"
          placeholder="2"
          v-model="lobby.numMaxGamers"
        >
      </div>

      <div class="input-container">
        <p>Lobby privado(somente convidados):</p>
        <div class="checkbox-container">
          <input
            class="checkbox"
            type="checkbox"
            v-model="lobby.private"
          >
          Privado
        </div>
      </div>

      <div class="input-container">
        <p>Qualquer integrante pode enviar convites:</p>
        <div class="checkbox-container">
          <input
            class="checkbox"
            type="checkbox"
            v-model="lobby.invite"
          >
          Convidar
        </div>
      </div>

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

      <div class="button-create">
        <div class="button-loading" :class="{'loading':loading}"></div>
        <button
          type="button"
          class="create"
          @click="createLobby"
        >
          CRIAR LOBBY
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import GamePicker from '@/components/GamePicker.vue';

export default {
  name: 'CreateLobby',
  components: { GamePicker },

  data() {
    return {
      lobby: {
        name: '',
        description: '',
        numMaxGamers: '',
        private: false,
        invite: false,
        game: {},
      },
      game: [],
      error: false,
      msgError: false,
      msg: '',
      loading: false,
    };
  },

  methods: {
    async createLobby() {
      if (!this.loading) {
        if (this.validate()) {
          // eslint-disable-next-line prefer-destructuring
          this.lobby.game = this.game[0];

          this.loading = true;
          const response = await this.$store.dispatch('saveLobby', {
            lobby: this.lobby,
            create: true,
          });

          if (response) {
            this.$router.push('/application/lobby');
          } else {
            this.informError('Erro ao criar lobby.Verifique sua conexão');
          }
        }
      }
    },

    pickGame(game) {
      this.game = [game];
    },

    validate() {
      this.lobby.name = this.lobby.name.trim();
      this.lobby.name = this.lobby.name.replace(/\s+/g, ' ');

      this.lobby.description = this.lobby.description.trim();
      this.lobby.description = this.lobby.description.replace(/\s+/g, ' ');

      if (this.game.length === 0) {
        this.informError('Selecione um jogo!');
        return false;
      }

      if (this.lobby.name.length < 3 || this.lobby.name.length > 30) {
        this.informError('Nome deve ter entre 3 a 30 caracteres.');
        return false;
      }

      if (this.lobby.description.length < 10 || this.lobby.description.length > 100) {
        this.informError('Descrição deve ter entre 10 a 100 caracteres.');
        return false;
      }

      if (typeof this.lobby.numMaxGamers !== 'number' || this.lobby.numMaxGamers < 2 || this.lobby.numMaxGamers > 30) {
        this.informError('Número de participantes deve ser entre 2 a 30.');
        return false;
      }
      this.lobby.numMaxGamers = parseInt(this.lobby.numMaxGamers, 10);

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
};
</script>

<style scoped>
.component {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: calc(85vh - 40px);
  margin: 0 auto;
  padding: 20px 0;
}

.pick-game {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 45%;
  height: 100%;
}

.chosen-game {
  width: 100%;
  background-color: var(--dark);
  border-radius: 15px;
}

.chosen-game  p {
  width: calc(100% - 12vh - 30px);
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  margin: 15px;
}

.chosen-game > div {
  margin: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.no-game,
.game-image {
  width: 80px;
  height: 80px;
  border-radius: 15px;
}

.no-game {
  background-color: var(--white);
}

.container-gamer-picker {
  width: 100%;
  height: calc(100% - 170px);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  height: 100%;
}

.input-container {
  width: 100%;
  background-color: var(--dark);
  border-radius: 15px;
  color: var(--white);
  font-family: var(--pressStart);
  font-size: 10px;
  color: var(--white);
}

.input-container > p {
  width: calc(100% - 20px);
  font-family: var(--pressStart);
  font-size: 10px;
  color: var(--white);
  margin: 10px 10px 0 10px;
}

.input-container .input {
  width: calc(100% - 20px);
  font-family: var(--pressStart);
  font-size: 10px;
  color: var(--white);
  margin: 10px;
  padding: 3px;
  border: 1px solid var(--white);
  background-color: var(--primary);
  border-radius: 5px;
  outline: none;
}

.input-container input {
  text-align: center;
}

.input-container .input:focus {
  box-shadow: 0 0 3px 1px var(--white);
}

.input-container .input::placeholder {
  color: var(--white);
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: calc(100% - 20px);
}

.checkbox {
  margin: 10px;
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
  height: 7vh;
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
  font-size: 1.8vw;
}

.create:hover {
  cursor: pointer;
  font-size: 2vw;
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
