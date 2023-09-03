<template>
  <div class="component">
    <p v-show="showInfo" class="match-info">
      A funcionalidade de matchmaking tem como objetivo facilitar a descoberta de jogadores que atendam às suas preferências. Uma vez que você tenha especificado o jogo desejado, seu nível no jogo (como classificação, elo ou patente), o tipo de partida que deseja (casual ou competitiva) e a idade, o sistema se encarregará de identificar jogadores que se alinhem com esses critérios. Assim que uma correspondência for encontrada, o sistema irá estabelecer automaticamente uma chamada de voz entre os dois jogadores, permitindo que possam se conectar e interagir.
    </p>

    <div class="container-match-form">
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

      <div class="match-form">
        <div class="age-container">
          <p>Deseja encontrar alguém com qual idade?</p>
          <div>
            <div>
              <label for="min">De</label>
              <input
                placeholder="0"
                type="number"
                id="min"
                class="age"
                :class="{'read-only': anyAge}"
                v-model="minAge"
                :readonly="anyAge"
              >
              <label for="max">A</label>
              <input
                placeholder="99"
                type="number"
                id="max"
                class="age"
                :class="{'read-only': anyAge}"
                v-model="maxAge"
                :readonly="anyAge"
              >
            </div>
            <div>
              <input
                type="checkbox"
                id="any-age"
                v-model="anyAge"
              >
              <label for="any-age">Qualquer</label>
            </div>
          </div>
        </div>

        <div class="level-container">
          <p>Qual seu level?</p>
          <select
            v-model="myLevel"
            name="level"
            class="level"
          >
            <option value="bronze" selected>Bronze</option>
            <option value="silver">Prata</option>
            <option value="gold">Ouro</option>
            <option value="platinum">Platina</option>
            <option value="diamond">Diamante</option>
          </select>
        </div>

        <div class="level-container">
          <p>Qual level está procurando?</p>
          <select
            v-model="wantedLevel"
            name="level"
            class="level"
          >
            <option value="any" selected>Qualquer</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Prata</option>
            <option value="gold">Ouro</option>
            <option value="platinum">Platina</option>
            <option value="diamond">Diamante</option>
          </select>
        </div>

        <div class="type">
          <p>Deseja alguém para jogar:</p>
          <div>
            <div>
              <input
                v-model="type"
                type="radio"
                id="casual"
                name="playstyle"
                value="casual"
              >
              <label for="casual">Casualmente</label>
            </div>

            <div>
              <input
                v-model="type"
                type="radio"
                id="competitive"
                name="playstyle"
                value="competitive"
              >
              <label for="competitive">Competitivamente</label>
            </div>

            <div>
              <input
                v-model="type"
                type="radio"
                id="any"
                name="playstyle"
                value="any"
              >
              <label for="any">Qualquer</label>
            </div>
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
          <button
            type="button"
            class="create"
            @click="createMatch"
          >
            MATCH
          </button>
          <p
            class="show-info"
            @mouseover="showInfo = true"
            @mouseleave="showInfo = false"
          >
            ?
          </p>
        </div>
      </div>
    </div>
    <MatchLoading :cancel="cancel" v-show="$store.state.match.inMatch"/>
  </div>
</template>

<script>
import GamePicker from '@/components/GamePicker.vue';
import MatchLoading from '@/components/MatchLoading.vue';

export default {
  name: 'Match',
  components: { GamePicker, MatchLoading },

  data() {
    return {
      game: [],
      myLevel: 'bronze',
      wantedLevel: 'any',
      type: null,
      minAge: '',
      maxAge: '',
      anyAge: false,
      msg: '',
      msgError: false,
      error: false,
      showInfo: false,
    };
  },

  methods: {
    pickGame(game) {
      this.game = [game];
    },

    async createMatch() {
      if (this.game.length === 0) {
        this.informError('Selecione um jogo!');
        return;
      }

      if (this.anyAge === false) {
        if (this.minAge === '' && this.maxAge === '') {
          this.informError('Selecione a idade que deseja!');
          return;
        }

        if (this.minAge > this.maxAge) {
          this.informError('A primeira idade deve ser menor!');
          return;
        }
      }

      if (this.type === null) {
        this.informError('Selecione o modo!');
        return;
      }

      const match = {
        gamerId: this.$store.state.user.id,
        gameId: this.game[0].id,
        myLevel: this.myLevel,
        wantedLevel: this.wantedLevel,
        type: this.type,
        anyAge: this.anyAge,
        minAge: this.minAge,
        maxAge: this.maxAge,
      };

      const birthdate = new Date(this.$store.state.user.birthdate);
      const age = Math.floor((new Date() - birthdate) / (365.25 * 24 * 60 * 60 * 1000));

      match.age = age;

      this.$store.state.match.inMatch = true;
      const result = await this.$store.dispatch('createMatch', match);

      if (!result) {
        this.$store.state.match.inMatch = true;
        this.informError('Erro ao criar Match!');
      }
    },

    cancel() {
      this.loading = false;
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
  flex-direction: column;
  position: relative;
}

.match-info {
  width: calc(45% - 20px);
  height: auto;
  margin: 10px 0;
  padding: 10px;
  border-radius: 15px;
  background-color: var(--white);
  font-size: 10px;
  font-family: var(--pressStart);
  color: var(--dark);
  line-height: 1.2;
  text-align: justify;
  position: absolute;
  right: 5%;
  bottom: 11vh;
}

.match-info::-webkit-scrollbar {
  width: 0px;
}

.container-match-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  height: 80vh;
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

.match-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  height: 100%;
}

.age-container {
  width: 100%;
  background-color: var(--dark);
  border-radius: 15px;
}

.age-container > p {
  width: calc(100% - 30px);
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  margin: 15px;
}

.age-container > div {
  display: flex;
  align-items: center;
  width: calc(100% - 30px);
  margin: 15px;
}

.age-container label {
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
}

.age-container .age {
  width: 90px;
  background-color: var(--primary);
  color: var(--white);
  font-family: var(--pressStart);
  text-align: center;
  margin-left: 5px;
  margin-right: 15px;
  border: none;
  border-radius: 5px;
}

.age-container .age::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.read-only {
  filter: grayscale(100%);
  pointer-events: none;
}

.level-container {
  width: 100%;
  background-color: var(--dark);
  border-radius: 15px;
}

.level-container > p {
  width: calc(100% - 30px);
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  margin: 15px;
}

.level {
  width: calc(100% - 30px);
  background-color: var(--primary);
  color: var(--white);
  margin: 0 15px 15px 15px;
  text-align: center;
  border: solid 1px var(--white);
  border-radius: 5px;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.level:hover {
  cursor: pointer;
}

.level option {
  background-color: var(--dark);
  color: var(--white);
}

.type {
  width: 100%;
  background-color: var(--dark);
  border-radius: 15px;
}

.type > p {
  width: calc(100% - 30px);
  font-family: var(--pressStart);
  font-size: 12px;
  color: var(--white);
  margin: 15px;
}

.type > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 15px 15px 15px;
}

.type label {
  font-family: var(--pressStart);
  color: var(--white);
  font-size: 10px;
}

.type label:hover,
.type input:hover {
  cursor: pointer;
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

.show-info {
  position:absolute;
  right: 10px;
  font-family: var(--pressStart);
  color: var(--white);
  font-size: 1.8vw;
  border-radius: 50%;
  margin: 0;
  transition: transform 0.2s ease-in-out;
}

.show-info:hover {
  cursor: help;
  transform: scale(1.1);
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

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
</style>
